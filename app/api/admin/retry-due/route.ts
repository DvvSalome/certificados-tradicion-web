import { NextResponse } from 'next/server';
import { orders } from '@/lib/orders';

export const runtime = 'nodejs';

// El robot llama aquí periódicamente: reclama (atómico) los pedidos RETRYING vencidos → GENERATING
// y los devuelve para reintentar la generación. Autenticado con el mismo secreto del webhook.
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const limit = Number(process.env.GEN_RETRY_BATCH || 5);
  const due = await orders.claimRetryDue(limit);
  return NextResponse.json({
    orders: due.map((o) => ({ reference: o.reference, oficina: o.oficina, matricula: o.matricula, email: o.email })),
  });
}
