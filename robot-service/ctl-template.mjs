// Plantilla de correo (HTML email-safe, estética premium adaptada) para entregar el CTL.
// El preview va DIFUMINADO + candado (se procesa como imagen, no por CSS — los clientes no soportan blur).
export const ctlSubject = (matricula) => `Tu Certificado de Tradición y Libertad — matrícula ${matricula}`;

// Versión TEXTO PLANO (multipart/alternative) — mejora entregabilidad: los correos solo-HTML puntúan
// peor en los filtros de spam (sobre todo en dominios nuevos / Outlook).
export function ctlEmailText({ matricula = '', oficina = '', fecha = '', sitioUrl = 'https://certitradicion.com', conEstudio = false } = {}) {
  return `Tu Certificado de Tradición y Libertad está listo.

Adjunto a este correo va tu certificado oficial en PDF, listo para descargar e imprimir.${conEstudio ? '\nTambién incluimos tu Estudio de Títulos (PDF) con el análisis de propietarios, gravámenes y banderas de riesgo del inmueble.' : ''}

Matrícula inmobiliaria: ${matricula}
Oficina de Registro: ${oficina}
Fecha de emisión: ${fecha}
Vigencia: 30 días

¿Dudas? Responde este correo o escríbenos a certificados@certitradicion.com

— Certitradición · ${sitioUrl}
Servicio de gestión privado. No formamos parte del Gobierno de Colombia ni de GOV.CO; actuamos como intermediarios para facilitar tu solicitud ante la autoridad competente.`;
}

export function ctlEmailHtml({ matricula = '', oficina = '', fecha = '', sitioUrl = 'https://certitradicion.com', logoUrl = '', previewCid = '', descargaUrl = '', conEstudio = false } = {}) {
  const brand = '#1B2A3A', brand600 = '#13202C', ink = '#0D1B2A', muted = '#5B6B7F', soft = '#8794a6', line = '#E7EDF5', green = '#0F7A52', bg = '#eef1f7';
  const font = "'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif";

  const estudioNote = conEstudio ? `
    <tr><td style="padding:8px 28px 4px;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" style="background:#eef3fb;border:1px solid #c9d8ef;border-radius:16px;padding:16px 24px;">
        <span style="color:${brand};font-size:16px;font-weight:800;font-family:${font};">&#128269;&nbsp; Incluye tu Estudio de Títulos</span>
        <span style="display:block;color:${muted};font-size:12px;margin-top:5px;font-family:${font};">Segundo PDF adjunto — propietarios, gravámenes y banderas de riesgo del inmueble</span>
      </td></tr></table>
    </td></tr>` : '';

  const header = `
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      ${logoUrl ? `<td valign="middle" style="padding-right:13px;"><img src="${logoUrl}" alt="" width="42" height="42" style="display:block;border:0;"></td>` : ''}
      <td valign="middle">
        <span style="color:#fff;font-size:21px;font-weight:800;letter-spacing:-.4px;font-family:${font};">Certitradición</span>
        <span style="color:#9DB0C4;font-size:10px;display:block;margin-top:3px;letter-spacing:.18em;font-family:${font};">CERTIFICADOS DE TRADICIÓN · COLOMBIA</span>
      </td>
    </tr></table>`;

  const preview = previewCid ? `
    <tr><td style="padding:8px 28px 0;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f1f4f9;border-radius:18px;"><tr><td style="padding:8px;">
        <img src="cid:${previewCid}" alt="Tu certificado (vista protegida)" width="520" style="width:100%;max-width:520px;height:auto;display:block;border-radius:12px;">
      </td></tr></table>
    </td></tr>` : '';

  // El certificado va ADJUNTO (PDF). Solo un aviso claro — sin botones ni links inútiles
  // (el cliente ya tiene su certificado en el adjunto).
  const button = `
    <tr><td style="padding:20px 28px 4px;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" style="background:#e6f4ee;border:1px solid #bfe3d2;border-radius:16px;padding:16px 24px;">
        <span style="color:${green};font-size:16px;font-weight:800;font-family:${font};">&#128206;&nbsp; Tu certificado va adjunto a este correo</span>
        <span style="display:block;color:${muted};font-size:12px;margin-top:5px;font-family:${font};">Archivo <strong>PDF oficial</strong> — descárgalo e imprímelo · validez 30 días</span>
      </td></tr></table>
    </td></tr>`;

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${bg};font-family:${font};-webkit-font-smoothing:antialiased;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">Tu Certificado de Tradición y Libertad está listo para descargar.</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:28px 12px;"><tr><td align="center">
  <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;margin:0 auto;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px -18px rgba(16,58,115,.30);">

    <tr><td style="background:${brand};background-image:linear-gradient(135deg,${brand},${brand600});padding:24px 32px;">${header}</td></tr>

    <tr><td style="padding:34px 32px 0;" align="center">
      <span style="display:inline-block;background:#e6f4ee;color:${green};font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:6px 14px;border-radius:999px;">&#10003;&nbsp; Certificado emitido</span>
      <h1 style="margin:16px 0 0;color:${ink};font-size:26px;font-weight:800;letter-spacing:-.5px;">Tu certificado está listo</h1>
      <p style="margin:10px auto 0;max-width:400px;color:${muted};font-size:15px;line-height:1.55;">Aquí tienes tu <strong style="color:${ink};">Certificado de Tradición y Libertad</strong>, oficial y vigente. Lo encuentras <strong style="color:${ink};">adjunto a este correo</strong>, listo para descargar e imprimir.</p>
    </td></tr>

    ${preview}
    ${button}
    ${estudioNote}

    <tr><td style="padding:22px 28px 6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;border:1px solid ${line};border-radius:16px;"><tr><td style="padding:6px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="color:${muted};font-size:13px;padding:12px 0;">Matrícula inmobiliaria</td><td align="right" style="color:${ink};font-size:14px;font-weight:700;font-family:'Courier New',monospace;">${matricula}</td></tr>
          <tr><td style="color:${muted};font-size:13px;padding:12px 0;border-top:1px solid ${line};">Oficina de Registro</td><td align="right" style="color:${ink};font-size:14px;font-weight:700;border-top:1px solid ${line};">${oficina}</td></tr>
          <tr><td style="color:${muted};font-size:13px;padding:12px 0;border-top:1px solid ${line};">Fecha de emisión</td><td align="right" style="color:${ink};font-size:14px;border-top:1px solid ${line};">${fecha}</td></tr>
        </table>
      </td></tr></table>
    </td></tr>

    <tr><td style="padding:24px 32px 32px;" align="center">
      <p style="margin:0;color:${muted};font-size:13px;">¿Dudas? Responde este correo o escríbenos a <a href="mailto:certificados@certitradicion.com" style="color:${brand};text-decoration:none;font-weight:700;">certificados@certitradicion.com</a></p>
      <div style="height:1px;background:${line};margin:18px 0;"></div>
      <p style="margin:0;color:${soft};font-size:11px;line-height:1.6;">Certitradición · Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR); facilitamos el trámite en tu nombre.<br><a href="${sitioUrl}" style="color:${brand};text-decoration:none;font-weight:600;">certitradicion.com</a></p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}
