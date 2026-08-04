// Despliega Browserless en EasyPanel vía su API tRPC (por el túnel localhost:3010).
// Crea proyecto + servicio app + imagen + env + deploy. Aparece gestionado en la UI.
import crypto from 'crypto';

const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const PROJECT = 'browserless', SERVICE = 'browserless';
const IMAGE = 'ghcr.io/browserless/chromium:latest';
const BL_TOKEN = crypto.randomBytes(20).toString('hex');
let TOKEN = '';

async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
  if (!TOKEN) throw new Error('login falló');
  console.log('✓ login');
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return (await r.json())?.json;
}
function check(res, label, okIfExists = false) {
  if (res && res.defined === false) {
    if (okIfExists && /exist|already|duplicate/i.test(res.message || '')) { console.log(`• ${label}: ya existía (ok)`); return; }
    throw new Error(`${label} FALLÓ: ${JSON.stringify(res)}`);
  }
  console.log(`✓ ${label}`);
}

await login();
check(await m('projects.createProject', { name: PROJECT }), 'createProject', true);
check(await m('services.app.createService', { projectName: PROJECT, serviceName: SERVICE }), 'createService', true);
check(await m('services.app.updateSourceImage', { projectName: PROJECT, serviceName: SERVICE, image: IMAGE }), 'updateSourceImage');
check(await m('services.app.updateEnv', { projectName: PROJECT, serviceName: SERVICE, env: `TOKEN=${BL_TOKEN}\nCONCURRENT=5\nTIMEOUT=120000` }), 'updateEnv');
check(await m('services.app.deployService', { projectName: PROJECT, serviceName: SERVICE }), 'deployService');

// inspeccionar para confirmar
const insp = await fetch(`${BASE}/api/trpc/services.app.inspectService?input=` + encodeURIComponent(JSON.stringify({ json: { projectName: PROJECT, serviceName: SERVICE } })), { headers: { authorization: `Bearer ${TOKEN}` } }).then((r) => r.json()).catch(() => null);
console.log('\n=== inspect ===');
console.log(JSON.stringify(insp?.json?.source || insp?.json || insp).slice(0, 400));

console.log('\n========================================');
console.log('BROWSERLESS desplegado.');
console.log('BL_TOKEN =', BL_TOKEN);
console.log('Conexión interna n8n: ws://' + PROJECT + '_' + SERVICE + ':3000?token=' + BL_TOKEN);
console.log('========================================');
