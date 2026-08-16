import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { pedidoAlCrm } from '@/lib/crm';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Backfill ÚNICO: empuja todos los pedidos históricos al módulo /pedidos del CRM.
// El receptor es idempotente por referencia y no retrocede estados, así que correrlo
// dos veces no duplica ni daña nada. Solo superadmin.
//
//   curl -X POST https://certitradicion.com/api/admin/backfill-crm -H "cookie: <sesión admin>"
//
// event_at = updated_at de cada orden: las fechas del panel del CRM quedan reales,
// no todas con la hora del backfill.
export async function POST() {
  if ((await getSession()) !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });

  const { rows } = await getPool().query(
    `SELECT reference, status, matricula, oficina, plan, email, phone, amount_in_cents, transaction_id,
            created_at, updated_at
     FROM orders ORDER BY created_at ASC LIMIT 500`,
  );

  let ok = 0;
  const fallos: string[] = [];
  for (const r of rows) {
    const res = await pedidoAlCrm(
      {
        reference: r.reference, status: r.status, matricula: r.matricula, oficina: r.oficina,
        plan: r.plan, email: r.email, phone: r.phone,
        amountInCents: r.amount_in_cents != null ? Number(r.amount_in_cents) : null,
        transactionId: r.transaction_id,
      },
      new Date(r.updated_at ?? r.created_at).toISOString(),
    );
    if (res.ok) ok += 1;
    else fallos.push(`${r.reference}: ${res.error}`);
    if (fallos.length && fallos[fallos.length - 1].includes('sin credenciales')) break; // sin env no tiene sentido seguir
  }

  return NextResponse.json({ ok: fallos.length === 0, total: rows.length, enviados: ok, fallos: fallos.slice(0, 10) });
}
