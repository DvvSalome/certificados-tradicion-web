import { orders, type Order, type OrderStatus } from './orders';
import { voidTransaction } from './wompi';
import { sendAlert } from './alerts';
import { formatCOP } from './config';

// Devolución automática al cliente (el pagó pero no se pudo entregar el certificado). Idempotente:
// claim ATÓMICO anti-carrera (solo UNA request gana, nunca doble void ni refund sobre DELIVERED/REFUNDED).
// Si el void de Wompi falla (p.ej. PSE/Nequi), deja REFUND_PENDING y alerta para devolución MANUAL.
// El cliente NUNCA pierde plata.
async function doRefund(
  reference: string,
  from: OrderStatus[],
  msg: (o: Order, monto: string, refunded: boolean) => { title: string; message: string },
): Promise<{ refunded: boolean; manual: boolean }> {
  const order = await orders.transition(reference, from, 'REFUND_PENDING');
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
  const m = msg(order, monto, refunded);
  await sendAlert({
    kind: 'pago_fallido',
    title: m.title,
    message: m.message,
    data: { referencia: reference, matricula: order.matricula, monto, transaccion: order.transactionId ?? null },
  });
  return { refunded, manual: !refunded };
}

// Matrícula inexistente / no disponible (consultada en vivo) → devolución.
export function refundForInvalidMatricula(reference: string) {
  return doRefund(reference, ['GENERATING', 'PAID'], (o, monto, refunded) => ({
    title: refunded ? '↩️ Devolución automática realizada' : '⚠️ Devolución MANUAL requerida',
    message: refunded
      ? `Matrícula ${o.matricula} (${o.oficina}) no disponible. Se devolvió ${monto} al cliente automáticamente.`
      : `Matrícula ${o.matricula} (${o.oficina}) no disponible y la devolución automática NO fue posible (posible PSE/Nequi). DEVOLVER MANUAL ${monto}.`,
  }));
}

// Reintentos agotados (login/SNR/red caídos por mucho tiempo) → devolución de respaldo. Acepta RETRYING.
export function refundExhausted(reference: string) {
  return doRefund(reference, ['GENERATING', 'PAID', 'RETRYING'], (o, monto, refunded) => ({
    title: refunded ? '↩️ Devolución automática (no se pudo generar)' : '⚠️ Devolución MANUAL requerida',
    message: refunded
      ? `No se pudo generar la matrícula ${o.matricula} (${o.oficina}) tras varios reintentos automáticos. Se devolvió ${monto} al cliente.`
      : `No se pudo generar ${o.matricula} (${o.oficina}) tras varios reintentos y el void falló. DEVOLVER MANUAL ${monto}.`,
  }));
}
