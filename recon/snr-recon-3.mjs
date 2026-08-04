// Recon 3: login -> Historial Certificados -> descargar un CTL YA pagado (costo cero).
// Mapea el mecanismo de descarga del PDF. NO genera certificados nuevos.
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
fs.mkdirSync(OUT, { recursive: true });
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, '[r3] ' + m + '\n'); };
const USER = process.env.SNR_USER;
const PASS = process.env.SNR_PASS;
const sel = (id) => `[id="${id}"]`;

async function dump(page, tag) {
  try { await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true }); } catch (e) { log(`shot ${tag} fail: ${e.message}`); }
  try { fs.writeFileSync(`${OUT}/${tag}.txt`, await page.evaluate(() => (document.body?.innerText || '').slice(0, 3500))); } catch {}
  log(`dumped ${tag} | url=${page.url()}`);
}

async function login(page) {
  await page.goto('https://certificados.supernotariado.gov.co/', { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => log('goto warn: ' + e.message));
  await page.waitForTimeout(1500);
  const avisoBtn = page.locator('[id="modalAvisoPago"] button, [id="modalAvisoPago"] .ui-dialog-titlebar-close').first();
  if (await avisoBtn.count()) await avisoBtn.click({ force: true }).catch(() => {});
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

(async () => {
  if (!USER || !PASS) { log('FALTAN creds'); process.exit(1); }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    acceptDownloads: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 900 },
  });
  const page = await ctx.newPage();
  try {
    await login(page);
    await dump(page, '07-dashboard');

    // ir a Historial Certificados
    const hist = page.getByText('Historial Certificados', { exact: false }).first();
    if (await hist.count()) { log('click Historial Certificados'); await hist.click({ force: true }).catch((e) => log('hist click warn: ' + e.message)); }
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await dump(page, '08-historial');

    // extraer tabla + botones por fila
    const rows = await page.evaluate(() => {
      const trs = [...document.querySelectorAll('.ui-datatable tbody tr, table tbody tr')];
      return trs.slice(0, 25).map((tr) => ({
        cells: [...tr.querySelectorAll('td')].map((td) => td.innerText.trim()).filter(Boolean),
        actions: [...tr.querySelectorAll('button, a')].map((b) => ({ id: b.id || null, title: b.title || b.getAttribute('aria-label') || null, text: (b.innerText || '').trim().slice(0, 30), cls: (b.className || '').slice(0, 60) })).filter((a) => a.id || a.title || a.text),
      }));
    });
    fs.writeFileSync(`${OUT}/08-historial-rows.json`, JSON.stringify(rows, null, 2));
    log(`historial filas: ${rows.length}`);
    if (rows[0]) log('fila[0] cells: ' + JSON.stringify(rows[0].cells));

    // intentar descargar el CTL de la primera fila (ya pagado -> gratis)
    const firstRow = page.locator('.ui-datatable tbody tr, table tbody tr').first();
    const candidates = ['[title*="escarg" i]', '[title*="CTL" i]', '[title*="ertificad" i]', 'a[href*="pdf" i]', 'button .fa-download', '.ui-icon-arrowthickstop-1-s', 'button', 'a'];
    let got = false;
    for (const c of candidates) {
      const b = firstRow.locator(c).first();
      if (await b.count().catch(() => 0)) {
        log('intentando descarga via candidato: ' + c);
        try {
          const [dl] = await Promise.all([
            page.waitForEvent('download', { timeout: 15000 }),
            b.click({ force: true }),
          ]);
          const fname = dl.suggestedFilename() || 'ctl-sample.pdf';
          await dl.saveAs(`${OUT}/${fname}`);
          log('DESCARGA OK -> ' + fname);
          got = true;
          break;
        } catch (e) {
          log('candidato ' + c + ' no descargó: ' + e.message.split('\n')[0]);
          await page.waitForTimeout(800);
        }
      }
    }
    if (!got) log('no se logró descarga automatica; revisar 08-historial-rows.json para selector exacto');
    await dump(page, '09-postdownload');
    log('RECON 3 done');
  } catch (e) {
    log('FATAL: ' + e.message);
    await dump(page, 'r3-fatal');
  } finally {
    await browser.close();
  }
})();
