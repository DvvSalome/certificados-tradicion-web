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
  plan?: 'basico' | 'express';
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

const PROXY_URL = 'https://certificados.fourgsolutions.com/api/orders';
const SECRET = process.env.N8N_WEBHOOK_SECRET || '';

// (Antes aquí se desactivaba TLS GLOBAL con NODE_TLS_REJECT_UNAUTHORIZED='0' por un cert self-signed; el cert
//  de certificados.fourgsolutions.com ya es válido (Let's Encrypt) → se quitó. Así getTransaction() a Wompi
//  mantiene TLS estricto y no se puede falsificar un pago por MITM.)
async function callProxy(action: string, payload: any): Promise<any> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': SECRET
    },
    body: JSON.stringify({ action, payload })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Proxy error ${res.status}: ${txt}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(`Proxy error: ${json.error}`);
  return json.result;
}

const proxyStore: Store = {
  async create(o) { return await callProxy('create', o); },
  async get(r) { return await callProxy('get', { reference: r }); },
  async update(r, patch) { return await callProxy('update', { reference: r, patch }); },
  async claimForGeneration(r, txId) { return await callProxy('claimForGeneration', { reference: r, transactionId: txId }); },
  async transition(r, from, to) { return await callProxy('transition', { reference: r, from, to }); },
};

export const orders: Store = process.env.NODE_ENV === 'production' ? proxyStore : memStore;
