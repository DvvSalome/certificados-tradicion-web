// Entrega del CTL por correo: plantilla premium + PDF adjunto + preview DIFUMINADO ("vista protegida").
// El preview es best-effort (try/catch): si falla, igual se envía el correo con el PDF adjunto.
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { ctlEmailHtml, ctlEmailText, ctlSubject } from './ctl-template.mjs';

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
    const svg = `<svg width="168" height="168" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M34 9 H57 a7 7 0 0 1 7 7 V80 a7 7 0 0 1 -7 7 H23 a7 7 0 0 1 -7 -7 V26 Z"/>
      <path d="M16 26 H29 a5 5 0 0 0 5 -5 V9"/>
      <path d="M25 34 H53"/><path d="M25 43 H49"/><path d="M25 52 H53"/><path d="M25 61 H46"/>
      <path d="M25 75 c 4 -7 8 -5 9 1 c 1 5 5 5 7 -1 c 1 -4 5 -3 6 1 c 1 3 4 4 8 -1" stroke-width="4"/>
      <path d="M25 84 H50"/>
      <path d="M75.5 13.4 A 5.8 5.8 0 0 1 86 18.2 L 67.6 59.8 L 55 75.5 L 57 55.2 Z" fill="#ffffff" stroke="none"/>
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
      <g transform="translate(${cx},${cy - 60}) scale(1.35) translate(-48,-48)" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M34 9 H57 a7 7 0 0 1 7 7 V80 a7 7 0 0 1 -7 7 H23 a7 7 0 0 1 -7 -7 V26 Z"/>
        <path d="M16 26 H29 a5 5 0 0 0 5 -5 V9"/>
        <path d="M25 34 H53"/><path d="M25 43 H49"/><path d="M25 52 H53"/><path d="M25 61 H46"/>
        <path d="M25 75 c 4 -7 8 -5 9 1 c 1 5 5 5 7 -1 c 1 -4 5 -3 6 1 c 1 3 4 4 8 -1" stroke-width="4"/>
        <path d="M25 84 H50"/>
        <path d="M75.5 13.4 A 5.8 5.8 0 0 1 86 18.2 L 67.6 59.8 L 55 75.5 L 57 55.2 Z" fill="#ffffff" stroke="none"/>
      </g>
    </svg>`;
    return await sharp(blurred).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
  } catch (e) {
    console.error('[deliver] preview falló (se envía sin preview):', e.message);
    return null;
  }
}

// Guarda una copia del correo en la carpeta "Enviados" del buzón vía IMAP APPEND (Hostinger: imap.hostinger.com).
// Construye el MIME crudo con MailComposer (idéntico al enviado) y lo appendea a la carpeta \Sent.
async function guardarEnEnviados(message) {
  const raw = await new Promise((resolve, reject) => {
    new MailComposer(message).compile().build((err, msg) => (err ? reject(err) : resolve(msg)));
  });
  const client = new ImapFlow({ host: 'imap.hostinger.com', port: 993, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS }, logger: false });
  await client.connect();
  try {
    const boxes = await client.list();
    const sent = boxes.find((b) => b.specialUse === '\\Sent')?.path || 'Sent';
    await client.append(sent, raw, ['\\Seen']);
  } finally {
    await client.logout().catch(() => {});
  }
}

// Alerta operativa al admin (saldo bajo, etc.). Best-effort: si falla, solo loguea.
export async function enviarAlerta(subject, text) {
  const to = process.env.ADMIN_EMAIL || SMTP_USER;
  if (!SMTP_PASS) { console.error('[alerta] sin SMTP_PASS, no se envía: ' + subject); return; }
  await tx().sendMail({ from: `"Certitradición · Sistema" <${SMTP_USER}>`, to, subject, text });
}

export async function entregarCorreo({ pdf, matricula, oficina, email, reference, estudio }) {
  if (!email) return { sent: false, reason: 'sin email' };
  if (!SMTP_PASS) return { sent: false, reason: 'sin SMTP_PASS' };
  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const preview = await buildPreview(pdf);
  const attachments = [{ filename: `Certificado-Tradicion-${matricula}.pdf`, content: pdf }];
  if (estudio) attachments.push({ filename: `Estudio-Titulos-${matricula}.pdf`, content: estudio });
  let previewCid = '';
  if (preview) { previewCid = 'ctlpreview'; attachments.push({ filename: 'vista-protegida.png', content: preview, cid: previewCid }); }

  const logo = await brandLogoPng();
  let logoUrl = '';
  if (logo) { logoUrl = 'cid:ctllogo'; attachments.push({ filename: 'certitradicion.png', content: logo, cid: 'ctllogo' }); }

  const message = {
    from: `"Certitradición" <${SMTP_USER}>`,
    to: email,
    replyTo: SMTP_USER,
    subject: ctlSubject(matricula),
    text: ctlEmailText({ matricula, oficina, fecha, sitioUrl: SITE, conEstudio: !!estudio }),
    html: ctlEmailHtml({ matricula, oficina, fecha, previewCid, sitioUrl: SITE, logoUrl, conEstudio: !!estudio, waUrl: process.env.WHATSAPP_NUMBER ? `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero mi certificado ' + reference)}` : '' }),
    attachments,
  };
  await tx().sendMail(message);
  // Copia en la carpeta "Enviados" del webmail (IMAP APPEND). SMTP solo ENTREGA; la carpeta Enviados se
  // llena vía IMAP. Best-effort: el correo ya se envió, esto es solo la copia visible en el webmail.
  await guardarEnEnviados(message).catch((e) => console.error('[deliver] IMAP append (Enviados) falló — no crítico: ' + e.message));
  return { sent: true, withPreview: !!preview };
}
