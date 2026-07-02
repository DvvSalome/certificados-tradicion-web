import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getPool } from '@/lib/db';
import { reenviarCtl } from '@/lib/email';
import { enviarDocumento, whatsappConfigured } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// Reenvía el CTL de un pedido por correo o WhatsApp desde el panel. Usa el cert_pdf guardado (sin re-tocar
// el SNR → no cuesta). Gated por sesión de admin.
export async function POST(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'sin db' }, { status: 404 });
  const { ref } = await ctx.params;
  const { channel } = (await req.json().catch(() => ({}))) as { channel?: 'email' | 'whatsapp' };
  if (channel !== 'email' && channel !== 'whatsapp') return NextResponse.json({ error: 'channel debe ser email o whatsapp' }, { status: 400 });

  const { rows } = await getPool().query('SELECT cert_pdf, matricula, oficina, email, phone FROM orders WHERE reference = $1', [ref]);
  const o = rows[0];
  if (!o || !o.cert_pdf) return NextResponse.json({ error: 'Sin PDF guardado (aún no generado o purgado a las 48h)' }, { status: 404 });
  const pdf: Buffer = o.cert_pdf;

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
