import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { reenviarCtl } from '@/lib/email';
import { enviarDocumento, whatsappConfigured } from '@/lib/whatsapp';
import { verificarFirmaDelCrm } from '@/lib/crm';

export const runtime = 'nodejs';

// Reenvía el CTL de un pedido por correo o WhatsApp. Usa el cert_pdf guardado (sin re-tocar el SNR
// → no cuesta). Lo dispara el panel (sesión de admin) o el asesor desde el CRM (petición firmada).
export async function POST(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const raw = await req.text();
  if (!(await getSession()) && !verificarFirmaDelCrm(req, raw)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });
  const { ref } = await ctx.params;
  let channel: string | undefined;
  try { channel = (JSON.parse(raw || '{}') as { channel?: string }).channel; } catch { /* cuerpo inválido → 400 abajo */ }
  if (channel !== 'email' && channel !== 'whatsapp') return NextResponse.json({ error: 'channel debe ser email o whatsapp' }, { status: 400 });

  // cert_pdf como base64 (el pool de Vercel va por proxy HTTP con JSON.stringify → un Buffer llegaría corrupto).
  const { rows } = await getPool().query("SELECT encode(cert_pdf,'base64') AS cert_pdf_b64, matricula, oficina, email, phone FROM orders WHERE reference = $1", [ref]);
  const o = rows[0];
  if (!o || !o.cert_pdf_b64) return NextResponse.json({ error: 'Sin PDF guardado (aún no generado o purgado a las 48h)' }, { status: 404 });
  const pdf: Buffer = Buffer.from(o.cert_pdf_b64, 'base64');

  try {
    if (channel === 'email') {
      if (!o.email) return NextResponse.json({ error: 'El pedido no tiene correo' }, { status: 400 });
      await reenviarCtl(o.email, pdf, o.matricula, o.oficina);
      return NextResponse.json({ ok: true, sentTo: o.email });
    }
    if (!o.phone) return NextResponse.json({ error: 'El pedido no tiene teléfono' }, { status: 400 });
    if (!whatsappConfigured()) return NextResponse.json({ error: 'WhatsApp no configurado' }, { status: 500 });
    await enviarDocumento(o.phone, pdf, `Certificado-Tradicion-${o.matricula}.pdf`,
      `Aquí tienes tu Certificado de Tradición y Libertad (matrícula ${o.matricula}). — Certitradición`);
    return NextResponse.json({ ok: true, sentTo: `+${o.phone}` });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message.slice(0, 200) }, { status: 502 });
  }
}
