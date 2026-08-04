// Worker de generación en LOTE. Lo dispara n8n (webhook) o un cron en el VPS.
// Jala 1 ítem a la vez del panel, lo genera, reporta el resultado y ESPERA antes del siguiente
// (loop secuencial con pausa → no todas a la vez → evita bloqueo del SNR). Reutiliza la sesión.
//
//   node --env-file=web/.env.local robot/batch-worker.mjs
//
// Requiere: PANEL_BASE_URL, N8N_WEBHOOK_SECRET, SNR_USER, SNR_PASS.
// Opcionales: BATCH_DELAY_MS (def 25000), SNR_COST_COP (def 23000), BROWSERLESS_WS.
import { SnrRobot } from '../robot-service/snr-robot.mjs';

const PANEL = (process.env.PANEL_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const SECRET = process.env.N8N_WEBHOOK_SECRET || '';
const DELAY = Number(process.env.BATCH_DELAY_MS || 25000);
const COST_CENTS = Number(process.env.SNR_COST_COP || 23000) * 100;
const log = (m) => console.error('· ' + m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms) => ms + Math.floor(ms * 0.4 * Math.random()); // pausa irregular (más humano)

async function panel(path, body) {
  const r = await fetch(`${PANEL}${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw new Error(`panel ${path} → ${r.status}`);
  return r.json();
}

const robot = new SnrRobot({
  user: process.env.SNR_USER, pass: process.env.SNR_PASS,
  browserlessWs: process.env.BROWSERLESS_WS || null, headless: true,
  stateFile: process.env.SNR_STATE_FILE || 'recon/artifacts/snr-state.json',
  log,
});

await robot.start();
let done = 0, ok = 0, fail = 0;
try {
  await robot.ensureLoggedIn();
  while (true) {
    const next = await panel('/api/admin/batch/next');
    if (next.empty) { log('no quedan ítems pendientes → fin'); break; }
    const { itemId, matricula, oficina } = next.item;
    log(`[${++done}] generando ${matricula} (${oficina})…`);
    try {
      await robot.generar({ oficina, matricula });
      await panel('/api/admin/batch/item', { itemId, matricula, oficina, status: 'OK', costCents: COST_CENTS });
      ok++; log(`  ✓ ${matricula} OK`);
    } catch (e) {
      const error = String(e.message || e).slice(0, 300);
      await panel('/api/admin/batch/item', { itemId, matricula, oficina, status: 'FAILED', error }).catch(() => {});
      fail++; log(`  ✕ ${matricula} FALLÓ: ${error}`);
    }
    await sleep(jitter(DELAY)); // PAUSA entre ítems
  }

  // reportar saldo al final (actualiza el panel + dispara alerta si quedó bajo)
  try {
    const saldoCOP = await robot.leerSaldo();
    if (saldoCOP != null) await panel('/api/admin/saldo', { saldoCOP });
  } catch (e) { log('saldo no reportado: ' + e.message); }
} catch (e) {
  log('ERROR worker: ' + String(e.message || e));
  process.exitCode = 1;
} finally {
  await robot.stop();
  process.stdout.write(JSON.stringify({ done, ok, fail }) + '\n');
}
