// Paso 1: llegar hasta la pantalla de pago de la matrícula 95200 (Barranquilla) y CAPTURARLA.
// NO confirma el cobro. Solo observa el flujo "Pagar con saldo" (que no habíamos visto).
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
try {
  await robot.login();
  log('consultar 95200 en BARRANQUILLA');
  const info = await robot.consultar('BARRANQUILLA', '95200');
  log('info inmueble: ' + JSON.stringify(info).slice(0, 320));
  await p.screenshot({ path: `${OUT}/gen-1-modal.png`, fullPage: true });
  if (!info.disponible) { log('⚠ NO disponible -> me detengo, no se gastó nada.'); await robot.stop(); process.exit(0); }

  log('Agregar al Carrito (gratis)');
  await robot.agregarAlCarrito();
  await p.screenshot({ path: `${OUT}/gen-2-carrito.png`, fullPage: true });

  log('click PAGAR (va a la pantalla de pago — aún NO cobra)');
  await p.click('[id="formGeneracionCertificados:btnPagar"]').catch((e) => log('pagar warn: ' + e.message));
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2800);
  await p.screenshot({ path: `${OUT}/gen-3-pagar.png`, fullPage: true });

  const dump = await p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const btns = [...document.querySelectorAll('button, a.ui-button, .ui-commandlink, [role=button], input[type=submit], .ui-selectonemenu, label')]
      .filter(vis)
      .map((e) => ({ id: e.id || null, title: e.title || e.getAttribute('aria-label') || null, text: (e.innerText || e.value || '').trim().slice(0, 45) }))
      .filter((b) => b.text || b.title);
    return { url: location.href, body: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 1600), btns };
  });
  fs.writeFileSync(`${OUT}/gen-3-pagar.json`, JSON.stringify(dump, null, 2));
  log('URL: ' + dump.url);
  log('PANTALLA DE PAGO (texto): ' + dump.body.slice(0, 500));
  log('BOTONES/OPCIONES: ' + JSON.stringify(dump.btns.slice(0, 18)));
  log('⏸ STOP antes de confirmar el cobro. Revisar capturas + json.');
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/gen-err.png` }).catch(() => {});
} finally {
  await robot.stop();
}
