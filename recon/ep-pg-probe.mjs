const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return (await r.json())?.json;
}
async function q(path, input = null) {
  const r = await fetch(`${BASE}/api/trpc/${path}?input=` + encodeURIComponent(JSON.stringify({ json: input })), { headers: { authorization: `Bearer ${TOKEN}` } });
  return (await r.json())?.json;
}
try { await login(); } catch (e) { console.log('TUNNEL_DOWN:', e.message); process.exit(2); }
if (!TOKEN) { console.log('LOGIN_FAIL'); process.exit(2); }
console.log('login ok');
const list = await q('projects.listProjectsAndServices');
console.log('SERVICES:', JSON.stringify((list?.services || []).map((s) => ({ p: s.projectName, n: s.name, type: s.type, image: s.image }))));
for (const p of ['services.postgres.createService', 'services.postgres.inspectService']) {
  console.log(`PROBE ${p}:`, JSON.stringify(await m(p, {})));
}
