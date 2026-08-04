// Dump de la pantalla "Selección de Medios de Pago" para identificar el target de "Cuenta Prepago".
// NO cobra. Llega a medios de pago y vuelca links/onclick/imgs.
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
  if (!info.disponible) { log('no disponible'); await robot.stop(); process.exit(0); }
  await robot.agregarAlCarrito();
  await p.waitForTimeout(1200);
  await p.click('[id="formGeneracionCertificados:btnPagar"]');
  await p.waitForTimeout(1500);
  const si = p.locator('.ui-confirmdialog-yes').first();
  if (await si.count().catch(() => 0)) await si.click({ force: true });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2500);

  const dump = await p.evaluate(() => {
    const all = [...document.querySelectorAll('a, [onclick], button, input[type=image], img, .ui-commandlink')];
    return all.map((e) => ({
      tag: e.tagName,
      id: e.id || null,
      title: e.title || null,
      alt: e.getAttribute && e.getAttribute('alt') || null,
      aria: e.getAttribute && e.getAttribute('aria-label') || null,
      src: (e.getAttribute && e.getAttribute('src') || '').split('/').slice(-1)[0] || null,
      onclick: (e.getAttribute && e.getAttribute('onclick') || '').slice(0, 90) || null,
      href: (e.getAttribute && e.getAttribute('href') || '').slice(0, 60) || null,
      text: (e.innerText || '').trim().slice(0, 40) || null,
    })).filter((x) => x.id || x.title || x.alt || x.onclick || x.text || x.src);
  });
  fs.writeFileSync(`${OUT}/medios-pago-dump.json`, JSON.stringify(dump, null, 2));
  log('elementos clickeables/imgs (' + dump.length + '):');
  for (const e of dump) {
    const s = [e.tag, e.id && `id=${e.id}`, e.title && `title="${e.title}"`, e.alt && `alt="${e.alt}"`, e.src && `src=${e.src}`, e.onclick && `onclick=${e.onclick}`, e.text && `txt="${e.text}"`].filter(Boolean).join('  ');
    log('  ' + s);
  }
} catch (e) {
  log('ERROR: ' + e.message);
} finally {
  await robot.stop();
}
