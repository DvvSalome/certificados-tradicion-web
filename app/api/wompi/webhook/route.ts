import { NextResponse } from 'next/server';
import { verifyEvent, getTransaction } from '@/lib/wompi';
import { orders } from '@/lib/orders';
import { triggerGenerarCTL } from '@/lib/n8n';
import { sendAlert } from '@/lib/alerts';
import { capiPurchase } from '@/lib/meta-capi';

export const runtime = 'nodejs';

interface WompiEvent {
  event?: string;
  data?: { transaction?: { id?: string; reference?: string; status?: string } };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as WompiEvent | null;
  if (!body || !verifyEvent(body)) return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  if (body.event !== 'transaction.updated') return NextResponse.json({ ok: true, ignored: true });

  const tx = body.data?.transaction;
  const reference = tx?.reference;
  if (!reference || !tx) return NextResponse.json({ ok: true, noRef: true });

  const order = await orders.get(reference);
  if (!order) return NextResponse.json({ ok: true, unknownRef: true });

  if (tx.status === 'APPROVED') {
    // Claim ATÓMICO e idempotente: PENDING_PAYMENT -> GENERATING. Solo el ganador procede (sin doble generación).
    const claimed = await orders.claimForGeneration(reference, String(tx.id));
    if (!claimed) return NextResponse.json({ ok: true, already: order.status });

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
  } else if (tx.status && ['DECLINED', 'ERROR', 'VOIDED'].includes(tx.status)) {
    if (order.status === 'PENDING_PAYMENT') await orders.update(reference, { status: 'FAILED', transactionId: String(tx.id) });
  }

  return NextResponse.json({ ok: true });
}
