import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

// El robot empuja aquí el estado del pool de cuentas SNR (Vercel no alcanza al robot interno). Snapshot único
// (id=1). Auth con x-webhook-secret. ponytail: CREATE TABLE IF NOT EXISTS aquí = auto-migración de 1 tabla.
function authed(req: Request): boolean {
  const s = process.env.N8N_WEBHOOK_SECRET;
  return !!s && req.headers.get('x-webhook-secret') === s;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, skipped: 'sin db' });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const pool = getPool();
  await pool.query('CREATE TABLE IF NOT EXISTS snr_status (id INT PRIMARY KEY DEFAULT 1, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())');

  // El saldo por cuenta se lee sólo al loguear (para no quemar logins) y vive en memoria del robot, así que
  // tras un redeploy llega null. NO pisar el último saldo conocido con null: lo conservamos por cuenta.
  const prev = await pool.query('SELECT data FROM snr_status WHERE id = 1');
  const prevCuentas: { user: string; saldoCents: number | null }[] = prev.rows[0]?.data?.cuentas ?? [];
  const prevSaldo = new Map(prevCuentas.map((c) => [c.user, c.saldoCents]));
  if (Array.isArray(body.cuentas)) {
    for (const c of body.cuentas) {
      if (c.saldoCents == null && prevSaldo.get(c.user) != null) c.saldoCents = prevSaldo.get(c.user);
    }
  }

  await pool.query(
    'INSERT INTO snr_status (id, data, updated_at) VALUES (1, $1::jsonb, now()) ON CONFLICT (id) DO UPDATE SET data = $1::jsonb, updated_at = now()',
    [JSON.stringify(body)],
  );
  return NextResponse.json({ ok: true });
}
