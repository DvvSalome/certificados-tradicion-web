import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyDownload } from '@/lib/download-token';

export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const { ref } = await ctx.params;

  // El PDF trae PII de terceros (propietarios). Se exige el token firmado que se emitió tras el pago
  // (viaja en la redirección a /estado). La sola referencia — que se filtra en correos/historial — NO basta.
  const token = new URL(req.url).searchParams.get('t');
  if (!verifyDownload(ref, token)) {
    return NextResponse.json({ error: 'Enlace de descarga inválido o vencido. Ábrelo desde el enlace que recibiste tras el pago, o pide tu certificado por WhatsApp.' }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    // Para el entorno local sin base de datos
    return NextResponse.json({ error: 'Descarga no disponible en modo memoria' }, { status: 404 });
  }

  try {
    // cert_pdf como base64 (encode en SQL): el pool de Vercel va por un proxy HTTP con JSON.stringify → un
    // Buffer crudo llegaría corrupto como {"type":"Buffer",...}. Reconstruimos con Buffer.from.
    const { rows } = await getPool().query("SELECT encode(cert_pdf,'base64') AS cert_pdf_b64, matricula FROM orders WHERE reference = $1", [ref]);
    const order = rows[0];

    if (!order || !order.cert_pdf_b64) {
      return NextResponse.json({ error: 'Documento no encontrado o aún no generado' }, { status: 404 });
    }

    const pdfBuffer = Buffer.from(order.cert_pdf_b64, 'base64');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificado-Tradicion-${order.matricula}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
