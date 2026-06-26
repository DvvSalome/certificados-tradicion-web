// Renderiza el HTML del Estudio a PDF usando una página NUEVA de Browserless (no la del genRobot logueado).
import { chromium } from 'playwright';
import { estudioHtml } from './estudio-template.mjs';

export async function renderEstudioPdf(estudio, meta) {
  const ws = process.env.BROWSERLESS_WS;
  if (!ws) throw new Error('BROWSERLESS_WS no seteado');
  const browser = await chromium.connectOverCDP(ws);
  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.setContent(estudioHtml(estudio, meta), { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
    await ctx.close();
    return Buffer.from(pdf);
  } finally { try { await browser.close(); } catch {} }
}
