// Recon: leer el SALDO de la cuenta prepago de la SNR (para el panel admin).
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
try {
  await robot.login();
  const page = robot.page;
  await page.screenshot({ path: `${OUT}/saldo-01-dashboard.png`, fullPage: true });
  const dash = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${OUT}/saldo-00-dashboard.txt`, dash);
  log('en dashboard: ' + (dash.match(/cuenta prepago[^\n]{0,40}/i)?.[0] || 'sin "cuenta prepago" visible'));

  // ir a Cuenta Prepago
  const link = page.getByText(/cuenta prepago/i).first();
  if (await link.count()) { log('click "Cuenta Prepago"'); await link.click({ force: true }).catch((e) => log('warn click: ' + e.message)); }
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/saldo-02-prepago.png`, fullPage: true });
  const txt = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${OUT}/saldo-02-prepago.txt`, txt);

  const hits = (txt.match(/(saldo|cupo|disponible|recarga|prepago)[^\n]{0,70}/gi) || []).slice(0, 25);
  const montos = (txt.match(/\$\s?[\d.,]{3,}|[\d.]{4,}\s*(pesos|cop)/gi) || []).slice(0, 25);
  log('LÍNEAS saldo/cupo: ' + JSON.stringify(hits));
  log('MONTOS detectados: ' + JSON.stringify(montos));
  log('url: ' + page.url());
} catch (e) {
  log('ERROR ' + e.message);
} finally {
  await robot.stop();
}
