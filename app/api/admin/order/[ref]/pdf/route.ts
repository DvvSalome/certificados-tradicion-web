import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

// Ver/descargar el PDF del certificado desde el panel. Gated por sesión de admin (a diferencia de
// /api/order/[ref]/download que va por referencia). inline → se abre en el navegador.
export async function GET(_req: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });
  const { ref } = await ctx.params;
  // cert_pdf como base64 (el pool de Vercel va por proxy HTTP con JSON.stringify → un Buffer llegaría corrupto).
  const { rows } = await getPool().query("SELECT encode(cert_pdf,'base64') AS cert_pdf_b64, matricula FROM orders WHERE reference = $1", [ref]);
  const o = rows[0];
  if (!o || !o.cert_pdf_b64) return NextResponse.json({ error: 'Sin PDF (aún no generado o purgado a las 48h)' }, { status: 404 });
  return new NextResponse(Buffer.from(o.cert_pdf_b64, 'base64'), {
    status: 200,
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="Certificado-${o.matricula}.pdf"` },
  });
}
