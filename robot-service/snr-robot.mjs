// SNR Robot — genera/descarga Certificados de Tradición y Libertad.
// Optimizado: sesión persistida (storageState/cookie) + navegación directa a rutas conocidas.
// Compatible local (chromium.launch) y producción (Browserless via connectOverCDP).
//
// Flujo confirmado por recon (portal v1.60.24, JSF/PrimeFaces):
//   login -> generate.snr -> oficina(selectOneMenu) -> matricula -> Buscar
//   -> modal "Informacion Matricula Seleccionada" (Estado: Disponible) -> Agregar al Carrito
//   -> Pagar (cobra saldo prepago) -> descarga PDF (o se baja del historial).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'https://certificados.supernotariado.gov.co';
const URL_HOME = `${BASE}/certificado`;
const URL_GEN = `${BASE}/certificado/portal/business/generate.snr`;
const URL_HIST = `${BASE}/certificado/portal/business/history.snr`;

const S = {
  userLogin: '[id="formLogin:inpUserLogin"]',
  passLogin: '[id="formLogin:inpPassLogin"]',
  btnLogin: '[id="formLogin:btnIngresarLogin"]',
  oficinaMenu: '[id="formGeneracionCertificados:listaOficinas"]',
  oficinaPanel: '[id="formGeneracionCertificados:listaOficinas_panel"]',
  indice: '[id="formGeneracionCertificados:indiceMatricula"]',
  matricula: '[id="formGeneracionCertificados:inpMatricula"]',
  btnBuscar: '[id="formGeneracionCertificados:btnBuscarMatricula"]',
  btnPagar: '[id="formGeneracionCertificados:btnPagar"]',
  btnLimpiar: '[id="formGeneracionCertificados:btnLimpiar"]',
  modalMatricula: '[id="formModalMatriculaCarrito"]',
  dlCertLink: '[title="Presione para descargar certificado"]',
};

// Selectores del CONSULTAR PÚBLICO (homepage `/certificado`, SIN login → form `formOficinas`).
const PUB = {
  ofButton: '[id="formOficinas:autoCompleteOficinas_button"]',
  ofPanelLi: '[id="formOficinas:autoCompleteOficinas_panel"] li',
  matricula: '[id="formOficinas:inpMatricula"]',
  btnBuscar: '[id="formOficinas:btnBuscar"]',
};

export class SnrRobot {
  constructor({ user, pass, browserlessWs = null, headless = true, slowMo = 0, stateFile = null, log = console.log } = {}) {
    // Credenciales solo necesarias para login() (generación). La consulta pública NO requiere sesión.
    this.user = user; this.pass = pass;
    this.browserlessWs = browserlessWs; this.headless = headless; this.slowMo = slowMo;
    this.stateFile = stateFile; this.log = log;
    this.browser = null; this.ctx = null; this.page = null;
  }

