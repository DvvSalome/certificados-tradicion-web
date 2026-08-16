import { NextResponse, after } from 'next/server';
import { recordGeneration } from '@/lib/admin';
import { orders } from '@/lib/orders';
import { sendAlert } from '@/lib/alerts';
import { refundForInvalidMatricula } from '@/lib/refunds';
import { pedidoAlCrmPorRef } from '@/lib/crm';

export const runtime = 'nodejs';

// Espeja el estado FINAL de la orden en el CRM (después de la transición, nunca antes).
// after(): en serverless un fire-and-forget suelto no llega a correr.
function espejarPedido(reference?: string): void {
  if (reference) after(async () => { await pedidoAlCrmPorRef(reference); });
}

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
  estudioFailed?: boolean; // Express: el Estudio falló (el CTL sí se entregó) → solo alerta, no cuenta generación.
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Body;

  // Express: el Estudio de Títulos falló pero el CTL YA se generó+entregó. NO es una generación nueva
  // (no se cuenta en la bitácora ni toca la orden) → solo alerta al admin para reenviar el Estudio manual.
  if (b.estudioFailed) {
    await sendAlert({
      kind: 'estudio_pendiente',
      title: '🟡 Estudio de Títulos pendiente (Express)',
      message: `El CTL de la matrícula ${b.matricula ?? '?'} (${b.oficina ?? '?'}) se entregó, pero el Estudio de Títulos falló. ${b.error ? 'Error: ' + b.error + '. ' : ''}Generar y reenviar el Estudio manual al cliente.`,
      data: { matricula: b.matricula ?? null, oficina: b.oficina ?? null, referencia: b.reference ?? null, error: b.error ?? null },
    });
    return NextResponse.json({ ok: true, estudioAlert: true });
  }

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
    espejarPedido(b.reference);
    return NextResponse.json({ ok: true });
  }

  // FALLO. Si fue por matrícula inválida/no disponible → DEVOLUCIÓN automática al cliente.
  if (b.errorCode === 'NO_DISPONIBLE' && b.reference) {
    const r = await refundForInvalidMatricula(b.reference);
    espejarPedido(b.reference);
    return NextResponse.json({ ok: true, refunded: r.refunded, manual: r.manual });
  }

  // Otro fallo (red/robot/SNR): es problema NUESTRO, no se devuelve solo → alerta para reintentar/gestionar.
  const ord = b.reference ? await orders.get(b.reference) : null;
  const contacto = ord ? ([ord.phone ? `WhatsApp +${ord.phone}` : null, ord.email].filter(Boolean).join(' · ') || 'sin datos de contacto') : 'sin datos de contacto';
  const panel = (process.env.APP_BASE_URL || 'https://certitradicion.com') + '/admin';
  if (b.reference) await orders.transition(b.reference, ['GENERATING', 'PAID'], 'FAILED');
  await sendAlert({
    kind: 'generacion_fallida',
    title: '🔴 Falló la generación de un certificado',
    message: `No se pudo generar ${b.reference ? b.reference + ' — ' : ''}matrícula ${b.matricula} (${b.oficina}). ${b.error ? 'Error: ' + b.error + '. ' : ''}\n📞 Contactar al cliente: ${contacto}\n🔧 Panel: ${panel} — revisar robot/saldo y gestionar reintento o devolución. El cliente PAGÓ.`,
    data: { matricula: b.matricula, oficina: b.oficina, referencia: b.reference ?? null, email: ord?.email ?? null, phone: ord?.phone ?? null, error: b.error ?? null },
  });
  espejarPedido(b.reference);
  return NextResponse.json({ ok: true });
}
