import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyDownload } from '@/lib/download-token';

export const runtime = 'nodejs';

// Descarga del PDF por referencia + token firmado. `?doc=estudio` baja el Estudio de Títulos
// (plan Express); sin `doc`, el Certificado. El CRM enlaza estos mismos URLs desde /pedidos.
export async function GET(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const { ref } = await ctx.params;
  const url = new URL(req.url);

  // El PDF trae PII de terceros (propietarios). Se exige el token firmado que se emitió tras el pago
  // (viaja en la redirección a /estado). La sola referencia — que se filtra en correos/historial — NO basta.
  const token = url.searchParams.get('t');
  if (!verifyDownload(ref, token)) {
    return NextResponse.json({ error: 'Enlace de descarga inválido o vencido. Ábrelo desde el enlace que recibiste tras el pago, o pide tu certificado por WhatsApp.' }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    // Para el entorno local sin base de datos
    return NextResponse.json({ error: 'Descarga no disponible en modo memoria' }, { status: 404 });
  }

  const estudio = url.searchParams.get('doc') === 'estudio';
  try {
    // PDF como base64 (encode en SQL): el pool de Vercel va por un proxy HTTP con JSON.stringify → un
    // Buffer crudo llegaría corrupto como {"type":"Buffer",...}. Reconstruimos con Buffer.from.
    const { rows } = await getPool().query(
      `SELECT encode(${estudio ? 'estudio_pdf' : 'cert_pdf'},'base64') AS pdf_b64, matricula FROM orders WHERE reference = $1`,
      [ref],
    );
    const order = rows[0];

    if (!order || !order.pdf_b64) {
      return NextResponse.json({ error: estudio ? 'Estudio de Títulos no encontrado o aún no generado' : 'Documento no encontrado o aún no generado' }, { status: 404 });
    }

    const pdfBuffer = Buffer.from(order.pdf_b64, 'base64');
    const filename = estudio ? `Estudio-Titulos-${order.matricula}.pdf` : `Certificado-Tradicion-${order.matricula}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'private, no-store',
        'Content-Security-Policy': "frame-ancestors 'self' https://crm.fourgsolutions.com",
        'Content-Disposition': ` ${url.searchParams.get('preview') === '1' ? 'inline' : 'attachment'}; filename="${filename}"`.trim(),
      },
    });
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
