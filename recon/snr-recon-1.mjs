// Recon 1: mapea home + página de login del portal SNR.
// NO envía credenciales (evita bloquear la cuenta por intentos fallidos).
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'recon/artifacts';
fs.mkdirSync(OUT, { recursive: true });
const log = (m) => { console.log(m); fs.appendFileSync(`${OUT}/log.txt`, m + '\n'); };

async function dump(page, tag) {
  try { await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true }); } catch (e) { log(`shot ${tag} fail: ${e.message}`); }
  try { fs.writeFileSync(`${OUT}/${tag}.html`, await page.content()); } catch {}
  try {
    const fields = await page.evaluate(() => {
      const pick = (e) => ({
        tag: e.tagName, type: e.getAttribute('type'), name: e.getAttribute('name'),
        id: e.id || null, placeholder: e.getAttribute('placeholder'),
        text: (e.innerText || e.value || '').trim().slice(0, 80),
      });
      return {
        inputs: [...document.querySelectorAll('input')].map(pick),
        selects: [...document.querySelectorAll('select')].map((s) => ({
          name: s.name, id: s.id,
          options: [...s.options].slice(0, 60).map((o) => ({ value: o.value, label: o.text.trim() })),
        })),
        buttons: [...document.querySelectorAll('button, input[type=submit], [role=button]')].map(pick),
        links: [...document.querySelectorAll('a[href]')].slice(0, 100).map((a) => ({
          text: (a.innerText || '').trim().slice(0, 60), href: a.getAttribute('href'),
        })),
        hasIframe: document.querySelectorAll('iframe').length,
        bodyText: (document.body?.innerText || '').slice(0, 1500),
      };
    });
    fs.writeFileSync(`${OUT}/${tag}.fields.json`, JSON.stringify(fields, null, 2));
  } catch (e) { log(`dump ${tag} fail: ${e.message}`); }
  log(`dumped ${tag} | url=${page.url()} | title=${await page.title().catch(() => '')}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    acceptDownloads: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 900 },
  });
  const page = await ctx.newPage();
  try {
    log('goto home');
    await page.goto('https://certificados.supernotariado.gov.co/', { waitUntil: 'networkidle', timeout: 90000 })
      .catch((e) => log('goto home warn: ' + e.message));
    await dump(page, '01-home');

    const loginSelectors = ['text=/iniciar sesi/i', 'text=/ingresar/i', 'text=/acceder/i', 'a[href*="ogin"]'];
    let opened = false;
    for (const sel of loginSelectors) {
      const loc = page.locator(sel).first();
      if (await loc.count().catch(() => 0)) {
        log('clicking login via ' + sel);
        await loc.click({ timeout: 10000 }).catch((e) => log('click fail ' + sel + ': ' + e.message));
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
        opened = true;
        break;
      }
    }
    if (!opened) log('no login link found on home (login may be inline)');
    await dump(page, '02-login');
  } catch (e) {
    log('FATAL: ' + e.message);
    await dump(page, 'fatal');
  } finally {
    await browser.close();
    log('done');
  }
})();
