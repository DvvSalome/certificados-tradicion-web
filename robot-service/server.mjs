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
      const d = await entregarCorreo({ pdf: r.pdf, matricula, oficina, email });
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

const server = http.createServer((req, res) => {
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
