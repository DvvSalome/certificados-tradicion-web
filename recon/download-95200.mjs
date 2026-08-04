// Login fresco + descargar el CTL 95200 recién generado del historial.
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });
await robot.start();
try {
  await robot.login();
  const pdf = await robot.descargarDesdeHistorial('95200');
  fs.writeFileSync('recon/artifacts/CTL-95200.pdf', pdf);
  log('✅✅✅ PDF 95200 descargado: ' + pdf.length + ' bytes -> recon/artifacts/CTL-95200.pdf');
} catch (e) {
  log('ERROR: ' + e.message);
  await robot.page.screenshot({ path: 'recon/artifacts/dl-95200-err.png', fullPage: true }).catch(() => {});
} finally {
  await robot.stop();
}
