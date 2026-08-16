import { createHmac } from 'crypto';

// Empuja al comprador al CRM de FourG como contacto, para que el equipo pueda trabajarlo.
// Se llama JUSTO cuando se crea la orden, no cuando se paga: quien llenó todo (nombre, cédula,
// correo, WhatsApp) y no pagó es el lead más caliente que hay, y hasta ahora no quedaba en ninguna parte.
//
// BEST-EFFORT SIEMPRE: si el CRM está caído o lento, la venta sigue su curso. Nunca se hace await
// bloqueante del resultado en el camino del checkout ni se propaga el error.

const URL_CRM = process.env.CRM_INGEST_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/lead';
const URL_PEDIDOS = process.env.CRM_ORDER_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/order';
const KEY = process.env.CRM_INGEST_KEY ?? '';
const SECRET = process.env.CRM_INGEST_SECRET ?? '';

export interface LeadCrm {
  nombre?: string | null;
  email?: string | null;
  phone?: string | null;
  etapa?: 'interesado' | 'ganado';
  referencia: string;
  plan?: string | null;
  matricula?: string | null;
  oficina?: string | null;
  montoCents?: number | null;
  landingUrl?: string | null;
  utm?: Record<string, string> | null;
}

// ── Pedidos → CRM ────────────────────────────────────────────────────────────
// Espejo de la orden en el módulo /pedidos del CRM (misma llave y firma que el lead).
// Se empuja el ESTADO COMPLETO en cada transición: el receptor es idempotente por
// referencia y no retrocede estados, así que reenviar nunca daña (backfill incluido).
// Nace del 2026-08-15: una clienta compró y nadie se enteró hasta horas después.

export interface PedidoCrm {
  reference: string;
  status: string;               // los estados del sitio tal cual (PENDING_PAYMENT, PAID…)
  matricula?: string | null;
  oficina?: string | null;
  plan?: string | null;
  email?: string | null;
  phone?: string | null;
  amountInCents?: number | null; // centavos Wompi (COP*100), igual que orders.amount_in_cents
  transactionId?: string | null;
}

export async function pedidoAlCrm(p: PedidoCrm, eventAt?: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!KEY || !SECRET) return { ok: false, error: 'sin credenciales' };

  const body = JSON.stringify({
    source_key: KEY,
    external_ref: p.reference,
    status: p.status,
    event_at: eventAt || new Date().toISOString(),
    source: 'certitradicion',
    customer: { email: p.email ?? null, phone: p.phone ?? null, cc: '57' },
    amount_cents: p.amountInCents ?? null,
    currency: 'COP',
    transaction_id: p.transactionId ?? null,
    product: p.plan === 'express' ? 'CTL + Estudio Express' : 'CTL básico',
    item: { matricula: p.matricula ?? null, oficina: p.oficina ?? null, plan: p.plan ?? null },
  });
  const sig = 'sha256=' + createHmac('sha256', SECRET).update(body, 'utf8').digest('hex');

  try {
    const r = await fetch(URL_PEDIDOS, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-fourg-signature': sig },
      body,
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}

// Conveniencia para los puntos donde solo se tiene la referencia: lee la fila y empuja
// el estado ACTUAL (después de la transición, nunca antes).
export async function pedidoAlCrmPorRef(reference: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { getPool } = await import('./db');
    const { rows } = await getPool().query(
      'SELECT reference, status, matricula, oficina, plan, email, phone, amount_in_cents, transaction_id FROM orders WHERE reference = $1',
      [reference],
    );
    const r = rows[0];
    if (!r) return { ok: false, error: 'orden no encontrada' };
    return await pedidoAlCrm({
      reference: r.reference, status: r.status, matricula: r.matricula, oficina: r.oficina,
      plan: r.plan, email: r.email, phone: r.phone,
      amountInCents: r.amount_in_cents != null ? Number(r.amount_in_cents) : null,
      transactionId: r.transaction_id,
    });
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}

export async function enviarLeadAlCrm(l: LeadCrm): Promise<{ ok: boolean; error?: string }> {
  if (!KEY || !SECRET) return { ok: false, error: 'sin credenciales' }; // no configurado → no-op silencioso

  const body = JSON.stringify({
    source_key: KEY,
    name: l.nombre || null,
    email: l.email || null,
    phone: l.phone || null,
    cc: '57',
    stage_key: l.etapa || 'interesado',
    source: 'checkout',
    attributes: {
      referencia: l.referencia,
      plan: l.plan ?? null,
      matricula: l.matricula ?? null,
      oficina: l.oficina ?? null,
      // El CRM muestra pesos, no centavos: se convierte aquí para que el asesor lea $38.900.
      monto: l.montoCents != null ? Math.round(l.montoCents / 100) : null,
    },
    referral: {
      landing_url: l.landingUrl ?? null,
      ...(l.utm && Object.keys(l.utm).length ? { utm: l.utm } : {}),
    },
  });

  // La firma va sobre el string EXACTO que se envía (si se re-serializa, el hash deja de cuadrar).
  const sig = 'sha256=' + createHmac('sha256', SECRET).update(body, 'utf8').digest('hex');

  try {
    const r = await fetch(URL_CRM, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-fourg-signature': sig },
      body,
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}
