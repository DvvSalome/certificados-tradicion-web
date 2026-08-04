import { chromium } from 'playwright';
import fs from 'fs';
import { ctlEmailHtml } from '../email/ctl-template.mjs';

const png = fs.readFileSync('recon/artifacts/ctl-preview-protected.png');
const dataUri = 'data:image/png;base64,' + png.toString('base64');
let html = ctlEmailHtml({ matricula: '168410', oficina: 'BARRANQUILLA', fecha: '25/06/2026', previewCid: 'ctlpreview', descargaUrl: 'https://certitradicion.com' });
html = html.replace('cid:ctlpreview', dataUri);

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 680, height: 1200 }, deviceScaleFactor: 2 })).newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'recon/artifacts/email-render.png', fullPage: true });
await browser.close();
console.log('render OK -> recon/artifacts/email-render.png');
