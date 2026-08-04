const inp = $input.first().json.body || $input.first().json;
const oficina = String(inp.oficina || '');
const matricula = String(inp.matricula || '').toUpperCase();
if (!oficina || !matricula) throw new Error('faltan oficina/matricula');

// Función para Browserless v2: código CRUDO (Content-Type application/javascript), valores INLINE,
// solo getElementById (sin selectores CSS ni regex → sin problemas de escape). Método de consulta
// probado vía chrome-devtools: select nativo + change dispara el AJAX del índice.
const FN = `export default async function ({ page }) {
  const oficina = ${JSON.stringify(oficina)};
  const matricula = ${JSON.stringify(matricula)};
  const user = "CC22521092";
  const pass = "Alex17";
  const BASE = "https://certificados.supernotariado.gov.co";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await page.goto(BASE + "/certificado", { waitUntil: "networkidle2", timeout: 90000 });
  await sleep(1200);
  await page.evaluate(function (u, p) {
    document.querySelectorAll(".ui-widget-overlay").forEach(function (o) { o.remove(); });
    var a = document.getElementById("modalAvisoPago"); if (a) a.style.display = "none";
    try { PF("dialogLogin").show(); } catch (e) {}
    var ui = document.getElementById("formLogin:inpUserLogin"); if (ui) ui.value = u;
    var pi = document.getElementById("formLogin:inpPassLogin"); if (pi) pi.value = p;
    var b = document.getElementById("formLogin:btnIngresarLogin"); if (b) b.click();
  }, user, pass);
  await sleep(4500);
  await page.goto(BASE + "/certificado/portal/business/generate.snr", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1500);
  await page.evaluate(function (of) {
    var sel = document.getElementById("formGeneracionCertificados:listaOficinas_input"); if (!sel) return;
    var opt = Array.prototype.slice.call(sel.options).find(function (o) { return o.textContent.trim().toUpperCase() === of.toUpperCase(); });
    if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  }, oficina);
  await sleep(2800);
  await page.evaluate(function (m) {
    var mat = document.getElementById("formGeneracionCertificados:inpMatricula");
    if (mat) { mat.value = m; mat.dispatchEvent(new Event("input", { bubbles: true })); }
  }, matricula);
  await sleep(400);
  var matVal = await page.evaluate(function () { var x = document.getElementById("formGeneracionCertificados:inpMatricula"); return x ? x.value : "NO_INPUT"; });
  // CLICK REAL de puppeteer (secuencia mouse completa)
  var bh = await page.evaluateHandle(function () { return document.getElementById("formGeneracionCertificados:btnBuscarMatricula"); });
  if (bh) { await bh.click().catch(function () {}); }
  // esperar a que el modal de resultado se pueble (en vez de un sleep fijo)
  await page.waitForFunction(function () {
    var m = document.getElementById("formModalMatriculaCarrito");
    var t = (m && m.innerText) || "";
    return t.indexOf("Estado") >= 0 || t.indexOf("Disponible") >= 0 || t.indexOf("no se encuentra") >= 0 || t.toLowerCase().indexOf("no disponible") >= 0;
  }, { timeout: 18000 }).catch(function () {});
  await sleep(800);
  var info = await page.evaluate(function () {
    // el id del modal puede no aplicar en headless → fallback al body (la info igual está ahí)
    var m = document.getElementById("formModalMatriculaCarrito");
    var t = (m && m.innerText) || document.body.innerText || "";
    var lines = t.split(String.fromCharCode(10)).map(function (s) { return s.trim(); });
    function grab(l) { var i = lines.lastIndexOf(l); return (i >= 0 && i + 1 < lines.length) ? lines[i + 1] : null; }
    return { direccion: grab("Direccion"), circulo: grab("Circulo"), estado: grab("Estado") };
  });
  var disponible = (info.estado || "").toLowerCase().indexOf("disponible") >= 0;
  return { data: { oficina: oficina, matricula: matricula, disponible: disponible, estado: info.estado, direccion: info.direccion, circulo: info.circulo }, type: "application/json" };
}`;

const res = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://browserless_browserless:3000/function?token=<PONER_BROWSERLESS_TOKEN>',
  body: FN,
  headers: { 'Content-Type': 'application/javascript' },
  json: false,
  timeout: 78000,
});
const parsed = (typeof res === 'string') ? JSON.parse(res) : res;
const d = (parsed && parsed.data) ? parsed.data : parsed;
return [{ json: d }];
