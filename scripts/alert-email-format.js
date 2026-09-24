// Pegar completo en el nodo Code «Formatear alerta» de n8n (Run Once for All Items).
const p = $input.first().json.body || $input.first().json;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const labels = { referencia: 'Referencia', matricula: 'Matrícula', oficina: 'Oficina', monto: 'Monto', transaccion: 'Transacción', email: 'Correo', phone: 'Teléfono', saldo: 'Saldo', error: 'Error' };
const title = String(p.title || 'Alerta');
const message = String(p.message || '');
const rows = Object.entries(p.data || {}).filter(([, value]) => value != null && value !== '').map(([key, value]) => {
  // Solo la venta antigua enviaba monto en centavos; otras alertas conservan su unidad.
  if (p.kind === 'venta_confirmada' && key === 'monto' && typeof value === 'number' && Number.isFinite(value)) {
    value = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value / 100);
  }
  return [Object.hasOwn(labels, key) ? labels[key] : key.replace(/_/g, ' '), String(value)];
});
const date = p.at ? new Date(p.at) : null;
const at = date && Number.isFinite(date.getTime())
  ? new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' }).format(date) + ' · hora de Colombia'
  : 'Fecha no disponible';
const text = [title, message, ...rows.map(([label, value]) => `${label}: ${value}`), `Certitradición · ${at}`].filter(Boolean).join('\n');
const details = rows.length ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f6fa;border:1px solid #dbe3ec;margin:24px 0 0">${rows.map(([label, value]) => `<tr><th scope="row" align="left" valign="top" style="width:30%;padding:12px 14px;border-bottom:1px solid #dbe3ec;font-size:13px;font-weight:600;color:#526174;word-break:break-word">${escapeHtml(label)}</th><td valign="top" style="padding:12px 14px;border-bottom:1px solid #dbe3ec;font-size:14px;font-weight:600;color:#132d4b;word-break:break-word;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join('')}</table>` : '';
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f3f6fa;color:#132d4b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse;background:#ffffff"><tr><td style="padding:24px;background:#103A73;color:#ffffff"><p style="margin:0;font-size:22px;font-weight:700">Certitradición</p><p style="margin:6px 0 0;font-size:12px;letter-spacing:1px">ALERTA AUTOMÁTICA</p></td></tr><tr><td style="padding:28px 24px"><h1 style="margin:0 0 18px;font-size:23px;line-height:1.3;color:#103A73;word-break:break-word">${escapeHtml(title)}</h1><p style="margin:0;font-size:15px;line-height:1.65;color:#334155;word-break:break-word;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>${details}</td></tr><tr><td style="padding:18px 24px;border-top:1px solid #dbe3ec;font-size:12px;line-height:1.6;color:#526174">${escapeHtml(at)}<br>Certitradición · Notificación automática</td></tr></table></td></tr></table></body></html>`;
return [{ json: { to: 'four4gsolutions@gmail.com', subject: '[CTL] ' + title, html, text, phone: p.phone || '' } }];
