import { NextResponse } from 'next/server';
import { verifyEvent, getTransaction } from '@/lib/wompi';
import { orders } from '@/lib/orders';
import { triggerGenerarCTL } from '@/lib/n8n';

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

    await triggerGenerarCTL({
      reference,
      matricula: claimed.matricula,
      oficina: claimed.oficina,
      email: claimed.email,
      phone: claimed.phone,
      transactionId: String(tx.id),
      plan: claimed.plan ?? order.plan,
    });
  } else if (tx.status && ['DECLINED', 'ERROR', 'VOIDED'].includes(tx.status)) {
    if (order.status === 'PENDING_PAYMENT') await orders.update(reference, { status: 'FAILED', transactionId: String(tx.id) });
  }

  return NextResponse.json({ ok: true });
}
