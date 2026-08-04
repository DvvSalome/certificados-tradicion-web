// Sonda la API tRPC de EasyPanel (vía túnel localhost:3010) para descubrir
// namespaces + schemas de las mutaciones de proyecto/servicio.
const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
let TOKEN = '';

async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  const j = await r.json();
  TOKEN = j?.json?.token || j?.result?.data?.json?.token;
  console.log('login token:', (TOKEN || '').slice(0, 12) || JSON.stringify(j));
}
async function q(path, input = null) {
  const u = `${BASE}/api/trpc/${path}?input=` + encodeURIComponent(JSON.stringify({ json: input }));
  const r = await fetch(u, { headers: { authorization: `Bearer ${TOKEN}` } });
  return { status: r.status, body: await r.json() };
}
async function m(path, input = {}) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return { status: r.status, body: await r.json() };
}

await login();
console.log('\n--- projects.listProjectsAndServices ---');
console.log(JSON.stringify((await q('projects.listProjectsAndServices')).body).slice(0, 1000));

for (const p of ['projects.createProject', 'services.app.createService', 'services.app.updateSourceImage', 'services.app.updateEnv', 'services.app.deployService']) {
  const res = await m(p, {});
  console.log(`\n--- ${p} [${res.status}] ---`);
  console.log(JSON.stringify(res.body).slice(0, 600));
}
