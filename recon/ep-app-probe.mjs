const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const P = 'certificados', S = 'web';
let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
  if (!TOKEN) throw new Error('login fail');
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return (await r.json())?.json;
}
try { await login(); } catch (e) { console.log('TUNNEL_DOWN:', e.message); process.exit(2); }
console.log('login ok');
console.log('createService web:', JSON.stringify(await m('services.app.createService', { projectName: P, serviceName: S })));
const probe = (p) => m(p, { projectName: P, serviceName: S }).then((r) => console.log(`PROBE ${p}:`, JSON.stringify(r)));
await probe('services.app.updateSource');
await probe('services.app.updateBuild');
await probe('services.app.createDomain');
await probe('services.app.updateDomains');
await probe('services.app.updateResources');
