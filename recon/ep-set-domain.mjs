import crypto from 'crypto';
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
await login();
const input = {
  id: crypto.randomBytes(12).toString('hex'),
  destinationType: 'service',
  serviceDestination: { projectName: 'certificados', serviceName: 'web', port: 3000, protocol: 'http' },
  host: 'certificados.fourgsolutions.com',
  https: true,
  path: '/',
  wildcard: false,
  certificateResolver: 'letsencrypt',
  middlewares: [],
};
console.log('createDomain:', JSON.stringify(await m('domains.createDomain', input)));
