// Crea + configura + despliega el servicio worker 'robot' en EasyPanel (subpath /robot-service).
const BASE = 'http://localhost:3010', EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const P = 'certificados', S = 'robot';
const REPO = `https://${process.env.GITHUB_TOKEN}@github.com/FOURGSOLUTIONS-FGS/certificados-tradicion-web.git`;
const ENV = [
  `SNR_USER=${process.env.SNR_USER}`,
  `SNR_PASS=${process.env.SNR_PASS}`,
  `BROWSERLESS_WS=${process.env.BROWSERLESS_WS}`,
  'PANEL_BASE_URL=http://certificados_web:3000',
  `N8N_WEBHOOK_SECRET=${process.env.N8N_WEBHOOK_SECRET}`,
  `DATABASE_URL=${process.env.DATABASE_URL}`,
  'SNR_COST_COP=23000',
  'PORT=3000',
  'NIXPACKS_NODE_VERSION=22',
  'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1',
].join('\n');

let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token; if (!TOKEN) throw new Error('login fail');
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  const j = await r.json();
  return { status: r.status, json: j?.json, error: j?.error };
}

await login();
console.log('login ok');
const create = await m('services.app.createService', { projectName: P, serviceName: S });
console.log('createService:', create.error ? JSON.stringify(create.error).slice(0, 120) : 'OK');
console.log('updateSourceGit:', JSON.stringify((await m('services.app.updateSourceGit', { projectName: P, serviceName: S, repo: REPO, ref: 'master', path: '/robot-service' })).error || 'OK').slice(0, 120));
console.log('updateEnv:', JSON.stringify((await m('services.app.updateEnv', { projectName: P, serviceName: S, env: ENV })).error || 'OK').slice(0, 120));
console.log('deploy:', JSON.stringify((await m('services.app.deployService', { projectName: P, serviceName: S })).error || 'OK').slice(0, 120));
console.log('\n✓ servicio robot desplegándose (Nixpacks + Playwright). Interno: http://certificados_robot:3000');
