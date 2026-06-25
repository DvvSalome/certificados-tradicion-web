import { NextResponse } from 'next/server';
import { recordGeneration } from '@/lib/admin';
import { orders } from '@/lib/orders';
import { sendAlert } from '@/lib/alerts';

export const runtime = 'nodejs';

// El robot/n8n reporta el resultado de cada generación. El panel lo captura en la bitácora;
// si falló, marca la orden FAILED y dispara alerta de fallo del flujo (WhatsApp+Email).
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

interface Body {
  reference?: string;
  matricula?: string;
  oficina?: string;
  status?: 'OK' | 'FAILED';
  costCents?: number | null;
  error?: string | null;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Body;
  if (!b.matricula || !b.oficina || (b.status !== 'OK' && b.status !== 'FAILED')) {
    return NextResponse.json({ error: 'matricula, oficina y status (OK|FAILED) requeridos' }, { status: 400 });
  }

  await recordGeneration({
    reference: b.reference, matricula: b.matricula, oficina: b.oficina,
    status: b.status, costCents: b.costCents ?? null, error: b.error ?? null,
  });

  if (b.status === 'OK') {
    if (b.reference) await orders.update(b.reference, { status: 'DELIVERED' });
  } else {
    if (b.reference) await orders.update(b.reference, { status: 'FAILED' });
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🔴 Falló la generación de un certificado',
      message: `No se pudo generar la matrícula ${b.matricula} (${b.oficina}). ${b.error ? 'Error: ' + b.error : ''} Revisa el robot/saldo.`,
      data: { matricula: b.matricula, oficina: b.oficina, referencia: b.reference ?? null, error: b.error ?? null },
    });
  }
  return NextResponse.json({ ok: true });
}
