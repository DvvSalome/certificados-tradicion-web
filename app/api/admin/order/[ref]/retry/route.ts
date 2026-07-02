import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { triggerGenerarCTL } from '@/lib/n8n';

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
  const { rows } = await pool.query('SELECT reference, matricula, oficina, email, phone, status, plan, transaction_id FROM orders WHERE reference = $1', [ref]);
  const o = rows[0];
  if (!o) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  if (o.status !== 'FAILED') return NextResponse.json({ error: `Solo se reintentan pedidos FALLIDOS (este está ${o.status})` }, { status: 400 });

  // Limpiar el candado de idempotencia para permitir re-generar esta referencia, y reabrir el pedido.
  await pool.query('DELETE FROM generation_jobs WHERE reference = $1', [ref]);
  await pool.query("UPDATE orders SET status = 'PAID', attempts = 0, updated_at = now() WHERE reference = $1", [ref]);

  const r = await triggerGenerarCTL({
    reference: o.reference, matricula: o.matricula, oficina: o.oficina,
    email: o.email, phone: o.phone, transactionId: o.transaction_id ?? '', plan: o.plan,
  });
  if (!r.ok) return NextResponse.json({ error: 'No se pudo disparar la generación: ' + (r.error || r.status) }, { status: 502 });
  return NextResponse.json({ ok: true, mocked: r.mocked });
}
