// Worker del robot SNR. Recibe el disparo del webhook de pago (POST /generar) y genera el CTL
// conectándose a Browserless por CDP (sin Chromium local). Procesa ASÍNCRONO (responde 202 al
// instante) y reporta el resultado al panel (/api/admin/generation) → OK marca DELIVERED;
// NO_DISPONIBLE dispara la devolución automática; otro error queda FAILED + alerta.
import http from 'http';
import { SnrRobot } from './snr-robot.mjs';
import { entregarCorreo } from './deliver.mjs';

const PORT = Number(process.env.PORT || 3000);
const SECRET = process.env.N8N_WEBHOOK_SECRET || '';
const PANEL = (process.env.PANEL_BASE_URL || '').replace(/\/$/, '');
const COST_CENTS = Number(process.env.SNR_COST_COP || 23000) * 100;
const BROWSERLESS_WS = process.env.BROWSERLESS_WS || '';

async function reportPanel(body) {
  if (!PANEL || !SECRET) { console.error('[robot] sin PANEL/SECRET, no reporto'); return; }
  await fetch(`${PANEL}/api/admin/generation`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET },
    body: JSON.stringify(body),
  }).then((r) => console.error('[robot] reporte panel', r.status)).catch((e) => console.error('[robot] reporte falló', e.message));
}

async function generar({ reference, oficina, matricula, email }) {
  const robot = new SnrRobot({
    user: process.env.SNR_USER, pass: process.env.SNR_PASS,
    browserlessWs: BROWSERLESS_WS || null, headless: true, stateFile: null,
    log: (m) => console.error(m),
  });
  try {
    await robot.start();
    const r = await robot.generar({ oficina, matricula });
    await reportPanel({ reference, matricula, oficina, status: 'OK', costCents: COST_CENTS });
    console.error(`[robot] ✅ ${matricula} generado (${r.pdf?.length || 0} bytes)`);
    // ENTREGA por correo (best-effort: el cert ya está generado+pagado; si el correo falla se loguea)
    try {
      const d = await entregarCorreo({ pdf: r.pdf, matricula, oficina, email, reference });
      console.error(`[robot] correo ${matricula}: ${d.sent ? 'ENVIADO a ' + email + (d.withPreview ? ' (con preview)' : '') : 'NO enviado (' + d.reason + ')'}`);
    } catch (de) {
      console.error(`[robot] ⚠ correo ${matricula} FALLÓ (cert OK, reenviar manual): ${de.message}`);
    }
  } catch (e) {
    const errorCode = e.code === 'NO_DISPONIBLE' ? 'NO_DISPONIBLE' : 'ERROR';
    await reportPanel({ reference, matricula, oficina, status: 'FAILED', errorCode, error: String(e.message || e).slice(0, 300) });
    console.error(`[robot] ✕ ${matricula} ${errorCode}: ${e.message}`);
  } finally {
    await robot.stop();
  }
}

// ── VERIFICAR (rápido): robot logueado PERSISTENTE reusado entre consultas (no re-loguea cada vez).
//    Serializado con un mutex (las verificaciones comparten una sola sesión/página).
let verifyRobot = null;
let chain = Promise.resolve();

async function ensureVerifyRobot() {
  if (verifyRobot) return verifyRobot;
  const r = new SnrRobot({
    user: process.env.SNR_USER, pass: process.env.SNR_PASS,
    browserlessWs: BROWSERLESS_WS || null, headless: true, stateFile: null, log: (m) => console.error(m),
  });
  await r.start();
  await r.login();
  verifyRobot = r;
  console.error('[verify] sesión SNR iniciada (se reutiliza)');
  return r;
}
async function resetVerifyRobot() {
  try { await verifyRobot?.stop(); } catch {}
  verifyRobot = null;
}

async function doVerify(oficina, matricula) {
  try {
    const r = await ensureVerifyRobot();
    return await r.consultar(oficina, matricula);
  } catch (e) {
    // sesión muerta/expirada → reiniciar y reintentar UNA vez
    console.error('[verify] reintento tras error: ' + e.message);
    await resetVerifyRobot();
    const r = await ensureVerifyRobot();
    return await r.consultar(oficina, matricula);
  }
}

// encola para serializar (una verificación a la vez sobre la sesión compartida)
function verificarSerial(oficina, matricula) {
  const run = chain.then(() => doVerify(oficina, matricula));
  chain = run.catch(() => {});
  return run;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/verificar') {
    if (!SECRET || req.headers['x-webhook-secret'] !== SECRET) { res.writeHead(401); return res.end('no autorizado'); }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', async () => {
      let p;
      try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('JSON inválido'); }
      const oficina = String(p.oficina || ''), matricula = String(p.matricula || '').toUpperCase();
      if (!oficina || !matricula) { res.writeHead(400); return res.end('faltan oficina/matricula'); }
      try {
        const info = await verificarSerial(oficina, matricula);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ oficina, matricula, disponible: !!info.disponible, estado: info.estado, direccion: info.direccion, circulo: info.circulo }));
      } catch (e) {
        console.error('[verify] error final: ' + e.message);
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'verify failed' }));
      }
    });
    return;
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, browserless: !!BROWSERLESS_WS }));
  }
  if (req.method === 'POST' && req.url === '/generar') {
    if (!SECRET || req.headers['x-webhook-secret'] !== SECRET) { res.writeHead(401); return res.end('no autorizado'); }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let p;
      try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('JSON inválido'); }
      if (!p.oficina || !p.matricula) { res.writeHead(400); return res.end('faltan oficina/matricula'); }
      // responder YA; generar en segundo plano
      res.writeHead(202, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, accepted: true, matricula: p.matricula }));
      generar(p).catch((e) => console.error('[robot] generar throw', e));
    });
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, () => console.error('[robot] worker escuchando en :' + PORT + ' (browserless=' + !!BROWSERLESS_WS + ')'));
