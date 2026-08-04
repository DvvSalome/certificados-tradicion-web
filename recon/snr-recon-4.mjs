// Recon 4: login -> historial -> descargar el PDF de un CTL ya pagado (costo cero).
// Selector exacto por title. Verifica que el archivo sea un PDF real.
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, '[r4] ' + m + '\n'); };
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

function verifyPdf(path) {
  try { const b = fs.readFileSync(path); return { ok: b.slice(0, 5).toString() === '%PDF-', size: b.length, head: b.slice(0, 8).toString('latin1') }; }
  catch (e) { return { ok: false, err: e.message }; }
}

(async () => {
  if (!USER || !PASS) { log('FALTAN creds'); process.exit(1); }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    await login(page);
    const hist = page.getByText('Historial Certificados', { exact: false }).first();
    if (await hist.count()) await hist.click({ force: true }).catch((e) => log('hist warn: ' + e.message));
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForSelector('[title="Presione para descargar certificado"]', { timeout: 15000 }).catch(() => log('no aparece link descargar'));
    await page.waitForTimeout(1000);

    // Vía A: link directo de descarga del certificado en la primera fila de datos
    let done = false;
    const direct = page.locator('[title="Presione para descargar certificado"]').first();
    if (await direct.count()) {
      log('Via A: click link descargar certificado (fila 0)');
      try {
        const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), direct.click({ force: true })]);
        const fname = dl.suggestedFilename() || 'ctl-168410.pdf';
        const dest = `${OUT}/${fname}`;
        await dl.saveAs(dest);
        log('Via A descarga -> ' + fname + ' | ' + JSON.stringify(verifyPdf(dest)));
        done = true;
      } catch (e) { log('Via A fallo: ' + e.message.split('\n')[0]); }
    }

    // Vía B: abrir modal Detalle y descargar desde ahí
    if (!done) {
      log('Via B: abrir modal Detalle');
      const det = page.locator('[title*="detalle del certificado actual"]').first();
      if (await det.count()) {
        await det.click({ force: true }).catch((e) => log('det click: ' + e.message));
        await page.waitForSelector('[id="formModalDetalleCertificado"]', { state: 'visible', timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const dlBtn = page.locator('[title*="Descargar este certificado de Tradicion"]').first();
        try {
          const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), dlBtn.click({ force: true })]);
          const fname = dl.suggestedFilename() || 'ctl-detalle.pdf';
          const dest = `${OUT}/${fname}`;
          await dl.saveAs(dest);
          log('Via B descarga -> ' + fname + ' | ' + JSON.stringify(verifyPdf(dest)));
          done = true;
        } catch (e) { log('Via B fallo: ' + e.message.split('\n')[0]); }
      }
    }

    await page.screenshot({ path: `${OUT}/10-download-result.png`, fullPage: true }).catch(() => {});
    log(done ? 'RECON 4 OK — PDF descargado' : 'RECON 4 — no se descargó, revisar capturas');
  } catch (e) {
    log('FATAL: ' + e.message);
    await page.screenshot({ path: `${OUT}/r4-fatal.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
