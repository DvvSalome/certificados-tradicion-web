// Entrega del CTL por correo: plantilla premium + PDF adjunto + preview DIFUMINADO ("vista protegida").
// El preview es best-effort (try/catch): si falla, igual se envía el correo con el PDF adjunto.
import nodemailer from 'nodemailer';
import { ctlEmailHtml, ctlSubject } from './ctl-template.mjs';

const SMTP_USER = process.env.SMTP_USER || 'certificados@certitradicion.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SITE = process.env.APP_BASE_URL || 'https://certitradicion.com';

let transporter = null;
function tx() {
  if (!transporter) transporter = nodemailer.createTransport({ host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transporter;
}

// 1ª página del PDF → difuminada + candado "VISTA PROTEGIDA". Best-effort.
async function buildPreview(pdfBuffer) {
  try {
    const sharp = (await import('sharp')).default;
    const { pdfToPng } = await import('pdf-to-png-converter');
    const pages = await pdfToPng(pdfBuffer, { pagesToProcess: [1], viewportScale: 2 });
    const raw = pages[0].content;
    const blurred = await sharp(raw).resize({ width: 1040 }).blur(18).png().toBuffer();
    const { width, height } = await sharp(blurred).metadata();
    const cx = width / 2, cy = height / 2;
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0d1b2a" opacity="0.5"/>
      <g transform="translate(${cx},${cy - 56})">
        <circle r="58" fill="#ffffff" opacity="0.14"/>
        <rect x="-30" y="-2" width="60" height="46" rx="9" fill="#ffffff"/>
        <path d="M -19 -2 V -19 a 19 19 0 0 1 38 0 V -2" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
        <circle cx="0" cy="20" r="6" fill="#103A73"/>
      </g>
      <text x="${cx}" y="${cy + 52}" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="bold" fill="#ffffff" letter-spacing="2">VISTA PROTEGIDA</text>
      <text x="${cx}" y="${cy + 98}" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#cfe0f2">Descarga el PDF adjunto para ver tu certificado completo</text>
    </svg>`;
    return await sharp(blurred).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
  } catch (e) {
    console.error('[deliver] preview falló (se envía sin preview):', e.message);
    return null;
  }
}

export async function entregarCorreo({ pdf, matricula, oficina, email }) {
  if (!email) return { sent: false, reason: 'sin email' };
  if (!SMTP_PASS) return { sent: false, reason: 'sin SMTP_PASS' };
  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const preview = await buildPreview(pdf);
  const attachments = [{ filename: `Certificado-Tradicion-${matricula}.pdf`, content: pdf }];
  let previewCid = '';
  if (preview) { previewCid = 'ctlpreview'; attachments.push({ filename: 'vista-protegida.png', content: preview, cid: previewCid }); }

  await tx().sendMail({
    from: `"Certitradición" <${SMTP_USER}>`,
    to: email,
    subject: ctlSubject(matricula),
    html: ctlEmailHtml({ matricula, oficina, fecha, previewCid, descargaUrl: SITE, sitioUrl: SITE }),
    attachments,
  });
  return { sent: true, withPreview: !!preview };
}
