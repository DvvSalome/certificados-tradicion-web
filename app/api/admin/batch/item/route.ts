import { NextResponse } from 'next/server';
import { reportItem } from '@/lib/batch';
import { sendAlert } from '@/lib/alerts';

export const runtime = 'nodejs';

// El robot reporta el resultado de un ítem del lote. Protegido por secret.
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

interface Body { itemId?: number; matricula?: string; oficina?: string; status?: 'OK' | 'FAILED'; costCents?: number | null; error?: string | null }

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Body;
  if (!b.itemId || (b.status !== 'OK' && b.status !== 'FAILED')) {
    return NextResponse.json({ error: 'itemId y status (OK|FAILED) requeridos' }, { status: 400 });
  }
  await reportItem(b.itemId, { status: b.status, costCents: b.costCents ?? null, error: b.error ?? null });

  if (b.status === 'FAILED') {
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🔴 Falló un ítem del lote',
      message: `No se pudo generar la matrícula ${b.matricula ?? '(?)'} (${b.oficina ?? '?'}) dentro de un lote. ${b.error ? 'Error: ' + b.error : ''}`,
      data: { matricula: b.matricula ?? null, oficina: b.oficina ?? null, error: b.error ?? null },
    });
  }
  return NextResponse.json({ ok: true });
}
