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

// Sello de marca (anillo punteado + "C" + check) como PNG transparent para el header del correo.
// Inline SVG no renderiza en clientes de correo → lo rasterizamos con sharp y lo adjuntamos como CID.
let _logoPng = null;
async function brandLogoPng() {
  if (_logoPng) return _logoPng;
  try {
    const sharp = (await import('sharp')).default;
    const svg = `<svg width="168" height="168" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="32" cy="32" r="29.5" stroke="#ffffff" stroke-width="2.4" stroke-dasharray="1.6 3.8" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.1"/>
      <path d="M42 24.5 A 12 12 0 1 0 42 39.5" stroke="#ffffff" stroke-width="5.6" fill="none" stroke-linecap="round"/>
      <path d="M37.6 32 l 2.4 2.4 l 5.4 -6.3" stroke="#34D399" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    _logoPng = await sharp(Buffer.from(svg)).png().toBuffer();
  } catch (e) {
    console.error('[deliver] logo falló (header sin sello):', e.message);
    _logoPng = null;
  }
  return _logoPng;
}

// 1ª página del PDF → difuminada + sello "VISTA PROTEGIDA". Best-effort.
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
      <circle cx="${cx}" cy="${cy - 60}" r="68" fill="#ffffff" opacity="0.10"/>
      <g transform="translate(${cx},${cy - 60}) scale(2) translate(-32,-32)">
        <circle cx="32" cy="32" r="29.5" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-dasharray="1.6 3.8" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="21" fill="none" stroke="#ffffff" stroke-width="1.1" opacity="0.25"/>
        <path d="M42 24.5 A 12 12 0 1 0 42 39.5" fill="none" stroke="#ffffff" stroke-width="5.6" stroke-linecap="round"/>
        <path d="M37.6 32 l 2.4 2.4 l 5.4 -6.3" fill="none" stroke="#34D399" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
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

export async function entregarCorreo({ pdf, matricula, oficina, email, reference }) {
  if (!email) return { sent: false, reason: 'sin email' };
  if (!SMTP_PASS) return { sent: false, reason: 'sin SMTP_PASS' };
  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const preview = await buildPreview(pdf);
  const attachments = [{ filename: `Certificado-Tradicion-${matricula}.pdf`, content: pdf }];
  let previewCid = '';
  if (preview) { previewCid = 'ctlpreview'; attachments.push({ filename: 'vista-protegida.png', content: preview, cid: previewCid }); }

  const logo = await brandLogoPng();
  let logoUrl = '';
  if (logo) { logoUrl = 'cid:ctllogo'; attachments.push({ filename: 'certitradicion.png', content: logo, cid: 'ctllogo' }); }

  await tx().sendMail({
    from: `"Certitradición" <${SMTP_USER}>`,
    to: email,
    subject: ctlSubject(matricula),
    html: ctlEmailHtml({ matricula, oficina, fecha, previewCid, sitioUrl: SITE, logoUrl }),
    attachments,
  });
  return { sent: true, withPreview: !!preview };
}
