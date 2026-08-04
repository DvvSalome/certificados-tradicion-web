// CLI del SNR Robot. Lo invoca n8n/Browserless o pruebas locales.
//   node --env-file=.env.local robot/run.mjs --dry-run --oficina BARRANQUILLA --matricula 168410
//   node --env-file=.env.local robot/run.mjs --historial --matricula 168410
//   node --env-file=.env.local robot/run.mjs --oficina BARRANQUILLA --matricula 168410   (REAL: cobra saldo)
import { SnrRobot } from '../robot-service/snr-robot.mjs';
import fs from 'fs';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };

const robot = new SnrRobot({
  user: process.env.SNR_USER,
  pass: process.env.SNR_PASS,
  browserlessWs: process.env.BROWSERLESS_WS || null,
  headless: !has('--headful'),
  stateFile: process.env.SNR_STATE_FILE || 'recon/artifacts/snr-state.json',
  log: (m) => console.error(m), // logs a stderr; stdout queda limpio para JSON
});

const out = (obj) => process.stdout.write(JSON.stringify(obj) + '\n');

// Reporta el resultado al panel admin (si está configurado) → captura en bitácora + alerta si falla.
async function reportPanel(body) {
  const base = process.env.PANEL_BASE_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!base || !secret) return;
  await fetch(`${base.replace(/\/$/, '')}/api/admin/generation`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': secret }, body: JSON.stringify(body),
  }).catch((e) => console.error('[run] no se pudo reportar al panel: ' + e.message));
}

(async () => {
  await robot.start();
  try {
    if (has('--historial')) {
      const pdf = await robot.descargarDesdeHistorial(val('--matricula'));
      const dest = `recon/artifacts/ctl-${val('--matricula') || 'last'}.pdf`;
      fs.writeFileSync(dest, pdf);
      out({ ok: true, mode: 'historial', file: dest, bytes: pdf.length });
    } else {
      const oficina = val('--oficina');
      const matricula = val('--matricula');
      const reference = val('--reference'); // opcional: liga el reporte a la orden Wompi
      if (!oficina || !matricula) throw new Error('faltan --oficina y --matricula');
      const r = await robot.generar({ oficina, matricula, dryRun: has('--dry-run') });
      if (r.pdf) {
        const dest = `recon/artifacts/ctl-${matricula}.pdf`; fs.writeFileSync(dest, r.pdf);
        const costCents = Number(process.env.SNR_COST_COP || 23000) * 100;
        await reportPanel({ reference, matricula, oficina, status: 'OK', costCents });
        out({ ok: true, mode: 'generar', file: dest, bytes: r.pdf.length, info: r.info });
      } else out({ ok: true, mode: 'dry-run', info: r.info });
    }
  } catch (e) {
    const error = String(e.message || e);
    // si fue una generación real (no dry-run/historial), reporta el fallo al panel → alerta/devolución.
    // errorCode NO_DISPONIBLE = matrícula inválida → el panel devuelve la plata al cliente.
    if (!has('--dry-run') && !has('--historial') && val('--matricula')) {
      const errorCode = e.code === 'NO_DISPONIBLE' ? 'NO_DISPONIBLE' : 'ERROR';
      await reportPanel({ reference: val('--reference'), matricula: val('--matricula'), oficina: val('--oficina'), status: 'FAILED', errorCode, error });
    }
    out({ ok: false, error });
    process.exitCode = 1;
  } finally {
    await robot.stop();
  }
})();
