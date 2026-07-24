import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

// Bitácora de PASOS del visitante: para saber dónde se cae la gente. Sin esto, un
// visitante que llega y se va es indistinguible de uno que nunca llegó.
// Privacidad: NO se guarda IP, correo ni nada personal. Solo un id de sesión aleatorio
// que genera el navegador (anónimo, no identifica a la persona) + el paso y el origen.
const PASOS = new Set(['view', 'plan_click', 'form_start', 'validate_ok', 'validate_fail', 'checkout', 'paid']);

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, skipped: true });
  const b = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!b || !PASOS.has(b.event)) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const pool = getPool();
    await pool.query(`CREATE TABLE IF NOT EXISTS site_events (
      id BIGSERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      sid TEXT NOT NULL,
      event TEXT NOT NULL,
      path TEXT,
      utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT,
      ref TEXT
    )`);
    // Un índice por fecha: el panel siempre consulta por ventana de tiempo.
    await pool.query('CREATE INDEX IF NOT EXISTS site_events_at_idx ON site_events (at DESC)');
    const cut = (s: unknown, n: number) => (typeof s === 'string' && s ? s.slice(0, n) : null);
    await pool.query(
      `INSERT INTO site_events (sid, event, path, utm_source, utm_medium, utm_campaign, utm_content, ref)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        cut(b.sid, 40) ?? 'anon', b.event, cut(b.path, 200),
        cut(b.utm_source, 60), cut(b.utm_medium, 60), cut(b.utm_campaign, 80), cut(b.utm_content, 80),
        cut(b.ref, 120),
      ],
    );
  } catch (e) {
    // El tracking NUNCA debe romper la navegación del visitante.
    console.error('[track]', e instanceof Error ? e.message : e);
  }
  return NextResponse.json({ ok: true });
}
