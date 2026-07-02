import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const { ref } = await ctx.params;
  
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
