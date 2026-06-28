import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { sendAlert } from '@/lib/alerts';

export const runtime = 'nodejs';

// Barredora (reaper): red de seguridad final. Si un proceso muere entre el pago y la entrega (Browserless
// caído, robot reiniciado, callback perdido), la orden queda en GENERATING/PAID sin que NADIE avise. Este
// endpoint —llamado periódicamente por el robot— detecta esas órdenes atascadas y alerta UNA vez por orden.
// No reintenta solo (evita doble cobro al SNR si la generación sí había arrancado): el operador decide.
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, skipped: 'sin db' });

  const minutes = Number(process.env.REAPER_STUCK_MIN || 15);
  // UPDATE...RETURNING = claim atómico: marca attempts=1 al seleccionarlas, así dos llamadas concurrentes
  // (o cíclicas) NO re-alertan la misma orden. Solo toma las que pagaron pero llevan >N min sin terminar.
  const { rows } = await getPool().query<{ reference: string; matricula: string; oficina: string; status: string }>(
    `UPDATE orders SET attempts = attempts + 1, updated_at = now()
       WHERE status IN ('GENERATING', 'PAID')
         AND attempts = 0
         AND updated_at < now() - (($1 || ' minutes')::interval)
     RETURNING reference, matricula, oficina, status`,
    [String(minutes)],
  );

  for (const o of rows) {
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🔴 Pedido pagado ATASCADO sin certificado',
      message: `El pedido ${o.reference} (matrícula ${o.matricula}, ${o.oficina}) lleva más de ${minutes} min en ${o.status} sin completarse. El cliente PAGÓ — revisar el robot y reintentar la generación o devolver.`,
      data: { referencia: o.reference, matricula: o.matricula, oficina: o.oficina },
    });
  }

  return NextResponse.json({ ok: true, alertados: rows.length });
}
