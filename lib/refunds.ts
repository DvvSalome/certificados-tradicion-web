import { orders } from './orders';
import { voidTransaction } from './wompi';
import { sendAlert } from './alerts';
import { formatCOP } from './config';

// Devolución automática cuando la matrícula no existe/no está disponible (el cliente pagó pero no se
// pudo generar). Idempotente: no devuelve dos veces. Si el void de Wompi falla (p.ej. PSE/Nequi),
// deja la orden REFUND_PENDING y alerta a FourG para devolución MANUAL. El cliente nunca pierde plata.
export async function refundForInvalidMatricula(reference: string): Promise<{ refunded: boolean; manual: boolean }> {
  // CLAIM ATÓMICO anti-carrera: solo se devuelve desde un estado en curso (GENERATING/PAID), y solo
  // UNA request gana → nunca doble void, nunca refund sobre una orden ya DELIVERED/REFUNDED.
  const order = await orders.transition(reference, ['GENERATING', 'PAID'], 'REFUND_PENDING');
  if (!order) {
    const cur = await orders.get(reference);
    return { refunded: cur?.status === 'REFUNDED', manual: cur?.status === 'REFUND_PENDING' };
  }

  let refunded = false;
  if (order.transactionId) {
    const v = await voidTransaction(order.transactionId);
    refunded = v.ok;
    if (!v.ok) console.warn('[refund] void falló', reference, v.error);
  }
  await orders.update(reference, { status: refunded ? 'REFUNDED' : 'REFUND_PENDING' });

  const monto = formatCOP(order.amountInCents / 100);
  await sendAlert({
    kind: 'pago_fallido',
    title: refunded ? '↩️ Devolución automática realizada' : '⚠️ Devolución MANUAL requerida',
    message: refunded
      ? `Matrícula ${order.matricula} (${order.oficina}) no disponible. Se devolvió ${monto} al cliente automáticamente.`
      : `Matrícula ${order.matricula} (${order.oficina}) no disponible y la devolución automática NO fue posible (posible PSE/Nequi). DEVOLVER MANUAL ${monto}.`,
    data: { referencia: reference, matricula: order.matricula, monto, transaccion: order.transactionId ?? null },
  });
  return { refunded, manual: !refunded };
}
