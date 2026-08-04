// Cierre del robot — 95200. SEGURO: no cobra. Verifica el fix del carrito y llega hasta la
// pantalla de medios de pago, parando ANTES de "Cuenta Prepago". Si 95200 ya está en el
// historial, la descarga gratis (prueba end-to-end sin gastar).
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
try {
  await robot.login();

  // 1) ¿ya está 95200 en el historial? (descarga gratis)
  log('revisando historial por 95200...');
  await p.goto('https://certificados.supernotariado.gov.co/certificado/portal/business/history.snr', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2000);
  const enHistorial = await p.locator('tr', { hasText: '95200' }).count().catch(() => 0);
  log('filas con 95200 en historial: ' + enHistorial);
  if (enHistorial > 0) {
    log('✅ 95200 YA existe en historial → descargando gratis');
    const pdf = await robot.descargarDesdeHistorial('95200');
    fs.writeFileSync(`${OUT}/CTL-95200.pdf`, pdf);
    log('✅✅ PDF 95200 descargado: ' + pdf.length + ' bytes (sin cobro)');
    await robot.stop();
    process.exit(0);
  }

  // 2) consultar + carrito (fix nuevo) + verificar que Pagar se habilita — SIN cobrar
  const info = await robot.consultar('BARRANQUILLA', '95200');
  log('95200 estado: ' + info.estado + ' | disponible: ' + info.disponible);
  if (!info.disponible) { log('⚠ no disponible → stop'); await robot.stop(); process.exit(0); }

  await robot.agregarAlCarrito(); // ahora usa formModalCarrito:btnAgregarCarrito + cierra frmClosePopup
  await p.waitForTimeout(1500);

  // ¿btnPagar habilitado?
  const pagarState = await p.evaluate(() => {
    const b = document.querySelector('[id="formGeneracionCertificados:btnPagar"]');
    if (!b) return 'NO_EXISTE';
    return b.disabled || b.classList.contains('ui-state-disabled') ? 'DISABLED' : 'ENABLED';
  });
  log('btnPagar => ' + pagarState);
  await p.screenshot({ path: `${OUT}/close-1-carrito.png`, fullPage: true });

  // ¿hay transacción pendiente bloqueando? (texto en la página)
  const bodyTxt = await p.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' '));
  const pend = bodyTxt.match(/transacci[oó]n[^.]{0,60}pendiente[^.]{0,60}/i);
  if (pend) log('⚠ posible transacción pendiente: ' + pend[0]);

  if (pagarState !== 'ENABLED') {
    log('🔴 Pagar sigue deshabilitado → NO cobro. Revisar close-1-carrito.png. (causa probable: tx pendiente)');
    await robot.stop();
    process.exit(0);
  }

  // 3) Pagar → confirmar Sí → llegar a Medios de Pago → STOP (no Cuenta Prepago = no cobra)
  log('Pagar (habilitado) → confirmar Sí → ir a Medios de Pago (NO cobra todavía)');
  await p.click('[id="formGeneracionCertificados:btnPagar"]');
  await p.waitForTimeout(1500);
  const si = p.locator('.ui-confirmdialog-yes').first();
  if (await si.count().catch(() => 0)) { await si.click({ force: true }); log('confirmado "Sí"'); }
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/close-2-medios-pago.png`, fullPage: true });

  const medios = await p.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500));
  const tienePrepago = /cuenta prepago/i.test(medios);
  log('pantalla actual: ' + medios.slice(0, 280));
  log('¿opción "Cuenta Prepago" visible?: ' + tienePrepago);
  log(tienePrepago
    ? '✅ LISTO PARA COBRAR: llegó a Medios de Pago con Cuenta Prepago. PARADO antes de cobrar.'
    : '⚠ no se ve "Cuenta Prepago" — revisar close-2-medios-pago.png');
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/close-err.png`, fullPage: true }).catch(() => {});
} finally {
  await robot.stop();
}
