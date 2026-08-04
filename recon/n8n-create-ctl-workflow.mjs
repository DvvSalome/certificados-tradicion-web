// Crea el workflow "CTL · Generar y Entregar" en n8n.fourgsolutions.com vía Public API.
import crypto from 'crypto';

const N8N = 'https://n8n.fourgsolutions.com';
const KEY = '***REDACTED***';

const id = () => crypto.randomUUID();

// Función Browserless (puppeteer) — login SNR + (draft) flujo. Se finaliza con la prueba real.
const BL_FUNCTION = `export default async function ({ page, context }) {
  const { user, pass, matricula, oficina } = context;
  const BASE = 'https://certificados.supernotariado.gov.co';
  await page.goto(BASE + '/certificado', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => { document.querySelectorAll('.ui-widget-overlay').forEach(o => o.remove()); const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display='none'; try { PF('dialogLogin').show(); } catch(e){} });
  await page.waitForSelector('[id="formLogin:inpUserLogin"]', { visible: true, timeout: 15000 });
  await page.type('[id="formLogin:inpUserLogin"]', user);
  await page.type('[id="formLogin:inpPassLogin"]', pass);
  await page.click('[id="formLogin:btnIngresarLogin"]');
  await new Promise(r => setTimeout(r, 3000));
  // TODO (prueba real): generate.snr -> oficina+matricula -> Buscar -> Agregar al Carrito -> Pagar -> descargar PDF.
  // Mecanismo de descarga ya probado (historial). Por ahora confirma sesion + lista historial.
  await page.goto(BASE + '/certificado/portal/business/history.snr', { waitUntil: 'networkidle2', timeout: 30000 });
  const filas = await page.evaluate(() => [...document.querySelectorAll('.ui-datatable tbody tr')].slice(0,5).map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()).filter(Boolean)).filter(r => r.length));
  return { data: { ok: true, loggedIn: true, matricula, oficina, ultimosCertificados: filas }, type: 'application/json' };
}`;

const blBody = JSON.stringify({
  code: BL_FUNCTION,
  context: { user: '<SNR_USER>', pass: '<SNR_PASS>', matricula: 'MATRICULA', oficina: 'OFICINA' },
}, null, 0);

const nodes = [
  {
    id: id(), name: 'Webhook · Pedido pagado', type: 'n8n-nodes-base.webhook', typeVersion: 2, position: [240, 300],
    parameters: { httpMethod: 'POST', path: 'generar-ctl', responseMode: 'responseNode', options: {} },
  },
  {
    id: id(), name: 'Validar + Preparar', type: 'n8n-nodes-base.code', typeVersion: 2, position: [460, 300],
    parameters: { jsCode: "const b = $input.first().json.body || $input.first().json;\nfor (const f of ['matricula','oficina']) if(!b[f]) throw new Error('falta '+f);\nif(!b.email && !b.phone) throw new Error('falta email o phone');\nreturn [{ json: { matricula:String(b.matricula), oficina:String(b.oficina).toUpperCase(), email:b.email||null, phone:b.phone||null, orderId:b.orderId||null } }];" },
  },
  {
    id: id(), name: 'Browserless · Generar CTL', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [680, 300],
    parameters: {
      method: 'POST',
      url: `http://browserless_browserless:3000/function?token=${process.env.BROWSERLESS_TOKEN}`,
      sendBody: true, specifyBody: 'json', jsonBody: blBody,
      options: { timeout: 120000 },
    },
  },
  {
    id: id(), name: 'Preparar entrega', type: 'n8n-nodes-base.code', typeVersion: 2, position: [900, 300],
    parameters: { jsCode: "// El nodo Browserless devuelve { data: { ... , pdfBase64 } } cuando esté la generación real.\n// Aquí se convertiría pdfBase64 a binario para adjuntar. Draft:\nconst src = $input.first().json;\nreturn [{ json: { ...src, mensaje: 'Tu Certificado de Tradición y Libertad está listo.' } }];" },
  },
  {
    id: id(), name: 'Email (Gmail) · enviar CTL', type: 'n8n-nodes-base.gmail', typeVersion: 2.1, position: [1120, 200],
    parameters: { resource: 'message', operation: 'send', sendTo: '={{ $json.email }}', subject: 'Tu Certificado de Tradición y Libertad', message: '={{ $json.mensaje }}', options: {} },
  },
  {
    id: id(), name: 'WhatsApp (Evolution) · enviar CTL', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [1120, 400],
    parameters: {
      method: 'POST',
      url: 'https://EVOLUTION_HOST/message/sendMedia/INSTANCIA',
      sendHeaders: true, headerParameters: { parameters: [{ name: 'apikey', value: 'EVOLUTION_API_KEY' }] },
      sendBody: true, specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ number: $json.phone, mediatype: "document", fileName: "CTL.pdf", caption: $json.mensaje }) }}',
      options: {},
    },
  },
  {
    id: id(), name: 'Responder', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.4, position: [1340, 300],
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify({ ok: true, orderId: $json.orderId }) }}', options: {} },
  },
];

const n = (name) => name;
const connections = {
  [n('Webhook · Pedido pagado')]: { main: [[{ node: 'Validar + Preparar', type: 'main', index: 0 }]] },
  [n('Validar + Preparar')]: { main: [[{ node: 'Browserless · Generar CTL', type: 'main', index: 0 }]] },
  [n('Browserless · Generar CTL')]: { main: [[{ node: 'Preparar entrega', type: 'main', index: 0 }]] },
  [n('Preparar entrega')]: { main: [[{ node: 'Email (Gmail) · enviar CTL', type: 'main', index: 0 }, { node: 'WhatsApp (Evolution) · enviar CTL', type: 'main', index: 0 }]] },
  [n('Email (Gmail) · enviar CTL')]: { main: [[{ node: 'Responder', type: 'main', index: 0 }]] },
};

const workflow = { name: 'CTL · Generar y Entregar', nodes, connections, settings: { executionOrder: 'v1' } };

const r = await fetch(`${N8N}/api/v1/workflows`, { method: 'POST', headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json' }, body: JSON.stringify(workflow) });
const body = await r.json();
console.log('status', r.status);
console.log(JSON.stringify(body).slice(0, 400));
if (body.id) console.log('\n✓ Workflow creado: ' + N8N + '/workflow/' + body.id);
