// Paso 2 (REAL, cobra ~$23k): generar la matrícula 95200 (Barranquilla) de punta a punta.
// login -> consultar -> agregar al carrito -> cerrar notificación -> Pagar -> confirmar "Sí" -> descargar.
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
try {
  await robot.login();
  const info = await robot.consultar('BARRANQUILLA', '95200');
  if (!info.disponible) { log('⚠ 95200 NO disponible -> STOP, no se cobró.'); await robot.stop(); process.exit(0); }
  log('inmueble: ' + info.direccion + ' · ' + info.circulo);

  await robot.agregarAlCarrito();
  await p.waitForTimeout(1500);

  // cerrar notificación "Matrícula agregada correctamente. Aceptar"
  const aceptar = p.getByRole('button', { name: /^Aceptar$/ }).first();
  if (await aceptar.isVisible().catch(() => false)) { log('cerrando notificación'); await aceptar.click({ force: true }).catch(() => {}); }
  await p.waitForTimeout(700);
  await p.evaluate(() => document.querySelectorAll('.ui-widget-overlay,.ui-dialog-mask').forEach((o) => o.remove())).catch(() => {});
  await p.waitForTimeout(500);

  log('🔴 PAGAR (cobra ~$23k del saldo)');
  await p.click('[id="formGeneracionCertificados:btnPagar"]');
  await p.waitForTimeout(2000);
  await p.screenshot({ path: `${OUT}/gen-5-confirm.png`, fullPage: true });

  // confirmar el diálogo "Procederemos con el pago, ¿está seguro?"
  log('confirmando pago (Sí)');
  await p.waitForSelector('.ui-confirmdialog, .ui-confirm-dialog, .ui-dialog', { timeout: 10000 }).catch(() => {});
  let clicked = false;
  for (const sel of ['.ui-confirmdialog-yes', '.ui-confirm-dialog-yes', 'button.ui-confirmdialog-yes']) {
    const b = p.locator(sel).first();
    if (await b.count().catch(() => 0)) { await b.click({ force: true }); clicked = true; break; }
  }
  if (!clicked) { await p.getByRole('button', { name: /^(S[ií]|Aceptar|Yes)$/ }).first().click({ force: true }).catch((e) => log('yes warn: ' + e.message)); }

  log('generando... esperando al portal');
  await p.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(6000);
  await p.screenshot({ path: `${OUT}/gen-6-generado.png`, fullPage: true });
  const post = await p.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 600));
  log('post-pago: ' + post.slice(0, 350));

  // descargar el CTL de 95200 del historial
  log('descargando CTL 95200 del historial');
  const pdf = await robot.descargarDesdeHistorial('95200');
  fs.writeFileSync(`${OUT}/CTL-95200.pdf`, pdf);
  log('✅✅ PDF 95200 descargado: ' + pdf.length + ' bytes -> recon/artifacts/CTL-95200.pdf');
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/gen-err2.png` }).catch(() => {});
} finally {
  await robot.stop();
}
