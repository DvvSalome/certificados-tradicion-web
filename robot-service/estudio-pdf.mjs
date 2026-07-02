// Renderiza el HTML del Estudio a PDF usando una página NUEVA de Browserless (no la del genRobot logueado).
import { chromium } from 'playwright';
import { estudioHtml } from './estudio-template.mjs';

export async function renderEstudioPdf(estudio, meta) {
  const ws = process.env.BROWSERLESS_WS;
  if (!ws) throw new Error('BROWSERLESS_WS no seteado');
  const browser = await chromium.connectOverCDP(ws);
  let ctx;
  try {
    ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.setContent(estudioHtml(estudio, meta), { waitUntil: 'load' });
    // preferCSSPageSize → respeta @page (margen 0 en pág.1 a sangre, 14mm en las siguientes) y break-inside.
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally { try { await ctx?.close(); } catch {} try { await browser.close(); } catch {} }
}
