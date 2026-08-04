// Recon 5: login -> abrir "Certificado Tradicion" (flujo logueado/prepago) y mapear el formulario.
// NO genera, NO paga. Solo descubre selectores y ruta. Se detiene en el form.
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, '[r5] ' + m + '\n'); };
const USER = process.env.SNR_USER;
const PASS = process.env.SNR_PASS;
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

async function dumpFields(page, tag) {
  try { await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true }); } catch {}
  try { fs.writeFileSync(`${OUT}/${tag}.txt`, await page.evaluate(() => (document.body?.innerText || '').slice(0, 3000))); } catch {}
  try {
    const f = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
      const pick = (e) => ({ tag: e.tagName, type: e.getAttribute('type'), id: e.id || null, name: e.getAttribute('name'), ph: e.getAttribute('placeholder'), title: e.title || e.getAttribute('aria-label'), text: (e.innerText || e.value || '').trim().slice(0, 50), vis: vis(e) });
      return {
        inputs: [...document.querySelectorAll('input:not([type=hidden])')].map(pick).filter((x) => x.vis),
        buttons: [...document.querySelectorAll('button, a.ui-button, .ui-commandlink, [role=button]')].map(pick).filter((x) => x.vis && (x.text || x.title)),
      };
    });
    fs.writeFileSync(`${OUT}/${tag}.fields.json`, JSON.stringify(f, null, 2));
    log(`${tag}: ${f.inputs.length} inputs vis, ${f.buttons.length} botones vis`);
  } catch (e) { log('dumpFields ' + tag + ' fail: ' + e.message); }
  log(`url=${page.url()}`);
}

(async () => {
  if (!USER || !PASS) { log('FALTAN creds'); process.exit(1); }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    await login(page);
    await dumpFields(page, '11-dashboard');

    // abrir "Certificado Tradicion"
    const ct = page.getByText('Certificado Tradicion', { exact: false }).first();
    if (await ct.count()) { log('click Certificado Tradicion'); await ct.click({ force: true }).catch((e) => log('ct click warn: ' + e.message)); }
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await dumpFields(page, '12-cert-tradicion-form');

    log('RECON 5 STOP — formulario mapeado, sin generar nada');
  } catch (e) {
    log('FATAL: ' + e.message);
    await page.screenshot({ path: `${OUT}/r5-fatal.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
