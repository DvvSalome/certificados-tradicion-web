// Recon 2: login real (1 intento) + confirmar saldo + autocomplete de oficinas.
// NO paga, NO genera certificado. Lee creds de --env-file=.env.local
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
fs.mkdirSync(OUT, { recursive: true });
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, '[r2] ' + m + '\n'); };
const USER = process.env.SNR_USER;
const PASS = process.env.SNR_PASS;
const sel = (id) => `[id="${id}"]`;

async function dump(page, tag) {
  try { await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true }); } catch (e) { log(`shot ${tag} fail: ${e.message}`); }
  try { fs.writeFileSync(`${OUT}/${tag}.txt`, await page.evaluate(() => (document.body?.innerText || '').slice(0, 3000))); } catch {}
  log(`dumped ${tag} | url=${page.url()}`);
}

(async () => {
  if (!USER || !PASS) { log('FALTAN creds (SNR_USER/SNR_PASS)'); process.exit(1); }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    acceptDownloads: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 900 },
  });
  const page = await ctx.newPage();
  try {
    await page.goto('https://certificados.supernotariado.gov.co/', { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => log('goto warn: ' + e.message));
    await page.waitForTimeout(1500);

    // 1) cerrar el modal de aviso (botón propio) + limpiar overlays sobrantes
    const avisoBtn = page.locator('[id="modalAvisoPago"] button, [id="modalAvisoPago"] .ui-dialog-titlebar-close').first();
    if (await avisoBtn.count()) { log('cerrando modalAvisoPago'); await avisoBtn.click({ force: true }).catch((e) => log('aviso close warn: ' + e.message)); }
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      document.querySelectorAll('.ui-widget-overlay').forEach((o) => o.remove());
      const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display = 'none';
    }).catch(() => {});
    await dump(page, '03-prelogin');

    // 2) abrir login por la API de PrimeFaces (evita intercept de overlay)
    await page.evaluate(() => { try { PF('dialogLogin').show(); } catch (e) {} }).catch(() => {});
    await page.waitForSelector(sel('formLogin:inpUserLogin'), { state: 'visible', timeout: 15000 }).catch((e) => log('login form no visible: ' + e.message));
    await dump(page, '04-login-modal');

    // 3) login (UN solo intento)
    await page.fill(sel('formLogin:inpUserLogin'), USER);
    await page.fill(sel('formLogin:inpPassLogin'), PASS);
    log('enviando login...');
    await page.click(sel('formLogin:btnIngresarLogin'));
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await dump(page, '05-postlogin');

    // 4) exito + saldo
    const txt = await page.evaluate(() => document.body?.innerText || '');
    const hasSalir = await page.getByRole('button', { name: /salir/i }).first().isVisible().catch(() => false);
    const hasLoginErr = /clave.*incorrect|usuario.*incorrect|credencial|no.*coincide|inv[aá]lid/i.test(txt);
    log('Salir visible? ' + hasSalir + ' | error login? ' + hasLoginErr);
    const montos = (txt.match(/saldo[^\n]{0,50}|cupo[^\n]{0,50}|recarga[^\n]{0,50}|\$\s?[\d.]{2,}/gi) || []).slice(0, 10);
    log('montos/saldo detectados: ' + JSON.stringify(montos));

    // 5) autocomplete de oficinas (sin pagar)
    try {
      const office = page.locator(sel('formOficinas:autoCompleteOficinas_input'));
      if (await office.isVisible().catch(() => false)) {
        await office.click();
        await office.pressSequentially('BOGOTA', { delay: 120 });
        await page.waitForTimeout(3000);
        const sugg = await page.evaluate(() => [...document.querySelectorAll('.ui-autocomplete-panel li, ul[role="listbox"] li')].slice(0, 40).map((li) => li.innerText.trim()).filter(Boolean));
        fs.writeFileSync(`${OUT}/06-oficinas-bogota.json`, JSON.stringify(sugg, null, 2));
        log('sugerencias oficina "BOGOTA": ' + sugg.length + ' -> ' + JSON.stringify(sugg.slice(0, 6)));
        await dump(page, '06-oficinas');
      } else { log('campo oficina no visible (revisar 05-postlogin)'); }
    } catch (e) { log('autocomplete warn: ' + e.message); }

    log('RECON 2 OK (sin pagos)');
  } catch (e) {
    log('FATAL: ' + e.message);
    await dump(page, 'r2-fatal');
  } finally {
    await browser.close();
    log('done');
  }
})();
