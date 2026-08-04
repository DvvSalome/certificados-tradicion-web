// Paso 3 (REAL, cobra ~$23k): flujo completo de 95200 incluyendo "Cuenta Prepago".
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
async function closeNotif() {
  const a = p.getByRole('button', { name: /^Aceptar$/ }).first();
  if (await a.isVisible().catch(() => false)) await a.click({ force: true }).catch(() => {});
  await p.evaluate(() => document.querySelectorAll('.ui-widget-overlay,.ui-dialog-mask').forEach((o) => o.remove())).catch(() => {});
  await p.waitForTimeout(500);
}
try {
  await robot.login();
  const info = await robot.consultar('BARRANQUILLA', '95200');
  if (!info.disponible) { log('⚠ 95200 NO disponible: ' + info.estado + ' -> STOP'); await robot.stop(); process.exit(0); }
  await robot.agregarAlCarrito();
  await p.waitForTimeout(1200);
  await closeNotif();

  log('PAGAR');
  await p.click('[id="formGeneracionCertificados:btnPagar"]');
  await p.waitForTimeout(1800);
  for (const sel of ['.ui-confirmdialog-yes', 'button.ui-confirmdialog-yes']) {
    const b = p.locator(sel).first();
    if (await b.count().catch(() => 0)) { await b.click({ force: true }); break; }
  }
  await p.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);

  log('🔴 seleccionar CUENTA PREPAGO (cobra saldo + genera)');
  await p.getByText(/Cuenta Prepago/i).first().click({ force: true });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `${OUT}/gen-7-prepago.png`, fullPage: true });
  // posible confirmación de pago con saldo
  await closeNotif();
  for (const sel of ['.ui-confirmdialog-yes', 'button.ui-confirmdialog-yes']) {
    const b = p.locator(sel).first();
    if (await b.count().catch(() => 0)) { log('confirmar pago saldo'); await b.click({ force: true }); break; }
  }
  const yes = p.getByRole('button', { name: /^(S[ií]|Aceptar|Confirmar|Generar)$/ }).first();
  if (await yes.isVisible().catch(() => false)) { await yes.click({ force: true }).catch(() => {}); }

  log('generando...');
  await p.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(7000);
  await p.screenshot({ path: `${OUT}/gen-8-done.png`, fullPage: true });
  log('estado: ' + (await p.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 400))));

  log('descargando CTL 95200 del historial');
  const pdf = await robot.descargarDesdeHistorial('95200');
  fs.writeFileSync(`${OUT}/CTL-95200.pdf`, pdf);
  log('✅✅✅ PDF 95200: ' + pdf.length + ' bytes -> recon/artifacts/CTL-95200.pdf');
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/gen-err3.png` }).catch(() => {});
} finally {
  await robot.stop();
}
