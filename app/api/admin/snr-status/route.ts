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
  await pool.query(
    'INSERT INTO snr_status (id, data, updated_at) VALUES (1, $1::jsonb, now()) ON CONFLICT (id) DO UPDATE SET data = $1::jsonb, updated_at = now()',
    [JSON.stringify(body)],
  );
  return NextResponse.json({ ok: true });
}
