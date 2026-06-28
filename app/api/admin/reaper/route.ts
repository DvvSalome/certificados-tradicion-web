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
  const { rows } = await getPool().query<{ reference: string; matricula: string; oficina: string; status: string; email: string | null; phone: string | null }>(
    `UPDATE orders SET attempts = attempts + 1, updated_at = now()
       WHERE status IN ('GENERATING', 'PAID')
         AND attempts = 0
         AND updated_at < now() - (($1 || ' minutes')::interval)
     RETURNING reference, matricula, oficina, status, email, phone`,
    [String(minutes)],
  );

  const panel = (process.env.APP_BASE_URL || 'https://certitradicion.com') + '/admin';
  for (const o of rows) {
    const contacto = [o.phone ? `WhatsApp +${o.phone}` : null, o.email].filter(Boolean).join(' · ') || 'sin datos de contacto';
    await sendAlert({
      kind: 'generacion_fallida',
      title: '🔴 Pedido pagado ATASCADO sin certificado',
      message: `Pedido ${o.reference} — matrícula ${o.matricula} (${o.oficina}) lleva más de ${minutes} min en ${o.status} sin completarse.\n📞 Contactar al cliente: ${contacto}\n🔧 Revisar en el panel: ${panel} — reintentar la generación o devolver. El cliente PAGÓ.`,
      data: { referencia: o.reference, matricula: o.matricula, oficina: o.oficina, email: o.email, phone: o.phone },
    });
  }

  // Purga de privacidad (minimización de datos, Ley 1581): el cert_pdf se guarda SOLO para reenviarlo por
  // WhatsApp dentro de la ventana de uso; tras CERT_PDF_TTL_HOURS (48h) se borra. El certificado sigue en el
  // historial de la cuenta SNR si alguna vez hace falta re-descargarlo. Somos enviadores, no archivadores.
  const ttlH = Number(process.env.CERT_PDF_TTL_HOURS || 48);
  const purged = await getPool().query(
    `UPDATE orders SET cert_pdf = NULL
       WHERE cert_pdf IS NOT NULL AND cert_pdf_at < now() - (($1 || ' hours')::interval)`,
    [String(ttlH)],
  );

  return NextResponse.json({ ok: true, alertados: rows.length, pdfPurgados: purged.rowCount ?? 0 });
}
