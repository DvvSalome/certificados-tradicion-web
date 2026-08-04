// Recon 6: login -> goto DIRECTO generate.snr -> oficina + matricula -> Buscar (agrega al carrito).
// GRATIS. Se detiene en el carrito. NO toca "Pagar". Prueba navegacion directa (optimizacion).
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, '[r6] ' + m + '\n'); };
const USER = process.env.SNR_USER;
const PASS = process.env.SNR_PASS;
const MATRICULA = '168410';
const OFICINA = 'BARRANQUILLA';
const sel = (id) => `[id="${id}"]`;

async function login(page) {
  await page.goto('https://certificados.supernotariado.gov.co/', { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => log('goto warn: ' + e.message));
  await page.waitForTimeout(1500);
  const aviso = page.locator('[id="modalAvisoPago"] button, [id="modalAvisoPago"] .ui-dialog-titlebar-close').first();
  if (await aviso.count()) await aviso.click({ force: true }).catch(() => {});
  await page.waitForTimeout(700);
  await page.evaluate(() => { document.querySelectorAll('.ui-widget-overlay').forEach((o) => o.remove()); const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display = 'none'; }).catch(() => {});
  await page.evaluate(() => { try { PF('dialogLogin').show(); } catch (e) {} }).catch(() => {});
  await page.waitForSelector(sel('formLogin:inpUserLogin'), { state: 'visible', timeout: 15000 });
  await page.fill(sel('formLogin:inpUserLogin'), USER);
  await page.fill(sel('formLogin:inpPassLogin'), PASS);
  await page.click(sel('formLogin:btnIngresarLogin'));
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
}

async function dump(page, tag) {
  try { await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true }); } catch {}
  try { fs.writeFileSync(`${OUT}/${tag}.txt`, await page.evaluate(() => (document.body?.innerText || '').slice(0, 3000))); } catch {}
  log(`dumped ${tag} | url=${page.url()}`);
}

(async () => {
  if (!USER || !PASS) { log('FALTAN creds'); process.exit(1); }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    await login(page);

    // OPTIMIZACION: navegar DIRECTO a la ruta de generacion (sin clicks de menu)
    log('goto DIRECTO generate.snr');
    await page.goto('https://certificados.supernotariado.gov.co/certificado/portal/business/generate.snr', { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => log('goto generate warn: ' + e.message));
    await page.waitForTimeout(1500);
    const directoOK = page.url().includes('generate.snr') && (await page.locator(sel('formGeneracionCertificados:inpMatricula')).count().catch(() => 0)) > 0;
    log('navegacion directa funciona? ' + directoOK);
    await dump(page, '13-generate-loaded');

    const idxBefore = await page.inputValue(sel('formGeneracionCertificados:indiceMatricula')).catch(() => '?');
    log('indiceMatricula ANTES: ' + idxBefore);

    // seleccionar oficina (PrimeFaces selectOneMenu, fallback native)
    const omId = await page.evaluate((OF) => {
      const d = [...document.querySelectorAll('.ui-selectonemenu')].find((el) => el.id && new RegExp(OF).test(el.innerText));
      return d ? d.id : null;
    }, OFICINA);
    log('selectOneMenu oficina id: ' + omId);
    if (omId) {
      await page.locator(`[id="${omId}"]`).click().catch(() => {});
      await page.waitForTimeout(700);
      const item = page.locator(`[id="${omId}_panel"] li`).filter({ hasText: new RegExp('^' + OFICINA + '$') }).first();
      if (await item.count()) await item.click({ force: true }).catch((e) => log('item click: ' + e.message));
      else await page.getByText(OFICINA, { exact: true }).first().click({ force: true }).catch((e) => log('text click: ' + e.message));
    } else {
      const nid = await page.evaluate((OF) => { const s = [...document.querySelectorAll('select')].find((se) => [...se.options].some((o) => new RegExp(OF).test(o.text))); return s ? s.id : null; }, OFICINA);
      if (nid) await page.selectOption(`[id="${nid}"]`, { label: OFICINA }).catch((e) => log('selectOption: ' + e.message));
    }
    await page.waitForTimeout(1500);
    const idxAfter = await page.inputValue(sel('formGeneracionCertificados:indiceMatricula')).catch(() => '?');
    log('indiceMatricula DESPUES de elegir ' + OFICINA + ': ' + idxAfter);

    // matricula + Buscar (GRATIS, agrega al carrito)
    await page.fill(sel('formGeneracionCertificados:inpMatricula'), MATRICULA);
    log('click Buscar (agrega al carrito - gratis)');
    await page.click(sel('formGeneracionCertificados:btnBuscarMatricula')).catch((e) => log('buscar click: ' + e.message));
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await dump(page, '14-carrito');

    // capturar contenido del carrito + confirmar boton Pagar presente (NO clickear)
    const carrito = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.ui-datatable tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.innerText.trim()).filter(Boolean)).filter((r) => r.length);
      const pagar = !!document.querySelector('[id="formGeneracionCertificados:btnPagar"]');
      const msgs = [...document.querySelectorAll('.ui-messages, .ui-growl-item, .ui-message')].map((m) => m.innerText.trim()).filter(Boolean);
      return { rows, pagar, msgs };
    });
    fs.writeFileSync(`${OUT}/14-carrito.json`, JSON.stringify(carrito, null, 2));
    log('carrito filas: ' + JSON.stringify(carrito.rows));
    log('mensajes: ' + JSON.stringify(carrito.msgs));
    log('boton Pagar presente: ' + carrito.pagar + ' (NO se clickea)');

    log('RECON 6 STOP — carrito mapeado, sin pagar/generar');
  } catch (e) {
    log('FATAL: ' + e.message);
    await page.screenshot({ path: `${OUT}/r6-fatal.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
