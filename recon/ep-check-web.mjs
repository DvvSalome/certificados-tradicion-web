const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
}
async function q(path, input = null) {
  const r = await fetch(`${BASE}/api/trpc/${path}?input=` + encodeURIComponent(JSON.stringify({ json: input })), { headers: { authorization: `Bearer ${TOKEN}` } });
  return (await r.json())?.json;
}
await login();
const list = await q('projects.listProjectsAndServices');
const svc = (list?.services || []).find((s) => s.projectName === 'certificados' && s.name === 'web');
console.log(JSON.stringify(svc, null, 2));
