import { getPool } from './db';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'GENERATING' | 'DELIVERED' | 'FAILED' | 'REFUND_PENDING' | 'REFUNDED';

export interface Order {
  reference: string;
  matricula: string;
  oficina: string;
  email: string | null;
  phone: string | null;
  amountInCents: number;
  status: OrderStatus;
  transactionId?: string;
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
};

// ── Backend Postgres (producción) ──
type Row = {
  reference: string; matricula: string; oficina: string; email: string | null; phone: string | null;
  amount_in_cents: string | number; status: OrderStatus; transaction_id: string | null; created_at: Date | string;
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
};

export const orders: Store = process.env.DATABASE_URL ? pgStore : memStore;
