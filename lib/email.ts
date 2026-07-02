// Envío de correo desde el web (reenvío del CTL desde el panel admin). El robot tiene su propia entrega
// (plantilla completa con preview); esto es un reenvío operativo simple con el PDF adjunto. Hostinger SMTP.
import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

let transporter: nodemailer.Transporter | null = null;
function tx() {
  if (!transporter) transporter = nodemailer.createTransport({ host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transporter;
}

export function emailConfigured(): boolean {
  return !!SMTP_USER && !!SMTP_PASS;
}

const esc = (s: string) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]!));

// Reenvía el CTL (PDF adjunto) a un correo. Lanza si SMTP no está configurado o el envío falla.
export async function reenviarCtl(to: string, pdf: Buffer, matricula: string, oficina: string): Promise<void> {
  if (!emailConfigured()) throw new Error('SMTP no configurado (SMTP_USER/SMTP_PASS)');
  const brand = '#6B21A8', ink = '#2E1065', muted = '#6B7280';
  const html = `<!DOCTYPE html><html lang="es"><body style="margin:0;background:#F5F3FF;font-family:'Helvetica Neue',Arial,sans-serif;padding:28px 12px">
    <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px -18px rgba(16,58,115,.3)">
      <tr><td style="background:${brand};padding:22px 30px"><span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-.4px">Certitradición</span></td></tr>
      <tr><td style="padding:26px 30px">
        <h1 style="margin:0 0 8px;color:${ink};font-size:21px;font-weight:800">Tu certificado (reenvío)</h1>
        <p style="margin:0 0 14px;color:${muted};font-size:14px;line-height:1.6">Adjuntamos nuevamente tu <b>Certificado de Tradición y Libertad</b> de la matrícula <b>${esc(matricula)}</b> (${esc(oficina)}), listo para descargar e imprimir.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="background:#e6f4ee;border:1px solid #bfe3d2;border-radius:14px;margin-top:6px"><tr><td style="padding:12px 18px;color:#059669;font-size:14px;font-weight:700">📎 Certificado PDF adjunto</td></tr></table>
        <p style="margin:18px 0 0;color:#9CA3AF;font-size:11px;line-height:1.6">Certitradición · Servicio de gestión privado. No somos canal oficial de la SNR; facilitamos el trámite en tu nombre.</p>
      </td></tr>
    </table></body></html>`;
  await tx().sendMail({
    from: `"Certitradición" <${SMTP_USER}>`,
    to,
    replyTo: SMTP_USER,
    subject: `Tu Certificado de Tradición y Libertad — matrícula ${matricula}`,
    text: `Adjuntamos tu Certificado de Tradición y Libertad de la matrícula ${matricula} (${oficina}).\n\n— Certitradición`,
    html,
    attachments: [{ filename: `Certificado-Tradicion-${matricula}.pdf`, content: pdf }],
  });
}