  async start() {
    this.browser = this.browserlessWs
      ? await chromium.connectOverCDP(this.browserlessWs)
      : await chromium.launch({ headless: this.headless, slowMo: this.slowMo });
    const opts = {
      acceptDownloads: true,
      viewport: { width: 1366, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    };
    if (this.stateFile && fs.existsSync(this.stateFile)) { opts.storageState = this.stateFile; this.log('[snr] sesión cargada de ' + this.stateFile); }
    this.ctx = this.browserlessWs && this.browser.contexts()[0] && !opts.storageState
      ? this.browser.contexts()[0]
      : await this.browser.newContext(opts);
    // Optimización (recon de red): el flujo útil es 1 endpoint JSF (generate.snr). Todo lo demás
    // —analytics, chat tawk.to, avatar, imágenes/css/fuentes— es ruido. Lo bloqueamos: ~½ de los
    // requests y -30/40% por carga. No tocamos el host del SNR salvo media estática.
    await this.ctx.route('**/*', (route) => {
      const r = route.request();
      const u = r.url();
      const block = /google-analytics|googletagmanager|tawk\.to|doubleclick|ServletGraphicsUser/i.test(u);
      // OJO: NO bloquear 'stylesheet' — PrimeFaces (selectOneMenu/dropdowns) necesita CSS para
      // renderizar/medir los widgets, sin él los clicks fallan. Imágenes/fuentes/media sí.
      const media = ['image', 'media', 'font'].includes(r.resourceType());
      return block || media ? route.abort() : route.continue();
    }).catch(() => {});
    this.page = await this.ctx.newPage();
    return this;
  }

  async stop() { try { await this.browser?.close(); } catch {} }

  async _saveState() { if (this.stateFile) { fs.mkdirSync(path.dirname(this.stateFile), { recursive: true }); await this.ctx.storageState({ path: this.stateFile }); this.log('[snr] sesión guardada'); } }

  // ¿la sesión sigue viva? (puede entrar a generate.snr sin redirección a login)
  async isLoggedIn() {
    const p = this.page;
    await p.goto(URL_GEN, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(800);
    return p.url().includes('generate.snr') && (await p.locator(S.matricula).count().catch(() => 0)) > 0;
  }

  async login() {
    if (!this.user || !this.pass) throw new Error('SnrRobot: faltan credenciales user/pass para login');
    const p = this.page;
    this.log('[snr] login...');
    await p.goto(URL_HOME, { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1200);
    const aviso = p.locator('[id="modalAvisoPago"] button, [id="modalAvisoPago"] .ui-dialog-titlebar-close').first();
    if (await aviso.count()) await aviso.click({ force: true }).catch(() => {});
    await p.waitForTimeout(500);
    await p.evaluate(() => { document.querySelectorAll('.ui-widget-overlay').forEach((o) => o.remove()); const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display = 'none'; }).catch(() => {});
    await p.evaluate(() => { try { PF('dialogLogin').show(); } catch (e) {} }).catch(() => {});
    await p.waitForSelector(S.userLogin, { state: 'visible', timeout: 15000 });
    await p.fill(S.userLogin, this.user);
    await p.fill(S.passLogin, this.pass);
    await p.click(S.btnLogin);
    await p.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const ok = await p.getByText('Certificado Tradicion', { exact: false }).first().count().catch(() => 0);
    if (!ok) {
      // ¿el SNR mostró el bloqueo por "cantidad inusual de ingresos por día"? → código aparte para
      // que el pool marque ESTA cuenta en cooldown y salte a la siguiente (no es un fallo transitorio).
      const bloqueada = await p.getByText(/cantidad inusual de ingresos/i).first().count().catch(() => 0);
      if (bloqueada) throw Object.assign(new Error('cuenta SNR bloqueada (cantidad inusual de ingresos por día)'), { code: 'ACCOUNT_BLOCKED' });
      throw new Error('login falló (no aparece el dashboard)');
    }
    await this._saveState();
    this.log('[snr] login OK');
  }

  async ensureLoggedIn() { if (!(await this.isLoggedIn())) await this.login(); else this.log('[snr] sesión reutilizada'); }

  // Consulta PÚBLICA de disponibilidad — homepage `/certificado`, SIN login (form `formOficinas`).
  // Es lo que usa /verificar: validar antes de pagar NO requiere sesión; solo la generación la requiere.
  // Devuelve { disponible, estado, direccion, circulo, raw }. Lanza si el portal no da resultado reconocible.
  // Reintenta UNA vez internamente (la 1ª consulta sobre una página recién abierta a veces no "prende").
  async consultarPublico(oficina, matricula) {
    for (let i = 1; i <= 2; i++) {
      try { return await this._consultaPublicaOnce(oficina, matricula); }
      catch (e) { if (i === 2) throw e; this.log('[snr] consulta pública reintento: ' + String(e.message).slice(0, 80)); }
    }
  }

  async _consultaPublicaOnce(oficina, matricula) {
    const p = this.page;
    await p.goto(URL_HOME, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(1000);
    await p.evaluate(() => {
      document.querySelectorAll('.ui-widget-overlay,.ui-dialog-mask').forEach((o) => o.remove());
      const a = document.querySelector('[id="modalAvisoPago"]'); if (a) a.style.display = 'none';
    }).catch(() => {});
    // Oficina: abrir el dropdown (teclear es flaky en este autoComplete) y elegir por nombre (sin acentos).
    await p.click(PUB.ofButton, { force: true, timeout: 15000 });
    await p.waitForSelector(PUB.ofPanelLi, { timeout: 12000 });
    const items = await p.locator(PUB.ofPanelLi).evaluateAll((els) => els.map((e) => (e.innerText || '').trim()));
    const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, ' ').trim();
    const target = norm(oficina);
    let idx = items.findIndex((t) => norm(t).endsWith(target));
    if (idx < 0) idx = items.findIndex((t) => norm(t).includes(target));
    if (idx < 0) throw new Error('oficina no encontrada (consulta pública): ' + oficina);
    await p.locator(PUB.ofPanelLi).nth(idx).click({ force: true });
    // esperar a que el AJAX de selección de oficina termine (el input refleja la oficina elegida)
    await p.waitForFunction(() => { const i = document.querySelector('[id="formOficinas:autoCompleteOficinas_input"]'); return !!(i && (i.value || '').trim().length > 2); }, { timeout: 7000 }).catch(() => {});
    await p.waitForTimeout(900);
    await p.evaluate(() => { document.querySelectorAll('.ui-widget-overlay,.ui-dialog-mask').forEach((o) => o.remove()); }).catch(() => {});
    await p.fill(PUB.matricula, String(matricula));
    await p.click(PUB.btnBuscar, { force: true });
    await p.waitForFunction(
      () => /Estado\s+Disponible|Estado\s+No|no se encuentra|no se encontr|no existe|Error de validaci|validaci[oó]n Matricula/i.test((document.body.innerText || '').replace(/\s+/g, ' ')),
      { timeout: 15000 },
    ).catch(() => {});
    await p.waitForTimeout(300);
    const info = await p.evaluate(() => {
      const dlgs = [...document.querySelectorAll('.ui-dialog')].filter((d) => getComputedStyle(d).display !== 'none');
      const dlg = dlgs.find((d) => /Informacion|Matricula|Estado|no se enc/i.test(d.innerText || ''));
      const flat = (dlg?.innerText || document.body.innerText || '').replace(/\s+/g, ' ');
      const between = (a, b) => { const m = flat.match(new RegExp(a + '\\s+(.*?)\\s+' + b, 'i')); return m ? m[1].trim() : null; };
      const em = flat.match(/Estado\s+([A-Za-zÁÉÍÓÚáéíóúÑñ ]+?)\s+(?:Agregar|Cancelar|Pagar|$)/i);
      return { direccion: between('Direccion', 'Circulo'), circulo: between('Circulo', 'Estado'), estado: em ? em[1].trim() : null, raw: flat.slice(0, 500) };
    });
    // SOLO "no encontrada" GENUINO (el SNR dijo claramente que no existe). "Error de validación" / "no es
    // posible generar" / "servicio no disponible" son errores del SISTEMA del SNR (portal lento/caído): NO
    // significan "no existe" → deben LANZAR para que el web haga fail-open y NO bloquee a un cliente real.
    const notFound = /no se encuentra|no se encontr[oó]|no existe|No se ha encontrado|matr[ií]cula no v[aá]lida/i.test(info.raw);
    const snrError = /Error de validaci[oó]n|no es posible generar|error interno|servicio no (est[aá] )?disponible|intente (m[aá]s tarde|nuevamente)|502|503|timeout/i.test(info.raw);
    const hasInfo = /Estado\s+(Disponible|No)/i.test(info.raw) || !!info.estado;
    if (snrError && !hasInfo && !notFound) throw Object.assign(new Error('portal SNR con error, no concluyente: ' + info.raw.slice(0, 120)), { code: 'SNR_ERROR' });
    if (!hasInfo && !notFound) throw new Error('consulta pública sin resultado: ' + info.raw.slice(0, 120));
    info.disponible = !notFound && /disponible/i.test(info.estado || '') && !/no\s*disponible/i.test(info.estado || '');
    if (notFound && !info.estado) info.estado = 'No encontrada';
    this.log(`[snr] consulta pública ${matricula}: estado=${info.estado} disp=${info.disponible}`);
    return info;
  }

  async _selectOficina(oficina) {
    const p = this.page;
    const omId = await p.evaluate((OF) => {
      const d = [...document.querySelectorAll('.ui-selectonemenu')].find((el) => el.id && new RegExp(OF).test(el.innerText));
      return d ? d.id : null;
    }, oficina);
    if (omId) {
      await p.locator(`[id="${omId}"]`).click();
      await p.waitForTimeout(500);
      const item = p.locator(`[id="${omId}_panel"] li`).filter({ hasText: new RegExp('^' + oficina + '$') }).first();
      if (await item.count()) await item.click({ force: true });
      else await p.getByText(oficina, { exact: true }).first().click({ force: true });
    } else {
      const nid = await p.evaluate((OF) => { const s = [...document.querySelectorAll('select')].find((se) => [...se.options].some((o) => new RegExp(OF).test(o.text))); return s ? s.id : null; }, oficina);
      if (!nid) throw new Error('oficina no encontrada: ' + oficina);
      await p.selectOption(`[id="${nid}"]`, { label: oficina });
    }
    await p.waitForTimeout(1200);
  }

  // Consulta una matrícula y devuelve la info del modal (sin agregar al carrito). GRATIS.
  async consultar(oficina, matricula) {
    const p = this.page;
    // domcontentloaded + esperar el input (no 'networkidle', que espera TODA la red = lento)
    if (!p.url().includes('generate.snr')) {
      await p.goto(URL_GEN, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await p.waitForSelector(S.matricula, { timeout: 15000 }).catch(() => {});
    }
    // limpiar cualquier modal/overlay de una consulta previa (sesión reusada): su máscara bloquea los clicks.
    await p.evaluate(() => {
      document.querySelectorAll('.ui-widget-overlay,.ui-dialog-mask').forEach((o) => o.remove());
      document.querySelectorAll('.ui-dialog').forEach((d) => { if (getComputedStyle(d).display !== 'none') d.style.display = 'none'; });
    }).catch(() => {});
    await this._selectOficina(oficina);
    const indice = await p.inputValue(S.indice).catch(() => null);
    await p.fill(S.matricula, String(matricula));
    await p.click(S.btnBuscar);
    // esperar a que el modal se pueble (en vez de sleep fijo de 2.5s)
    await p.waitForFunction(() => {
      const m = document.querySelector('[id="formModalMatriculaCarrito"]');
      const t = (m && m.innerText) || document.body.innerText || '';
      return /Estado|Disponible|no se encuentra|no se encontr|validaci[oó]n Matricula|Error de validaci/i.test(t);
    }, { timeout: 12000 }).catch(() => {});
    await p.waitForTimeout(300);
    const info = await p.evaluate((sel) => {
      const m = document.querySelector(sel);
      const t = (m?.innerText || document.body.innerText || '');
      const grab = (label) => { const re = new RegExp(label + '\\s*\\n?\\s*([^\\n]+)', 'i'); const r = t.match(re); return r ? r[1].trim() : null; };
      return { direccion: grab('Direccion'), circulo: grab('Circulo'), estado: grab('Estado'), raw: t.slice(0, 600) };
    }, S.modalMatricula);
    info.indice = indice;
    info.disponible = /disponible/i.test(info.estado || info.raw || '');
    this.log(`[snr] consulta ${matricula}: estado=${info.estado} indice=${indice}`);
    return info;
  }

  async agregarAlCarrito() {
    const p = this.page;
    // ID real (de la captura de red): formModalCarrito:btnAgregarCarrito
    const btn = p.locator('[id="formModalCarrito:btnAgregarCarrito"]').first();
    if (await btn.count().catch(() => 0)) await btn.click({ force: true });
    else await p.getByRole('button', { name: /Agregar al Carrito/i }).first().click({ force: true });
    await p.waitForTimeout(1500);
    // tras agregar aparece un popup de confirmación que hay que CERRAR para que se habilite "Pagar"
    const cerrar = p.locator('[id="frmClosePopup:closePopupButton"]').first();
    if (await cerrar.count().catch(() => 0)) { await cerrar.click({ force: true }).catch(() => {}); }
    else { const a = p.getByRole('button', { name: /^Aceptar$/ }).first(); if (await a.isVisible().catch(() => false)) await a.click({ force: true }).catch(() => {}); }
    // btnPagar se habilita por AJAX tras cerrar el popup: ESPERAR activamente (no waits fijos, es flaky).
    await p.waitForFunction(() => {
      const b = document.querySelector('[id="formGeneracionCertificados:btnPagar"]');
      return b && !b.disabled && !b.classList.contains('ui-state-disabled');
    }, { timeout: 15000 }).then(() => this.log('[snr] carrito listo, Pagar habilitado'))
      .catch(() => this.log('[snr] ⚠ Pagar no se habilitó en 15s'));
  }

  async limpiarCarrito() { await this.page.click(S.btnLimpiar).catch(() => {}); await this.page.waitForTimeout(1000); }

  // Lee el saldo de la cuenta prepago (para el panel + alerta de saldo bajo). Devuelve COP (number) o null.
  // ponytail: heurística = mayor monto $ visible en la pantalla de Cuenta Prepago. Afinar el selector
  // exacto cuando se confirme el DOM real (ver recon/artifacts/saldo-02-prepago.txt).
  async leerSaldo() {
    const p = this.page;
    const link = p.getByText(/cuenta prepago/i).first();
    if (await link.count().catch(() => 0)) {
      await link.click({ force: true }).catch(() => {});
      await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(2000);
    }
    const txt = await p.evaluate(() => document.body.innerText || '');
    // Anclar en la etiqueta "Saldo Actual (COP)" → el monto $ que le sigue (formato US: $206,000.00).
    const m = txt.match(/Saldo Actual[^$]*\$\s*([\d.,]+)/i);
    if (!m) { this.log('[snr] saldo: no se encontró "Saldo Actual" en la página'); return null; }
    const saldoCOP = Math.round(Number(m[1].replace(/,/g, ''))); // coma=miles, punto=decimal
    if (!Number.isFinite(saldoCOP)) { this.log('[snr] saldo: monto no parseable: ' + m[1]); return null; }
    this.log('[snr] saldo: $' + saldoCOP.toLocaleString('es-CO'));
    return saldoCOP;
  }

  // Descarga un CTL ya generado desde el historial (mecanismo probado). Devuelve Buffer PDF.
  async descargarDesdeHistorial(matricula) {
    const p = this.page;
    await this.ensureLoggedIn(); // el historial requiere sesión; sin login redirige a la página pública
    await p.goto(URL_HIST, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForSelector(S.dlCertLink, { timeout: 15000 });
    // ubicar la fila por matrícula (o el primer link)
    const link = matricula
      ? p.locator('tr', { hasText: String(matricula) }).locator(S.dlCertLink).first()
      : p.locator(S.dlCertLink).first();
    // El link es <a target="_new" href="/certificado/static/fileDispatcher/…pdf"> → PDF DIRECTO que abre en
    // pestaña nueva. Clickearlo NO dispara evento "download" (abre tab). Leemos el href y lo bajamos por HTTP
    // con las cookies de sesión — funciona igual con browserless (navegador remoto).
    const href = await link.getAttribute('href', { timeout: 10000 }).catch(() => null);
    if (!href) throw new Error('no se encontró link de descarga para ' + (matricula || 'primer cert'));
    const url = /^https?:/i.test(href) ? href : BASE + href;
    const cookies = await this.ctx.cookies();
    const res = await fetch(url, { headers: { cookie: cookies.map((c) => c.name + '=' + c.value).join('; '), 'user-agent': 'Mozilla/5.0', referer: URL_HIST } });
    if (!res.ok) throw new Error('descarga HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.slice(0, 5).toString() !== '%PDF-') throw new Error('descarga no es PDF');
    this.log(`[snr] PDF descargado (${buf.length} bytes)`);
    return buf;
  }

  // Flujo completo. dryRun=true se detiene ANTES de Pagar (gratis, validable).
  async generar({ oficina, matricula, dryRun = false }) {
    await this.ensureLoggedIn();
    // (Anti-doble-cobro: ya NO se hace "check history" aquí — era fail-open y frágil. El guardia real es la
    //  idempotencia por referencia en el robot: claimGenerationJob() antes de encolar /generar.)

    // CONSULTAR ANTES DE GENERAR: si no está disponible, no se cobra nada (ni al SNR ni se sigue).
    // Error con code NO_DISPONIBLE → el backend dispara la DEVOLUCIÓN automática al cliente.
    const info = await this.consultar(oficina, matricula);
    if (!info.disponible) throw Object.assign(new Error(`matrícula ${matricula} no disponible: ${info.estado || info.raw}`), { code: 'NO_DISPONIBLE' });
    await this.agregarAlCarrito();

    if (dryRun) { await this.limpiarCarrito(); return { dryRun: true, info }; }

    // ── PASO QUE COBRA SALDO (flujo PROBADO end-to-end con 95200) ──
    const p = this.page;
    // 1) Pagar → diálogo PrimeFaces.confirm → "Sí"
    await p.click(S.btnPagar);
    await p.waitForSelector('.ui-confirmdialog-yes', { timeout: 12000 }).catch(() => {});
    await p.locator('.ui-confirmdialog-yes').first().click({ force: true })
      .catch(async () => { await p.getByRole('button', { name: /^S[ií]$/ }).first().click({ force: true }).catch(() => {}); });
    // 2) payment.snr (Selección de Medios de Pago) → "Cuenta Prepago" (link con title "…prepago…")
    await p.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await p.waitForTimeout(1500);
    await p.locator('a[title*="prepago" i]').first().click({ force: true });
    // 3) Diálogo "Informacion transaccion" (Valor Total) → "Realizar Pago" = COBRA
    await p.waitForSelector('text=/Realizar Pago/i', { timeout: 12000 }).catch(() => {});
    await p.getByRole('button', { name: /Realizar Pago/i }).first().click({ force: true });
    // 4) transaction-result.snr → esperar generación (Estado: Aceptado + PIN/CUS)
    await p.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(6000);
    // Descarga con REINTENTOS: a este punto el SNR YA cobró el saldo y el cert existe en el historial.
    // Si la descarga falla es transitorio → reintentar (NO regenerar, no se vuelve a cobrar). Tras 3
    // intentos, el error deja claro que es "generado pero descarga falló → recuperar del historial".
    let pdf = null;
    for (let i = 1; i <= 3 && !pdf; i++) {
      try { pdf = await this.descargarDesdeHistorial(matricula); }
      catch (e) { this.log(`[snr] descarga intento ${i}/3 falló: ${e.message}`); if (i < 3) await p.waitForTimeout(3000); }
    }
    if (!pdf) throw new Error('cert generado y cobrado pero la descarga del historial falló (recuperar manual del historial, NO regenerar)');
    return { dryRun: false, info, pdf };
  }

  // ── LOTE: varios certificados en UN carrito y UN pago (1 login, 1 pago = mucho menos gasto de logins). ──
  // items: [{ oficina, matricula }]. Acumula cada disponible en el carrito, paga UNA vez el total (N×costo)
  // y descarga cada cert del historial. dryRun=true acumula, LEE el total (sin pagar) y vacía → gratis, validable.
  // peekTotal (solo dryRun): avanza hasta el diálogo "Valor Total" (que muestra lo que se cobraría por N),
  // lo lee y ABANDONA sin "Realizar Pago" (el cobro solo ocurre en ese botón). Da la prueba dura de acumulación.
  async generarLote(items, { dryRun = false, peekTotal = false } = {}) {
    await this.ensureLoggedIn();
    const p = this.page;
    const agregados = [];      // el ítem completo (lleva reference/email/plan del despacho)
    const noDisponibles = [];  // { item, motivo }
    for (const it of items) {
      try {
        const info = await this.consultar(it.oficina, it.matricula);
        if (!info.disponible) { noDisponibles.push({ item: it, motivo: info.estado || (info.raw || '').slice(0, 80) }); this.log(`[lote] ${it.matricula} NO disponible → saltada`); continue; }
        await this.agregarAlCarrito();
        agregados.push(it);
        this.log(`[lote] ${it.matricula} → carrito (${agregados.length} en el carrito)`);
      } catch (e) {
        noDisponibles.push({ item: it, motivo: 'error: ' + String(e.message).split('\n')[0].slice(0, 80) });
        this.log(`[lote] ${it.matricula} error al agregar: ${e.message}`);
      }
    }
    if (agregados.length === 0) return { pagado: false, agregados, noDisponibles, pdfs: [] };

    if (dryRun) {
      let valorTotal = null;
      if (peekTotal) {
        // Avanza hasta ver el "Valor Total" del carrito completo, SIN pagar, y vuelve.
        try {
          await p.click(S.btnPagar);
          await p.waitForSelector('.ui-confirmdialog-yes', { timeout: 12000 }).catch(() => {});
          await p.locator('.ui-confirmdialog-yes').first().click({ force: true }).catch(() => {});
          await p.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
          await p.waitForTimeout(1500);
          await p.locator('a[title*="prepago" i]').first().click({ force: true }).catch(() => {});
          await p.waitForTimeout(2500);
          valorTotal = await p.evaluate(() => {
            const t = document.body.innerText || '';
            const m = t.match(/Valor\s*Total[^\d]*([\d.,]+)/i) || t.match(/Total[^\d]*\$?\s*([\d.,]{4,})/i);
            return m ? m[1] : null;
          }).catch(() => null);
          this.log(`[lote] peek Valor Total (SIN pagar): ${valorTotal}`);
        } catch (e) { this.log(`[lote] peek total falló: ${e.message}`); }
        // ABANDONAR: volver a la pantalla de generación (no se ejecutó "Realizar Pago" → no hay cobro).
        await p.goto(URL_GEN, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      } else {
        await this.limpiarCarrito();
      }
      return { dryRun: true, pagado: false, agregados, noDisponibles, valorTotal, pdfs: [] };
    }

    // ── PASO QUE COBRA (UN pago por los N del carrito) ──
    await p.click(S.btnPagar);
    await p.waitForSelector('.ui-confirmdialog-yes', { timeout: 12000 }).catch(() => {});
    await p.locator('.ui-confirmdialog-yes').first().click({ force: true })
      .catch(async () => { await p.getByRole('button', { name: /^S[ií]$/ }).first().click({ force: true }).catch(() => {}); });
    await p.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await p.waitForTimeout(1500);
    await p.locator('a[title*="prepago" i]').first().click({ force: true });
    await p.waitForSelector('text=/Realizar Pago/i', { timeout: 12000 }).catch(() => {});
    await p.getByRole('button', { name: /Realizar Pago/i }).first().click({ force: true });
    await p.waitForLoadState('networkidle', { timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(6000);

    // Descargar cada cert del historial (con reintentos, sin regenerar).
    const pdfs = [];
    for (const it of agregados) {
      let pdf = null;
      for (let i = 1; i <= 3 && !pdf; i++) {
        try { pdf = await this.descargarDesdeHistorial(it.matricula); }
        catch (e) { this.log(`[lote] descarga ${it.matricula} intento ${i}/3: ${e.message}`); if (i < 3) await p.waitForTimeout(3000); }
      }
      pdfs.push({ item: it, pdf, ok: !!pdf });
    }
    return { pagado: true, agregados, noDisponibles, pdfs };
  }
}
