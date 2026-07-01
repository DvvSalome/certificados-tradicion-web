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

// 2º correo (solo Express): entrega el Estudio de Títulos aparte, cuando ya está listo. Va SEPARADO del CTL
// para que el certificado llegue de inmediato (el estudio puede tardar por la cola de NIM). Best-effort.
export async function entregarEstudio({ estudio, matricula, oficina, email }) {
  if (!estudio) return { sent: false, reason: 'sin estudio' };
  if (!email || !SMTP_PASS) return { sent: false, reason: 'sin email/SMTP' };
  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const logo = await brandLogoPng();
  const attachments = [{ filename: `Estudio-Titulos-${matricula}.pdf`, content: estudio }];
  let logoTag = '';
  if (logo) { attachments.push({ filename: 'certitradicion.png', content: logo, cid: 'estlogo' }); logoTag = `<img src="cid:estlogo" width="38" height="38" alt="" style="vertical-align:middle"/>`; }
  const html = `<div style="background:#f6f8fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(13,27,42,.08)">
      <div style="background:#774b78;padding:20px 28px">${logoTag}<span style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-.3px;margin-left:8px;vertical-align:middle">Certitradición</span></div>
      <div style="padding:28px">
        <h1 style="margin:0 0 10px;font-size:20px;color:#0d1b2a">Tu Estudio de Títulos está listo 📋</h1>
        <p style="margin:0 0 14px;color:#5b6b7e;font-size:15px;line-height:1.6">Terminamos el análisis del inmueble con matrícula <b>${matricula}</b> (${oficina}). Lo encuentras <b>adjunto en PDF</b>: propietarios actuales, gravámenes y limitaciones <b>vigentes</b>, banderas de riesgo y un semáforo con el estado jurídico.</p>
        <p style="margin:0 0 18px;color:#5b6b7e;font-size:15px;line-height:1.6">Este análisis complementa el Certificado de Tradición y Libertad que ya te enviamos.</p>
        <div style="background:#f5f0f6;border-radius:10px;padding:13px 16px;color:#4e324f;font-size:12.5px;line-height:1.55">⚖️ Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado.</div>
      </div>
      <div style="padding:14px 28px;border-top:1px solid #e3e9f1;color:#8593a3;font-size:12px;text-align:center">Certitradición · ${fecha} · <a href="${SITE}" style="color:#774b78;text-decoration:none">certitradicion.com</a></div>
    </div>
  </div>`;
  const text = `Tu Estudio de Títulos del inmueble (matrícula ${matricula}, ${oficina}) ya está listo — adjunto en PDF: propietarios, gravámenes/limitaciones vigentes, banderas de riesgo y semáforo. Complementa el Certificado que ya te enviamos.\n\n⚖️ Análisis informativo automatizado; no constituye asesoría jurídica ni reemplaza a un abogado.\n\n— Certitradición · ${SITE}`;
  const message = { from: `"Certitradición" <${SMTP_USER}>`, to: email, replyTo: SMTP_USER, subject: `Tu Estudio de Títulos está listo · Matrícula ${matricula}`, text, html, attachments };
  await tx().sendMail(message);
  await guardarEnEnviados(message).catch((e) => console.error('[deliver] IMAP append (estudio) falló — no crítico: ' + e.message));
  return { sent: true };
}
