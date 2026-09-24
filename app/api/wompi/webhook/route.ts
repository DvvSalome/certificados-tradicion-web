import { NextResponse, after } from 'next/server';
import { verifyEvent, getTransaction } from '@/lib/wompi';
import { orders } from '@/lib/orders';
import { triggerGenerarCTL } from '@/lib/n8n';
import { sendAlert } from '@/lib/alerts';
import { formatCOP } from '@/lib/config';
import { capiPurchase } from '@/lib/meta-capi';
import { registrarEventoWompi } from '@/lib/wompi-log';
import { pedidoAlCrmPorRef } from '@/lib/crm';

export const runtime = 'nodejs';

interface WompiEvent {
  event?: string;
  data?: { transaction?: { id?: string; reference?: string; status?: string } };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as WompiEvent | null;
  // Cada salida queda en la bitácora (wompi_events) → el panel puede decir si Wompi reporta.
  if (!body || !verifyEvent(body)) {
    await registrarEventoWompi({
      event: body?.event ?? null,
      reference: body?.data?.transaction?.reference ?? null,
      txStatus: body?.data?.transaction?.status ?? null,
      firmaOk: false,
      resultado: 'firma_invalida',
    });
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }
  const evLog = {
    event: body.event ?? null,
    reference: body.data?.transaction?.reference ?? null,
    txStatus: body.data?.transaction?.status ?? null,
    firmaOk: true,
  };
  if (body.event !== 'transaction.updated') {
    await registrarEventoWompi({ ...evLog, resultado: 'ignorado' });
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tx = body.data?.transaction;
  const reference = tx?.reference;
  if (!reference || !tx) {
    await registrarEventoWompi({ ...evLog, resultado: 'sin_referencia' });
    return NextResponse.json({ ok: true, noRef: true });
  }

  const order = await orders.get(reference);
  if (!order) {
    await registrarEventoWompi({ ...evLog, resultado: 'referencia_desconocida' });
    return NextResponse.json({ ok: true, unknownRef: true });
  }

  if (tx.status === 'APPROVED') {
    // Claim ATÓMICO e idempotente: PENDING_PAYMENT -> GENERATING. Solo el ganador procede (sin doble generación).
    const claimed = await orders.claimForGeneration(reference, String(tx.id));
    if (!claimed) {
      await registrarEventoWompi({ ...evLog, resultado: 'ya_procesado' });
      return NextResponse.json({ ok: true, already: order.status });
    }

    // FUENTE DE VERDAD: re-consultar la transacción en Wompi y validar estado + referencia + MONTO + moneda.
    const real = await getTransaction(String(tx.id));
    const ok =
      real &&
      real.reference === reference &&
      real.status === 'APPROVED' &&
      real.amount_in_cents === claimed.amountInCents &&
      real.currency === 'COP';
    if (!ok) {
      console.warn('[wompi webhook] verificación de transacción falló', { reference, real });
      await orders.update(reference, { status: 'PENDING_PAYMENT' }); // revertir claim (permite reintento de Wompi)
      await registrarEventoWompi({ ...evLog, resultado: 'verificacion_fallida' });
      return NextResponse.json({ error: 'Verificación de transacción falló' }, { status: 400 });
    }

    // Meta CAPI: Purchase server-side con el pago YA verificado contra Wompi. Mismo
    // event_id que el pixel del navegador (la referencia) → Meta deduplica. Best-effort.
    await capiPurchase({
      reference,
      email: claimed.email,
      phone: claimed.phone,
      amountInCents: claimed.amountInCents,
    });

    const trig = await triggerGenerarCTL({
      reference,
      matricula: claimed.matricula,
      oficina: claimed.oficina,
      email: claimed.email,
      phone: claimed.phone,
      transactionId: String(tx.id),
      plan: claimed.plan ?? order.plan,
    });
    // Si el disparo al robot falló o está en modo MOCK, el cliente pagó pero NADIE generará el cert y la
    // orden quedaría colgada en GENERATING. Alertar de inmediato (la barredora es el respaldo final).
    if (!trig.ok || trig.mocked) {
      console.error('[wompi webhook] disparo de generación no efectivo', { reference, trig });
      await sendAlert({
        kind: 'generacion_fallida',
        title: '🔴 Pago aprobado pero NO se disparó la generación',
        message: `El pago de ${reference} (matrícula ${claimed.matricula}, ${claimed.oficina}) fue APROBADO, pero el disparo al robot ${trig.mocked ? 'está en MODO MOCK (N8N_GENERAR_CTL_URL sin configurar)' : 'falló (robot/n8n caído)'}. La orden quedó en GENERATING. Revisar y reintentar — el cliente ya pagó.`,
        data: { referencia: reference, matricula: claimed.matricula, oficina: claimed.oficina },
      });
    }
    await registrarEventoWompi({ ...evLog, resultado: 'aprobado' });

    // La venta BUENA también avisa (2026-08-15: una clienta compró y nadie se enteró
    // hasta horas después; solo alertábamos los fallos). n8n abanica a WhatsApp+correo,
    // y el espejo en el CRM enciende la campana y el módulo /pedidos.
    after(async () => {
      const monto = formatCOP(claimed.amountInCents / 100);
      await sendAlert({
        kind: 'venta_confirmada',
        title: `💰 Venta confirmada: ${monto}`,
        message: `Pago aprobado de ${reference}. Matrícula ${claimed.matricula} (${claimed.oficina}), plan ${claimed.plan ?? order.plan}. Cliente: ${[claimed.phone ? `WhatsApp +${claimed.phone}` : null, claimed.email].filter(Boolean).join(' · ') || 'sin contacto'}. El certificado se está generando.`,
        data: { referencia: reference, matricula: claimed.matricula, oficina: claimed.oficina, monto },
      });
      await pedidoAlCrmPorRef(reference);
    });
  } else if (tx.status && ['DECLINED', 'ERROR', 'VOIDED'].includes(tx.status)) {
    if (order.status === 'PENDING_PAYMENT') await orders.update(reference, { status: 'FAILED', transactionId: String(tx.id) });
    await registrarEventoWompi({ ...evLog, resultado: 'rechazado' });
    after(async () => { await pedidoAlCrmPorRef(reference); });
  }

  return NextResponse.json({ ok: true });
}
