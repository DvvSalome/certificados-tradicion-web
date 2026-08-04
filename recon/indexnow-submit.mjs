// Envía TODAS las URLs del sitemap a IndexNow → notifica al instante a Bing, Yandex, Seznam…
// (y eso alimenta el índice que usan ChatGPT/Copilot). Ejecutar DESPUÉS de desplegar el archivo
// de clave en web/public/<KEY>.txt.  Uso:  node recon/indexnow-submit.mjs
const HOST = 'certitradicion.com';
const KEY = '***REDACTED***';
const KEY_LOC = `https://${HOST}/${KEY}.txt`;

// 1) leer el sitemap real (fuente de verdad de las URLs)
const sm = await fetch(`https://${HOST}/sitemap.xml`, { cache: 'no-store' }).then((r) => r.text());
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urls.length) { console.error('sitemap vacío o inalcanzable'); process.exit(1); }
console.log(`sitemap: ${urls.length} URLs`);

// 2) confirmar que la clave está publicada (IndexNow la verifica)
const keyOk = await fetch(KEY_LOC, { cache: 'no-store' }).then((r) => r.ok).catch(() => false);
console.log(`clave en ${KEY_LOC}: ${keyOk ? 'OK' : 'NO ACCESIBLE (despliega primero el .txt)'}`);
if (!keyOk) process.exit(1);

// 3) enviar el lote a IndexNow
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOC, urlList: urls }),
});
const body = await res.text().catch(() => '');
console.log(`IndexNow → HTTP ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
// 200/202 = aceptado. 422 = alguna URL no es del host. 403 = clave inválida.
