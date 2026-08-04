// Crea + activa el workflow "Verificar Matrícula" en n8n: webhook → Browserless (consultar) → responde.
import crypto from 'crypto';

const N8N = 'https://n8n.fourgsolutions.com';
const KEY = '***REDACTED***';
const BROWSERLESS = `http://browserless_browserless:3000/function?token=${process.env.BROWSERLESS_TOKEN}`;
const id = () => crypto.randomUUID();
const api = async (path, body, method = 'POST') => {
  const r = await fetch(`${N8N}/api/v1/${path}`, { method, headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, j: await r.json().catch(() => ({})) };
};

// Función puppeteer: login SNR + consultar (oficina por click en el selectOneMenu + buscar + leer modal). NO cobra.
const FN = `export default async function ({ page, context }) {
  const { user, pass, oficina, matricula } = context;
  const BASE = 'https://certificados.supernotariado.gov.co';
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  await page.goto(BASE + '/certificado', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => { document.querySelectorAll('.ui-widget-overlay').forEach(o => o.remove()); const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display = 'none'; try { PF('dialogLogin').show(); } catch (e) {} });
  await page.waitForSelector('[id="formLogin:inpUserLogin"]', { visible: true, timeout: 15000 });
  await page.type('[id="formLogin:inpUserLogin"]', user);
  await page.type('[id="formLogin:inpPassLogin"]', pass);
  await page.click('[id="formLogin:btnIngresarLogin"]');
  await sleep(3500);
  await page.goto(BASE + '/certificado/portal/business/generate.snr', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1500);
  // seleccionar oficina: abrir el selectOneMenu y clickear el item (mimic usuario)
  await page.click('[id="formGeneracionCertificados:listaOficinas"]').catch(() => {});
  await sleep(700);
  const items = await page.$$('[id="formGeneracionCertificados:listaOficinas_panel"] li');
  let picked = false;
  for (const it of items) {
    const txt = await page.evaluate((e) => (e.textContent || '').trim().toUpperCase(), it);
    if (txt === oficina.toUpperCase()) { await it.click(); picked = true; break; }
  }
  await sleep(1800);
  await page.type('[id="formGeneracionCertificados:inpMatricula"]', String(matricula));
  await page.click('[id="formGeneracionCertificados:btnBuscarMatricula"]');
  await sleep(3000);
  const info = await page.evaluate(() => {
    const m = document.querySelector('[id="formModalMatriculaCarrito"]');
    const t = (m && m.innerText) || document.body.innerText || '';
    const grab = (label) => { const r = t.match(new RegExp(label + '\\\\s*\\\\n?\\\\s*([^\\\\n]+)', 'i')); return r ? r[1].trim() : null; };
    return { direccion: grab('Direccion'), circulo: grab('Circulo'), estado: grab('Estado'), raw: t.replace(/\\\\s+/g, ' ').slice(0, 300) };
  });
  const disponible = /disponible/i.test(info.estado || info.raw || '');
  return { data: { oficina, matricula, picked, disponible, estado: info.estado, direccion: info.direccion, circulo: info.circulo }, type: 'application/json' };
}`;

const blBody = JSON.stringify({ code: FN, context: { user: 'CC22521092', pass: 'Alex17', oficina: '={{ $json.oficina }}', matricula: '={{ $json.matricula }}' } });
// El context con expresiones n8n debe ir como jsonBody con expresiones; lo armamos en un Code node.

const nodes = [
  { id: id(), name: 'Webhook · verificar', type: 'n8n-nodes-base.webhook', typeVersion: 2, position: [240, 300],
    parameters: { httpMethod: 'POST', path: 'verificar-matricula', responseMode: 'responseNode', options: {} } },
  { id: id(), name: 'Validar', type: 'n8n-nodes-base.code', typeVersion: 2, position: [460, 300],
    parameters: { jsCode: "const b = $input.first().json.body || $input.first().json;\nif(!b.oficina || !b.matricula) throw new Error('faltan oficina/matricula');\nreturn [{ json: { oficina: String(b.oficina), matricula: String(b.matricula).toUpperCase() } }];" } },
  { id: id(), name: 'Browserless · consultar', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [680, 300],
    parameters: {
      method: 'POST', url: BROWSERLESS, sendBody: true, specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ code: ' + JSON.stringify(FN) + ', context: { user: "CC22521092", pass: "Alex17", oficina: $json.oficina, matricula: $json.matricula } }) }}',
      options: { timeout: 60000 },
    } },
  { id: id(), name: 'Responder', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.4, position: [900, 300],
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json.data || $json) }}', options: {} } },
];
const connections = {
  'Webhook · verificar': { main: [[{ node: 'Validar', type: 'main', index: 0 }]] },
  'Validar': { main: [[{ node: 'Browserless · consultar', type: 'main', index: 0 }]] },
  'Browserless · consultar': { main: [[{ node: 'Responder', type: 'main', index: 0 }]] },
};
const wf = { name: 'Verificar Matrícula', nodes, connections, settings: { executionOrder: 'v1' } };

const { status, j } = await api('workflows', wf);
if (!j.id) { console.log('⚠ no creado (' + status + '):', JSON.stringify(j).slice(0, 300)); process.exit(1); }
console.log('✓ workflow creado:', N8N + '/workflow/' + j.id);
const act = await api(`workflows/${j.id}/activate`);
console.log('activar:', act.status, act.j.active === true ? 'ACTIVO' : JSON.stringify(act.j).slice(0, 150));
console.log('Webhook: ' + N8N + '/webhook/verificar-matricula');
