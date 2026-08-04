// Captura TODOS los endpoints/red del SNR durante el flujo real (CDP vía Playwright).
// Objetivo: ver si podemos optimizar con "cookie + rutas directas" en vez de automatizar la UI.
// NO cobra: para en "Selección de Medios de Pago".
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => console.log('· ' + m);
const HOST = 'certificados.supernotariado.gov.co';
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

const net = [];        // [{phase, method, url, type, status, jsf, post}]
let phase = 'boot';

await robot.start();
const p = robot.page;

// solo nos interesa el host del SNR (document/xhr/fetch), ignoramos imágenes/css
p.on('request', (req) => {
  const u = req.url();
  if (!u.includes(HOST)) return;
  const type = req.resourceType();
  if (!['document', 'xhr', 'fetch'].includes(type)) return;
  const post = req.postData() || '';
  // extraer los params JSF clave del POST (source, partial, render, ViewState presente?)
  const jsf = {};
  if (post) {
    for (const kv of post.split('&')) {
      const [k, v = ''] = kv.split('=');
      const key = decodeURIComponent(k);
      if (/javax\.faces|primefaces|^formGeneracionCertificados|^formLogin|^formModal/i.test(key)) {
        jsf[key] = decodeURIComponent(v.replace(/\+/g, ' ')).slice(0, 80);
      }
    }
  }
  net.push({
    phase, method: req.method(), url: u.replace(`https://${HOST}`, ''), type,
    hasViewState: /javax\.faces\.ViewState/.test(post),
    source: jsf['javax.faces.source'] || null,
    render: jsf['javax.faces.partial.render'] || null,
    postKeys: Object.keys(jsf),
  });
});

async function dumpCookies(tag) {
  const cookies = await robot.ctx.cookies();
  const snr = cookies.filter((c) => c.domain.includes('supernotariado')).map((c) => ({ name: c.name, value: c.value.slice(0, 12) + '…', httpOnly: c.httpOnly, secure: c.secure }));
  log(`cookies[${tag}]: ` + JSON.stringify(snr));
  return snr;
}

try {
  phase = 'login';
  await robot.login();
  const cookiesAfterLogin = await dumpCookies('post-login');

  phase = 'consultar';
  const info = await robot.consultar('BARRANQUILLA', '95200');
  log('95200 estado: ' + info.estado);

  phase = 'carrito';
  await robot.agregarAlCarrito();
  await p.waitForTimeout(1500);

  phase = 'pagar';
  // cerrar notificación si aparece, luego Pagar (NO confirma cobro)
  const aceptar = p.getByRole('button', { name: /^Aceptar$/ }).first();
  if (await aceptar.isVisible().catch(() => false)) await aceptar.click({ force: true }).catch(() => {});
  await p.waitForTimeout(800);
  await p.click('[id="formGeneracionCertificados:btnPagar"]').catch((e) => log('pagar warn: ' + e.message));
  await p.waitForTimeout(1800);
  // confirmar "Sí" para llegar a la pantalla de medios de pago (esto AÚN no cobra)
  const si = p.locator('.ui-confirmdialog-yes').first();
  if (await si.count().catch(() => 0)) await si.click({ force: true }).catch(() => {});
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2500);

  phase = 'medios-pago';
  await p.screenshot({ path: `${OUT}/cap-medios-pago.png`, fullPage: true });
  const bodyTxt = await p.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500));
  log('PANTALLA actual: ' + bodyTxt.slice(0, 300));
  log('⏸ STOP antes de cobrar. (NO se seleccionó Cuenta Prepago)');

  // resumen de endpoints únicos
  const byUrl = {};
  for (const r of net) {
    const k = `${r.method} ${r.url}`;
    if (!byUrl[k]) byUrl[k] = { method: r.method, url: r.url, type: r.type, count: 0, phases: new Set(), viewState: false, sources: new Set() };
    byUrl[k].count++; byUrl[k].phases.add(r.phase); if (r.hasViewState) byUrl[k].viewState = true; if (r.source) byUrl[k].sources.add(r.source);
  }
  const summary = Object.values(byUrl).map((e) => ({ ...e, phases: [...e.phases], sources: [...e.sources] }));
  fs.writeFileSync(`${OUT}/endpoints-summary.json`, JSON.stringify(summary, null, 2));
  fs.writeFileSync(`${OUT}/endpoints-full.json`, JSON.stringify({ cookiesAfterLogin, requests: net }, null, 2));
  log(`✅ ${net.length} requests capturados, ${summary.length} endpoints únicos -> recon/artifacts/endpoints-summary.json`);
  log('ENDPOINTS:');
  for (const e of summary) log(`  ${e.method} ${e.url}  [${e.phases.join(',')}]  VS=${e.viewState}  src=${[...e.sources].join('|') || '-'}`);
} catch (e) {
  log('ERROR: ' + e.message);
  await p.screenshot({ path: `${OUT}/cap-err.png` }).catch(() => {});
  fs.writeFileSync(`${OUT}/endpoints-full.json`, JSON.stringify({ requests: net }, null, 2));
} finally {
  await robot.stop();
}
