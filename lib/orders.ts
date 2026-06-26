import { getPool } from './db';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'GENERATING' | 'RETRYING' | 'DELIVERED' | 'FAILED' | 'REFUND_PENDING' | 'REFUNDED';

export interface Order {
  reference: string;
  matricula: string;
  oficina: string;
  email: string | null;
  phone: string | null;
  amountInCents: number;
  status: OrderStatus;
  transactionId?: string;
  attempts?: number;
  nextRetryAt?: string | null;
  createdAt: string;
}

interface Store {
  create(o: Order): Promise<Order>;
  get(reference: string): Promise<Order | null>;
  update(reference: string, patch: Partial<Pick<Order, 'status' | 'transactionId'>>): Promise<Order | null>;
  // Claim ATÓMICO PENDING_PAYMENT -> GENERATING. Devuelve la orden si ESTE proceso ganó el claim, null si no.
  claimForGeneration(reference: string, transactionId: string): Promise<Order | null>;
  // Transición ATÓMICA condicional: pasa a `to` SOLO si el estado actual está en `from`.
  // Devuelve la orden si ganó (transicionó), null si el estado no era elegible (idempotencia/anti-carrera).
  transition(reference: string, from: OrderStatus[], to: OrderStatus): Promise<Order | null>;
  // Falla transitoria de generación → RETRYING + attempts++ + agenda next_retry_at. Solo desde GENERATING/PAID.
  scheduleRetry(reference: string, nextRetryAt: Date): Promise<Order | null>;
  // Reclama (atómico) los RETRYING vencidos → los pasa a GENERATING y los devuelve para reintentar.
  claimRetryDue(limit: number): Promise<Order[]>;
}

// ── Backend en memoria (solo dev local sin DATABASE_URL; NO usar en producción) ──
const mem = new Map<string, Order>();
const memStore: Store = {
  async create(o) { mem.set(o.reference, o); return o; },
  async get(r) { return mem.get(r) ?? null; },
  async update(r, patch) {
    const o = mem.get(r);
    if (!o) return null;
    const u = { ...o, ...patch };
    mem.set(r, u);
    return u;
  },
  async claimForGeneration(r, txId) {
    // Sync-atómico: Node es single-thread, no hay await entre el read y el write.
    const o = mem.get(r);
    if (!o || o.status !== 'PENDING_PAYMENT') return null;
    const u: Order = { ...o, status: 'GENERATING', transactionId: txId };
    mem.set(r, u);
    return u;
  },
  async transition(r, from, to) {
    const o = mem.get(r);
    if (!o || !from.includes(o.status)) return null;
    const u: Order = { ...o, status: to };
    mem.set(r, u);
    return u;
  },
  async scheduleRetry(r, nextRetryAt) {
    const o = mem.get(r);
    if (!o || !['GENERATING', 'PAID'].includes(o.status)) return null;
    const u: Order = { ...o, status: 'RETRYING', attempts: (o.attempts ?? 0) + 1, nextRetryAt: nextRetryAt.toISOString() };
    mem.set(r, u);
    return u;
  },
  async claimRetryDue(limit) {
    const now = Date.now();
    const due = [...mem.values()].filter((o) => o.status === 'RETRYING' && o.nextRetryAt && new Date(o.nextRetryAt).getTime() <= now).slice(0, limit);
    return due.map((o) => { const u: Order = { ...o, status: 'GENERATING' }; mem.set(o.reference, u); return u; });
  },
};

// ── Backend Postgres (producción) ──
type Row = {
  reference: string; matricula: string; oficina: string; email: string | null; phone: string | null;
  amount_in_cents: string | number; status: OrderStatus; transaction_id: string | null;
  attempts?: number | string | null; next_retry_at?: Date | string | null; created_at: Date | string;
};
function toOrder(row: Row): Order {
  return {
    reference: row.reference,
    matricula: row.matricula,
    oficina: row.oficina,
    email: row.email,
    phone: row.phone,
    amountInCents: Number(row.amount_in_cents), // pg devuelve BIGINT como string
    status: row.status,
    transactionId: row.transaction_id ?? undefined,
    attempts: Number(row.attempts ?? 0),
    nextRetryAt: row.next_retry_at ? (row.next_retry_at instanceof Date ? row.next_retry_at.toISOString() : String(row.next_retry_at)) : null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}
const pgStore: Store = {
  async create(o) {
    const { rows } = await getPool().query<Row>(
      `INSERT INTO orders (reference, matricula, oficina, email, phone, amount_in_cents, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [o.reference, o.matricula, o.oficina, o.email, o.phone, o.amountInCents, o.status],
    );
    return toOrder(rows[0]);
  },
  async get(r) {
    const { rows } = await getPool().query<Row>('SELECT * FROM orders WHERE reference = $1', [r]);
    return rows[0] ? toOrder(rows[0]) : null;
  },
  async update(r, patch) {
    const { rows } = await getPool().query<Row>(
      `UPDATE orders SET status = COALESCE($2, status), transaction_id = COALESCE($3, transaction_id), updated_at = now()
       WHERE reference = $1 RETURNING *`,
      [r, patch.status ?? null, patch.transactionId ?? null],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  },
  async claimForGeneration(r, txId) {
    const { rows } = await getPool().query<Row>(
      `UPDATE orders SET status = 'GENERATING', transaction_id = $2, updated_at = now()
       WHERE reference = $1 AND status = 'PENDING_PAYMENT' RETURNING *`,
      [r, txId],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  },
  async transition(r, from, to) {
    // UPDATE condicional = atómico: solo una request concurrente gana la transición.
    const { rows } = await getPool().query<Row>(
      `UPDATE orders SET status = $3, updated_at = now()
       WHERE reference = $1 AND status = ANY($2) RETURNING *`,
      [r, from, to],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  },
  async scheduleRetry(r, nextRetryAt) {
    const { rows } = await getPool().query<Row>(
      `UPDATE orders SET status = 'RETRYING', attempts = attempts + 1, next_retry_at = $2, updated_at = now()
       WHERE reference = $1 AND status IN ('GENERATING','PAID') RETURNING *`,
      [r, nextRetryAt.toISOString()],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  },
  async claimRetryDue(limit) {
    // reclamo atómico: pasa a GENERATING los RETRYING vencidos (FOR UPDATE SKIP LOCKED = sin doble proceso).
    const { rows } = await getPool().query<Row>(
      `UPDATE orders SET status = 'GENERATING', updated_at = now()
       WHERE reference IN (
         SELECT reference FROM orders WHERE status = 'RETRYING' AND next_retry_at <= now()
         ORDER BY next_retry_at ASC LIMIT $1 FOR UPDATE SKIP LOCKED
       ) RETURNING *`,
      [limit],
    );
    return rows.map(toOrder);
  },
};

export const orders: Store = process.env.DATABASE_URL ? pgStore : memStore;
