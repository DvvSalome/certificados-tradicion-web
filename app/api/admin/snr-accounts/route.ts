import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

// Cuentas SNR gestionadas DESDE EL PANEL (antes había que editar la env SNR_ACCOUNTS en
// EasyPanel y redesplegar). El robot lee esta tabla cada 3 min y las suma a su pool.
// La clave NUNCA se devuelve al cliente: solo se escribe.
async function tabla() {
  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS snr_accounts (
    usuario TEXT PRIMARY KEY,
    clave TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  return pool;
}

export async function GET() {
  if ((await getSession()) !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ cuentas: [] });
  const pool = await tabla();
  const { rows } = await pool.query('SELECT usuario, enabled, created_at FROM snr_accounts ORDER BY created_at');
  return NextResponse.json({ cuentas: rows });
}

export async function POST(req: Request) {
  if ((await getSession()) !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Sin base de datos' }, { status: 503 });
  const { usuario, clave } = (await req.json().catch(() => ({}))) as { usuario?: string; clave?: string };
  const u = String(usuario ?? '').trim().toUpperCase();
  const c = String(clave ?? '');
  // El usuario del SNR es la cédula, con o sin el prefijo CC.
  if (!/^(CC)?\d{5,15}$/.test(u)) return NextResponse.json({ error: 'Usuario inválido (debe ser la cédula, ej. CC22521092)' }, { status: 400 });
  if (c.length < 3) return NextResponse.json({ error: 'Clave demasiado corta' }, { status: 400 });

  const pool = await tabla();
  await pool.query(
    `INSERT INTO snr_accounts (usuario, clave, enabled) VALUES ($1, $2, true)
     ON CONFLICT (usuario) DO UPDATE SET clave = EXCLUDED.clave, enabled = true`,
    [u, c],
  );
  // El robot la recoge en su próxima pasada (≤3 min); no hace falta redeploy.
  return NextResponse.json({ ok: true, usuario: u });
}

export async function DELETE(req: Request) {
  if ((await getSession()) !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Sin base de datos' }, { status: 503 });
  const { usuario } = (await req.json().catch(() => ({}))) as { usuario?: string };
  const u = String(usuario ?? '').trim().toUpperCase();
  if (!u) return NextResponse.json({ error: 'Falta el usuario' }, { status: 400 });
  const pool = await tabla();
  await pool.query('DELETE FROM snr_accounts WHERE usuario = $1', [u]);
  return NextResponse.json({ ok: true });
}
