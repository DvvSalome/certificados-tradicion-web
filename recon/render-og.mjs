import { chromium } from 'playwright';
const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet"></head>
<body style="margin:0;width:1200px;height:630px;font-family:'Plus Jakarta Sans',Arial,sans-serif;background:linear-gradient(135deg,#103A73,#0b2c55);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;position:relative;overflow:hidden;">
<div style="position:absolute;top:-120px;right:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(15,122,82,.35),transparent 70%);"></div>
<div style="display:flex;align-items:center;gap:16px;margin-bottom:30px;">
  <div style="width:64px;height:64px;border-radius:18px;background:#fff;display:flex;align-items:center;justify-content:center;">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#103A73" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  </div>
  <span style="font-size:34px;font-weight:800;letter-spacing:-.5px;">Certitradición</span>
</div>
<div style="font-size:64px;font-weight:800;line-height:1.05;letter-spacing:-1.5px;max-width:900px;">Certificado de Tradición<br>y Libertad <span style="color:#7fd3ad;">en línea</span></div>
<div style="font-size:30px;color:#bcd3ef;margin-top:26px;font-weight:500;">En minutos, a tu correo · Pago seguro con Wompi</div>
<div style="position:absolute;bottom:48px;left:90px;display:flex;align-items:center;gap:14px;font-size:22px;color:#9fc0e8;font-weight:600;">
  <span style="background:rgba(255,255,255,.12);padding:8px 18px;border-radius:999px;">certitradicion.com</span>
  <span style="background:rgba(15,122,82,.25);color:#9fe6c4;padding:8px 18px;border-radius:999px;">Documento oficial · validez 30 días</span>
</div>
</body></html>`;
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.screenshot({ path: 'web/public/og.png' });
await b.close();
console.log('OG -> web/public/og.png');
