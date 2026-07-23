import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';

export const runtime = 'nodejs';

// Consulta AHORA el saldo prepago en el portal del SNR (botón "Actualizar" del panel).
// El robot es quien tiene la sesión del SNR; aquí solo se le pide la lectura y él mismo
// publica el resultado en /api/admin/saldo. Ojo: si la sesión del robot murió, esta
// lectura gasta un login del SNR (recurso escaso), por eso va detrás de la sesión de admin.
export async function POST() {
  const role = await getSession();
  if (role !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });

  // Misma base que /generar (env del robot): http://certificados_robot:3000/generar → /saldo
  const base = (process.env.N8N_GENERAR_CTL_URL ?? '').replace(/\/generar\/?$/, '');
  const secret = process.env.N8N_WEBHOOK_SECRET ?? '';
  if (!base || !secret) return NextResponse.json({ error: 'Robot no configurado' }, { status: 503 });

  try {
    const r = await fetch(`${base}/saldo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-secret': secret },
      // Abrir el portal y leer tarda; el robot serializa contra las generaciones en curso.
      signal: AbortSignal.timeout(120_000),
    });
    const data = (await r.json().catch(() => ({}))) as { ok?: boolean; saldoCents?: number; cuenta?: string; error?: string };
    if (!r.ok || !data.ok) {
      return NextResponse.json({ error: data.error || `El robot respondió ${r.status}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, saldoCents: data.saldoCents, cuenta: data.cuenta });
  } catch (e) {
    const msg = e instanceof Error && e.name === 'TimeoutError'
      ? 'La lectura tardó demasiado (el robot puede estar generando un certificado). Intenta en un minuto.'
      : e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
