const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const P = 'certificados', S = 'web';
const ENV = [
  `DATABASE_URL=${process.env.DATABASE_URL}`,
  `WOMPI_PUBLIC_KEY=${process.env.WOMPI_PUBLIC_KEY}`,
  `WOMPI_PRIVATE_KEY=${process.env.WOMPI_PRIVATE_KEY}`,
  `WOMPI_EVENTS_SECRET=${process.env.WOMPI_EVENTS_SECRET}`,
  `WOMPI_INTEGRITY_SECRET=${process.env.WOMPI_INTEGRITY_SECRET}`,
  'WOMPI_CHECKOUT_URL=https://checkout.wompi.co/p/',
  'WOMPI_API_BASE=https://sandbox.wompi.co/v1',
  'PRICE_COP=39900',
  'N8N_GENERAR_CTL_URL=',
  `N8N_WEBHOOK_SECRET=${process.env.N8N_WEBHOOK_SECRET}`,
  'PORT=3000',
  'APP_BASE_URL=https://certitradicion.com',
  'NIXPACKS_NODE_VERSION=22',
].join('\n');
let TOKEN = '';
async function login() {
  const r = await fetch(`${BASE}/api/trpc/auth.login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ json: { email: EMAIL, password: PASS } }) });
  TOKEN = (await r.json())?.json?.token;
}
async function m(path, input) {
  const r = await fetch(`${BASE}/api/trpc/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ json: input }) });
  return (await r.json())?.json;
}
await login();
console.log('updateEnv:', JSON.stringify(await m('services.app.updateEnv', { projectName: P, serviceName: S, env: ENV })));
console.log('deploy:', JSON.stringify(await m('services.app.deployService', { projectName: P, serviceName: S })));
console.log('disparado. Monitorear build.');
