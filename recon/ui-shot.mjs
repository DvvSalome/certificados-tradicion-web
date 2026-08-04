import { chromium } from 'playwright';
const URL = 'http://localhost:3005/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
let up = false;
for (let i = 0; i < 45; i++) {
  try { await page.goto(URL, { waitUntil: 'networkidle', timeout: 4000 }); up = true; break; }
  catch { await new Promise((r) => setTimeout(r, 1000)); }
}
if (!up) { console.log('server no respondió'); process.exit(1); }
await page.screenshot({ path: 'recon/artifacts/ui-home.png', fullPage: true });
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
await mp.goto(URL, { waitUntil: 'networkidle' });
await mp.screenshot({ path: 'recon/artifacts/ui-home-mobile.png', fullPage: true });
await browser.close();
console.log('shots OK');
