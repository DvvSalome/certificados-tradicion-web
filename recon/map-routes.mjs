// MAPA de rutas del portal SNR (post-login): menú + todos los enlaces/.snr + candidatas de
// "transacciones pendientes" para reanudar el pago directo (saltar el btnPagar flaky).
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const BASE = 'https://certificados.supernotariado.gov.co';
const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
try {
  await robot.login();
  await p.waitForTimeout(1500);

  // 1) abrir el menú (icono hamburguesa) y volcar items
  const menuBtn = p.locator('[id*="menu" i], .ui-menubutton, a[title*="Menu" i], [class*="menu" i] a').first();
  if (await menuBtn.count().catch(() => 0)) { await menuBtn.click({ force: true }).catch(() => {}); await p.waitForTimeout(800); }

  // 2) volcar TODOS los enlaces/elementos navegables (href, onclick con .snr, data-*)
  const links = await p.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('a, [onclick], li[role="menuitem"], .ui-menuitem-link')) {
      const href = e.getAttribute('href') || '';
      const onclick = e.getAttribute('onclick') || '';
      const txt = (e.innerText || e.title || '').trim().slice(0, 50);
      if (href || onclick || txt) out.push({ txt, href: href.slice(0, 90), onclick: onclick.slice(0, 120) });
    }
    return out;
  });
  fs.writeFileSync(`${OUT}/routes-dump.json`, JSON.stringify(links, null, 2));
  const interesting = links.filter((l) => /\.snr|transacc|pendiente|pago|histor|recupera|carrito|prepago|consult/i.test(l.txt + l.href + l.onclick));
  log('enlaces/acciones de interés (' + interesting.length + ' de ' + links.length + '):');
  for (const l of interesting.slice(0, 40)) log(`  "${l.txt}"  href=${l.href || '-'}  ${l.onclick ? 'onclick=' + l.onclick : ''}`);

  // 3) probar rutas .snr candidatas (GET directo) para ver cuáles existen
  const candidatos = [
    '/certificado/portal/business/transacciones.snr',
    '/certificado/portal/business/transaccionesPendientes.snr',
    '/certificado/portal/business/pagosPendientes.snr',
    '/certificado/portal/business/misTransacciones.snr',
    '/certificado/portal/business/carrito.snr',
    '/certificado/portal/business/pagos.snr',
    '/certificado/portal/business/recuperarCertificado.snr',
    '/certificado/portal/business/mediosPago.snr',
    '/certificado/portal/business/history.snr',
  ];
  log('--- probando rutas .snr candidatas ---');
  for (const path of candidatos) {
    const resp = await p.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null);
    const status = resp ? resp.status() : 'ERR';
    const finalUrl = p.url().replace(BASE, '');
    const title = await p.evaluate(() => (document.querySelector('h1,h2,.ui-panel-title,title')?.innerText || document.title || '').slice(0, 60)).catch(() => '');
    const redirected = !finalUrl.includes(path.split('/').pop());
    log(`  ${path.split('/').pop().padEnd(28)} -> ${status} ${redirected ? '(redir -> ' + finalUrl + ')' : 'OK'} ${title ? '· ' + title : ''}`);
    await p.waitForTimeout(400);
  }
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/map-err.png` }).catch(() => {});
} finally {
  await robot.stop();
}
