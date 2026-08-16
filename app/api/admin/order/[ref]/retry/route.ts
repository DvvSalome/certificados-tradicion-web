import { NextResponse, after } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { triggerGenerarCTL } from '@/lib/n8n';
import { getTransaction } from '@/lib/wompi';
import { pedidoAlCrmPorRef } from '@/lib/crm';

export const runtime = 'nodejs';

// Reintenta la generación de un pedido FALLIDO. OJO: vuelve a generar en el SNR (cuesta). Solo superadmin,
// solo si el pedido está FAILED. Limpia el claim de idempotencia (generation_jobs) para que el robot pueda
// re-tomarlo, y re-dispara vía el puente. El operador decide (evita reintentos automáticos que dupliquen cobro).
export async function POST(_req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const role = await getSession();
  if (role !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });
  const { ref } = await ctx.params;

  const pool = getPool();
  const { rows } = await pool.query('SELECT reference, matricula, oficina, email, phone, status, plan, transaction_id, amount_in_cents FROM orders WHERE reference = $1', [ref]);
  const o = rows[0];
  if (!o) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  if (o.status !== 'FAILED') return NextResponse.json({ error: `Solo se reintentan pedidos FALLIDOS (este está ${o.status})` }, { status: 400 });

  // ANTI-PÉRDIDA: 'FAILED' agrupa dos casos — (a) generación fallida de un pedido YA PAGADO (reintentable) y
  // (b) PAGO RECHAZADO estando en PENDING_PAYMENT (el cliente NUNCA pagó). Regenerar (b) fabrica un CTL que se
  // cobra al SNR con cero ingreso. Por eso re-verificamos el pago contra Wompi (fuente de verdad) antes de
  // generar. Fail-CLOSED: sin transacción aprobada que cuadre ref+monto, NO se reintenta.
  if (!o.transaction_id) return NextResponse.json({ error: 'El pedido no tiene transacción de pago — no se reintenta (posible pago nunca realizado).' }, { status: 400 });
  const tx = await getTransaction(o.transaction_id);
  if (!tx || tx.status !== 'APPROVED' || tx.reference !== o.reference || Number(tx.amount_in_cents) !== Number(o.amount_in_cents)) {
    return NextResponse.json({ error: `El pago no está aprobado en Wompi (estado: ${tx?.status || 'no encontrado'}). No se reintenta para no generar sin cobro.` }, { status: 402 });
  }

  // Pago confirmado APROBADO → limpiar el candado de idempotencia y reabrir el pedido para re-generar.
  await pool.query('DELETE FROM generation_jobs WHERE reference = $1', [ref]);
  await pool.query("UPDATE orders SET status = 'PAID', attempts = 0, updated_at = now() WHERE reference = $1", [ref]);

  const r = await triggerGenerarCTL({
    reference: o.reference, matricula: o.matricula, oficina: o.oficina,
    email: o.email, phone: o.phone, transactionId: o.transaction_id ?? '', plan: o.plan,
  });
  if (!r.ok) return NextResponse.json({ error: 'No se pudo disparar la generación: ' + (r.error || r.status) }, { status: 502 });
  after(async () => { await pedidoAlCrmPorRef(ref); }); // espejo en /pedidos del CRM (quedó PAID de nuevo)
  return NextResponse.json({ ok: true, mocked: r.mocked });
}
