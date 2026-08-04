// Crea + despliega un Postgres gestionado en EasyPanel (proyecto "certificados", servicio "db").
const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const PROJECT = 'certificados', SERVICE = 'db';
let TOKEN = '';

async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
  if (!TOKEN) throw new Error('login fail');
  console.log('✓ login');
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return (await r.json())?.json;
}
async function q(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}?input=` + encodeURIComponent(JSON.stringify({ json: input })), { headers: { authorization: `Bearer ${TOKEN}` } });
  return (await r.json())?.json;
}
function check(res, label) {
  if (res && res.defined === false) {
    if (/exist|already|duplicate/i.test(res.message || '')) { console.log(`• ${label}: ya existía`); return; }
    throw new Error(`${label} FALLÓ: ${JSON.stringify(res)}`);
  }
  console.log(`✓ ${label}`);
}

await login();
check(await m('projects.createProject', { name: PROJECT }), 'createProject certificados');
check(await m('services.postgres.createService', { projectName: PROJECT, serviceName: SERVICE }), 'createService postgres');
check(await m('services.postgres.deployService', { projectName: PROJECT, serviceName: SERVICE }), 'deployService postgres');

const insp = await q('services.postgres.inspectService', { projectName: PROJECT, serviceName: SERVICE });
console.log('\n=== INSPECT postgres ===');
console.log(JSON.stringify(insp, null, 2).slice(0, 1200));
