// Crea en n8n: (1) workflow "Alertas · WhatsApp+Email" (webhook 'alert' que golpea la app),
// (2) workflow "Errores · Notificar fallos" (Error Trigger global → reusa la alerta).
// La app dispara la alerta vía N8N_ALERT_URL = https://n8n.fourgsolutions.com/webhook/alert
import crypto from 'crypto';

const N8N = 'https://n8n.fourgsolutions.com';
const KEY = '***REDACTED***';
const id = () => crypto.randomUUID();
const api = async (path, body, method = 'POST') => {
  const r = await fetch(`${N8N}/api/v1/${path}`, { method, headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
};

// Destinatarios (ajustar al correo real de Alexis cuando lo tengamos)
const ALERT_EMAILS = 'four4gsolutions@gmail.com';

// ── 1. Credencial SMTP (Hostinger) ──
let smtpCredId = null;
{
  const cred = {
    name: 'Hostinger SMTP · certitradicion',
    type: 'smtp',
    data: { user: process.env.SMTP_USER, password: process.env.SMTP_PASS, host: 'smtp.hostinger.com', port: 465, secure: true },
  };
  const { status, j } = await api('credentials', cred);
  if (j.id) { smtpCredId = j.id; console.log('✓ credencial SMTP creada:', j.id); }
  else console.log('⚠ no se creó credencial SMTP (status ' + status + '):', JSON.stringify(j).slice(0, 200), '\n  → bíndala a mano en el nodo Email.');
}

const formatCode = `const p = $input.first().json.body || $input.first().json;
const lines = [p.message || ''];
if (p.data) for (const [k, v] of Object.entries(p.data)) if (v != null && v !== '') lines.push(k + ': ' + v);
const text = lines.filter(Boolean).join('\\n');
const html = '<div style="font-family:Arial,sans-serif"><h2 style="color:#103A73;margin:0 0 8px">' + (p.title || 'Alerta') + '</h2><p style="font-size:15px;color:#0d1b2a">' + (p.message || '') + '</p><pre style="background:#f6f8fb;padding:12px;border-radius:8px;font-size:13px">' + lines.slice(1).join('\\n') + '</pre><p style="color:#8593a3;font-size:12px">Certitradición · alerta automática · ' + (p.at || '') + '</p></div>';
return [{ json: { to: '${ALERT_EMAILS}', subject: '[CTL] ' + (p.title || 'Alerta'), html, text, phone: p.phone || '' } }];`;

// ── 2. Workflow "Alertas" ──
const alertNodes = [
  { id: id(), name: 'Webhook · alert', type: 'n8n-nodes-base.webhook', typeVersion: 2, position: [240, 300],
    parameters: { httpMethod: 'POST', path: 'alert', responseMode: 'onReceived', options: {} } },
  { id: id(), name: 'Formatear', type: 'n8n-nodes-base.code', typeVersion: 2, position: [460, 300],
    parameters: { jsCode: formatCode } },
  { id: id(), name: 'Email · alerta', type: 'n8n-nodes-base.emailSend', typeVersion: 2.1, position: [700, 200],
    parameters: { fromEmail: 'certificados@certitradicion.com', toEmail: '={{ $json.to }}', subject: '={{ $json.subject }}', emailFormat: 'html', html: '={{ $json.html }}', options: {} },
    ...(smtpCredId ? { credentials: { smtp: { id: smtpCredId, name: 'Hostinger SMTP · certitradicion' } } } : {}) },
  // WhatsApp deshabilitado hasta configurar Evolution/API no oficial (host+apikey+instancia)
  { id: id(), name: 'WhatsApp · alerta (configurar)', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [700, 400], disabled: true,
    parameters: { method: 'POST', url: 'https://EVOLUTION_HOST/message/sendText/INSTANCIA',
      sendHeaders: true, headerParameters: { parameters: [{ name: 'apikey', value: 'EVOLUTION_API_KEY' }] },
      sendBody: true, specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ number: "57XXXXXXXXXX", text: $json.subject + "\\n" + $json.text }) }}', options: {} } },
];
const alertWf = {
  name: 'Alertas · WhatsApp+Email',
  nodes: alertNodes,
  connections: {
    'Webhook · alert': { main: [[{ node: 'Formatear', type: 'main', index: 0 }]] },
    'Formatear': { main: [[{ node: 'Email · alerta', type: 'main', index: 0 }, { node: 'WhatsApp · alerta (configurar)', type: 'main', index: 0 }]] },
  },
  settings: { executionOrder: 'v1' },
};
{
  const { status, j } = await api('workflows', alertWf);
  if (j.id) console.log('✓ Workflow Alertas:', N8N + '/workflow/' + j.id, '\n  Webhook (al activar): ' + N8N + '/webhook/alert  → setéalo en N8N_ALERT_URL');
  else console.log('⚠ Alertas no creado (status ' + status + '):', JSON.stringify(j).slice(0, 300));
}

// ── 3. Workflow "Errores" (Error Trigger global) ──
const errCode = `const e = $input.first().json;
const wf = e.workflow?.name || '(desconocido)';
const node = e.execution?.lastNodeExecuted || '?';
const msg = e.execution?.error?.message || e.trigger?.error?.message || 'Error sin mensaje';
return [{ json: { title: '🔴 Falló un workflow en n8n', message: 'Workflow "' + wf + '" falló en el nodo "' + node + '": ' + msg, kind: 'workflow_error', data: { workflow: wf, nodo: node }, at: new Date().toISOString() } }];`;
const errNodes = [
  { id: id(), name: 'Error Trigger', type: 'n8n-nodes-base.errorTrigger', typeVersion: 1, position: [240, 300], parameters: {} },
  { id: id(), name: 'Armar alerta', type: 'n8n-nodes-base.code', typeVersion: 2, position: [460, 300], parameters: { jsCode: errCode } },
  { id: id(), name: 'Enviar a Alertas', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [700, 300],
    parameters: { method: 'POST', url: N8N + '/webhook/alert', sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json) }}', options: {} } },
];
const errWf = {
  name: 'Errores · Notificar fallos',
  nodes: errNodes,
  connections: {
    'Error Trigger': { main: [[{ node: 'Armar alerta', type: 'main', index: 0 }]] },
    'Armar alerta': { main: [[{ node: 'Enviar a Alertas', type: 'main', index: 0 }]] },
  },
  settings: { executionOrder: 'v1' },
};
{
  const { status, j } = await api('workflows', errWf);
  if (j.id) console.log('✓ Workflow Errores:', N8N + '/workflow/' + j.id);
  else console.log('⚠ Errores no creado (status ' + status + '):', JSON.stringify(j).slice(0, 300));
}

console.log('\nSIGUIENTE: en n8n activa ambos workflows (toggle Active). En los demás workflows (CTL/Batch),');
console.log('Settings → "Error Workflow" = "Errores · Notificar fallos" para que capturen fallos.');
