import { NextResponse } from 'next/server';
import { recordGeneration } from '@/lib/admin';
import { orders } from '@/lib/orders';
import { sendAlert } from '@/lib/alerts';
import { refundForInvalidMatricula, refundExhausted } from '@/lib/refunds';

// Blindada: una falla transitoria (login/SNR/red) NO pierde el pedido — reintenta automáticamente
// cada GEN_RETRY_MIN min hasta GEN_MAX_ATTEMPTS; si se agotan, devuelve el pago automáticamente.
const MAX_ATTEMPTS = Number(process.env.GEN_MAX_ATTEMPTS || 12);
const RETRY_MIN = Number(process.env.GEN_RETRY_MIN || 12);

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
  errorCode?: 'NO_DISPONIBLE' | 'ERROR';
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
    // transición atómica: solo marca DELIVERED si seguía en curso (no pisa REFUNDED/FAILED por un reporte tardío).
    if (b.reference) await orders.transition(b.reference, ['GENERATING', 'PAID'], 'DELIVERED');
    return NextResponse.json({ ok: true });
  }

  // FALLO. Si fue por matrícula inválida/no disponible → DEVOLUCIÓN automática al cliente.
  if (b.errorCode === 'NO_DISPONIBLE' && b.reference) {
    const r = await refundForInvalidMatricula(b.reference);
    return NextResponse.json({ ok: true, refunded: r.refunded, manual: r.manual });
  }

  // Otro fallo (red/robot/SNR caído): TRANSITORIO → reintento automático. Sin reference no hay qué reintentar.
  if (!b.reference) {
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🔴 Falló una generación (sin referencia)',
      message: `No se pudo generar ${b.matricula} (${b.oficina}). ${b.error ? 'Error: ' + b.error : ''} Revisa el robot/saldo.`,
      data: { matricula: b.matricula, oficina: b.oficina, error: b.error ?? null },
    });
    return NextResponse.json({ ok: true });
  }

  const scheduled = await orders.scheduleRetry(b.reference, new Date(Date.now() + RETRY_MIN * 60_000));
  if (!scheduled) return NextResponse.json({ ok: true }); // reporte tardío/idempotente (ya DELIVERED/REFUNDED)

  if ((scheduled.attempts ?? 0) >= MAX_ATTEMPTS) {
    // agotados los reintentos → devolución de respaldo (el cliente recupera su plata).
    const r = await refundExhausted(b.reference);
    return NextResponse.json({ ok: true, exhausted: true, refunded: r.refunded, manual: r.manual });
  }

  // primera falla: una sola alerta (no spamear en cada reintento).
  if ((scheduled.attempts ?? 0) === 1) {
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🟠 Generación falló — reintentando sola',
      message: `Matrícula ${b.matricula} (${b.oficina}): fallo transitorio${b.error ? ' (' + b.error + ')' : ''}. Se reintenta automáticamente cada ${RETRY_MIN} min (hasta ${MAX_ATTEMPTS}); si no lo logra, se devuelve el pago solo. No hay que hacer nada.`,
      data: { matricula: b.matricula, oficina: b.oficina, referencia: b.reference, error: b.error ?? null },
    });
  }
  return NextResponse.json({ ok: true, retrying: true, attempts: scheduled.attempts });
}
