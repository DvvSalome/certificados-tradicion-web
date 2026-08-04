import nodemailer from 'nodemailer';
import fs from 'fs';
import sharp from 'sharp';
import { pdfToPng } from 'pdf-to-png-converter';
import { ctlEmailHtml, ctlSubject } from '../email/ctl-template.mjs';

const dir = 'recon/artifacts';
const pdfName = fs.readdirSync(dir).find((f) => f.endsWith('.pdf'));
const pdfPath = `${dir}/${pdfName}`;

console.log('renderizando 1ª página...');
const pages = await pdfToPng(pdfPath, { pagesToProcess: [1], viewportScale: 2 });
const rawPng = pages[0].content;

// DIFUMINAR + overlay candado "VISTA PROTEGIDA" (seguridad: no se lee el contenido)
const blurred = await sharp(rawPng).resize({ width: 1040 }).blur(18).png().toBuffer();
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
  <text x="${cx}" y="${cy + 98}" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#cfe0f2">Descarga el PDF para ver tu certificado completo</text>
</svg>`;
const protectedPng = await sharp(blurred).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
fs.writeFileSync(`${dir}/ctl-preview-protected.png`, protectedPng);
console.log('preview protegido:', protectedPng.length, 'bytes');

const transporter = nodemailer.createTransport({ host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
const matricula = '168410';
const info = await transporter.sendMail({
  from: '"Certitradición" <certificados@certitradicion.com>',
  to: 'four4gsolutions@gmail.com',
  subject: ctlSubject(matricula),
  html: ctlEmailHtml({ matricula, oficina: 'BARRANQUILLA', fecha: '25/06/2026', previewCid: 'ctlpreview', descargaUrl: 'https://certitradicion.com' }),
  attachments: [
    { filename: 'preview.png', content: protectedPng, cid: 'ctlpreview' },
    { filename: 'Certificado-Tradicion-168410.pdf', path: pdfPath },
  ],
});
console.log('OK enviado:', info.messageId, '->', info.accepted);
