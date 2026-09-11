import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { pedidoAlCrmPorRef, verificarFirmaDelCrm } from '@/lib/crm';

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
export async function POST(req: Request) {
  // Sesión de superadmin del panel, o petición firmada desde el CRM (misma firma que resend/retry).
  if ((await getSession()) !== 'superadmin' && !verificarFirmaDelCrm(req, await req.text())) return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });

  const reference = new URL(req.url).searchParams.get('reference');
  if (reference !== null && (!reference || reference.length > 100)) return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 });
  const { rows } = await getPool().query(
    reference
      ? 'SELECT reference, created_at, updated_at FROM orders WHERE reference = $1'
      : 'SELECT reference, created_at, updated_at FROM orders ORDER BY created_at ASC LIMIT 500',
    reference ? [reference] : [],
  );

  let ok = 0;
  const fallos: string[] = [];
  for (const r of rows) {
    // El mismo camino que cada transición: así el backfill lleva también los PDFs y el último error.
    const res = await pedidoAlCrmPorRef(r.reference, new Date(r.updated_at ?? r.created_at).toISOString());
    if (res.ok) ok += 1;
    else fallos.push(`${r.reference}: ${res.error}`);
    if (fallos.length && fallos[fallos.length - 1].includes('sin credenciales')) break; // sin env no tiene sentido seguir
  }

  return NextResponse.json({ ok: fallos.length === 0, total: rows.length, enviados: ok, fallos: fallos.slice(0, 10) });
}
