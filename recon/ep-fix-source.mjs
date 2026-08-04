const BASE = 'http://localhost:3010';
const EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;
const P = 'certificados', S = 'web';
const REPO = `https://${process.env.GITHUB_TOKEN}@github.com/FOURGSOLUTIONS-FGS/certificados-tradicion-web.git`;
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
await login();
console.log('updateSourceGit:', JSON.stringify(await m('services.app.updateSourceGit', { projectName: P, serviceName: S, repo: REPO, ref: 'master', path: '/' })));
const list = await q('projects.listProjectsAndServices');
const svc = (list?.services || []).find((s) => s.projectName === 'certificados' && s.name === 'web');
const safeSource = svc?.source ? { ...svc.source, repo: svc.source.repo ? svc.source.repo.replace(/\/\/[^@]+@/, '//***@') : undefined } : null;
console.log('source now:', JSON.stringify(safeSource));
if (svc?.source?.type === 'git') {
  console.log('deploy:', JSON.stringify(await m('services.app.deployService', { projectName: P, serviceName: S })));
} else {
  console.log('SOURCE STILL NOT SET — revisar shape');
}
