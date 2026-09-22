// Autoriza UNA VEZ el Drive de Certitradición y guarda el refresh token en ~/.certi-drive.json.
// Lo corre Adrián en su máquina; después el sitio sube solo los certificados y esto no se vuelve a tocar.
//
//   node scripts/drive-oauth.mjs
//
// Reusa el cliente OAuth de escritorio que ya existe en ~/.gads.json (proyecto fourg-ads-api), así que
// no hace falta crear credenciales nuevas. El permiso que pide es el MÍNIMO de Drive:
//   drive.file = "solo los archivos que esta app cree". No puede leer, mover ni borrar nada más de tu Drive.
//
// El token queda SOLO en tu disco (~/.certi-drive.json). De ahí se copia a Vercel una vez.
// Trampa heredada de gads_oauth.py: con un servidor de un solo hilo el keep-alive del navegador deja
// el proceso colgado y el código nunca se canjea. Por eso va ThreadingHTTP (Node ya lo es) y el canje
// ocurre DENTRO del handler.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const PUERTO = 53682;
const REDIRECT = `http://localhost:${PUERTO}`;
const SALIDA = join(homedir(), '.certi-drive.json');

const gads = JSON.parse(readFileSync(join(homedir(), '.gads.json'), 'utf8'));
const CLIENT_ID = gads.client_id, CLIENT_SECRET = gads.client_secret;
if (!CLIENT_ID || !CLIENT_SECRET) { console.error('No encontré el cliente OAuth en ~/.gads.json'); process.exit(1); }

const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: CLIENT_ID, redirect_uri: REDIRECT, response_type: 'code', scope: SCOPE,
  access_type: 'offline', prompt: 'consent',
}).toString();

console.log('\n1) Se va a abrir el navegador. Entra con four4gsolutions@gmail.com y dale Permitir.');
console.log('2) Si no se abre solo, copia y pega esta dirección:\n');
console.log(url + '\n');

const server = createServer(async (req, res) => {
  const q = new URL(req.url, REDIRECT).searchParams;
  const code = q.get('code'), err = q.get('error');
  const responder = (txt) => { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(`<html><body style="font-family:system-ui;padding:40px"><h2>${txt}</h2><p>Ya puedes cerrar esta pestaña.</p></body></html>`); };
  if (err) { responder('Cancelaste el permiso: ' + err); console.error('\n✗ cancelado:', err); server.close(); process.exit(1); }
  if (!code) { res.writeHead(404); return res.end('sin code'); }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT, grant_type: 'authorization_code' }),
    });
    const j = await r.json();
    if (!j.refresh_token) throw new Error('Google no devolvió refresh_token: ' + JSON.stringify(j).slice(0, 200));
    writeFileSync(SALIDA, JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: j.refresh_token, scope: SCOPE, creado: new Date().toISOString() }, null, 2));
    responder('Listo, Drive conectado ✅');
    console.log('\n✓ Drive conectado. Token guardado en', SALIDA);
    console.log('  (no lo compartas: da acceso de escritura a los archivos que cree la app)');
  } catch (e) {
    responder('Algo falló: ' + e.message);
    console.error('\n✗', e.message);
  } finally {
    server.close();
    setTimeout(() => process.exit(0), 300);
  }
});

server.listen(PUERTO, () => {
  const abrir = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(abrir[0], abrir[1], { detached: true, stdio: 'ignore' }).unref(); } catch { /* que lo pegue a mano */ }
});
