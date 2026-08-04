// Deploy del panel: agrega las env vars nuevas (sin pisar las existentes) + redespliega el servicio web.
const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const P = 'certificados', S = 'web';

const NEW_ENV = {
  ADMIN_SESSION_SECRET: '***REDACTED***',
  ADMIN_PASS_CLIENTE: 'alexis2026',
  ADMIN_PASS_SUPERADMIN: 'fourg2026',
  N8N_ALERT_URL: 'https://n8n.fourgsolutions.com/webhook/alert',
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
  SNR_COST_COP: '23000',
  SALDO_ALERT_THRESHOLD_COP: '100000',
};

let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
  if (!TOKEN) throw new Error('login fail');
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  const j = await r.json();
  if (j?.error) throw new Error(path + ': ' + JSON.stringify(j.error).slice(0, 300));
  return j?.json;
}

await login();
console.log('login ok');

const insp = await m('services.app.inspectService', { projectName: P, serviceName: S });
const currentEnv = insp?.env || '';
console.log('env actual (claves):', currentEnv.split('\n').filter(Boolean).map((l) => l.split('=')[0]).join(', '));

// merge: parsea actual a mapa, agrega/override las nuevas, preservando orden + comentarios
const map = new Map();
for (const line of currentEnv.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) map.set(t.slice(0, i), t.slice(i + 1));
}
let added = [];
for (const [k, v] of Object.entries(NEW_ENV)) { if (!map.has(k)) added.push(k); map.set(k, v); }
const merged = [...map.entries()].map(([k, v]) => `${k}=${v}`).join('\n');

console.log('agregadas/actualizadas:', Object.keys(NEW_ENV).join(', '));
console.log('updateEnv:', JSON.stringify(await m('services.app.updateEnv', { projectName: P, serviceName: S, env: merged }))?.slice?.(0, 80) ?? 'ok');
console.log('deploy:', JSON.stringify(await m('services.app.deployService', { projectName: P, serviceName: S }))?.slice?.(0, 120) ?? 'ok');
console.log('\n✓ env actualizado + deploy disparado. Espera ~1-2 min al rebuild Nixpacks.');
