// Worker del robot SNR. Recibe el disparo del webhook de pago (POST /generar) y genera el CTL
// conectándose a Browserless por CDP (sin Chromium local). Procesa ASÍNCRONO (responde 202 al
// instante) y reporta el resultado al panel (/api/admin/generation) → OK marca DELIVERED;
// NO_DISPONIBLE dispara la devolución automática; otro error queda FAILED + alerta.
import http from 'http';
import { SnrRobot } from './snr-robot.mjs';
import { entregarCorreo, entregarEstudio, enviarAlerta } from './deliver.mjs';
import { consultaHttp } from './snr-consulta-http.mjs';
import { pickAccount, marcarBloqueada, totalCuentas, estado as estadoCuentas, setSaldo, descontarCert, saldoConocido, saldoCents, debeAlertar, certsRestantes } from './snr-accounts.mjs';

const PORT = Number(process.env.PORT || 3000);
const SECRET = process.env.N8N_WEBHOOK_SECRET || '';
const PANEL = 'https://certitradicion.com';
const COST_CENTS = Number(process.env.SNR_COST_COP || 23000) * 100;
const BROWSERLESS_WS = process.env.BROWSERLESS_WS || '';

async function reportPanel(body) {
  if (!PANEL || !SECRET) { console.error('[robot] sin PANEL/SECRET, no reporto'); return; }
  await fetch(`${PANEL}/api/admin/generation`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET },
    body: JSON.stringify(body),
  }).then((r) => console.error('[robot] reporte panel', r.status)).catch((e) => console.error('[robot] reporte falló', e.message));
}

// Robot de GENERACIÓN PERSISTENTE: reusa la sesión SNR logueada entre ventas. ensureLoggedIn() (adentro
// de robot.generar()) solo re-loguea si la sesión murió. Así 50 certificados/día ≈ 1 login por vida del
// proceso (+ re-login si la sesión expira por inactividad), NO 50 logins/día → no quema la cuenta.
// Las generaciones se SERIALIZAN (genChain): comparten una sola página, una a la vez (a 50/día no hay cola).
// Browserless soporta 5 sesiones concurrentes, así que esto convive con el robot de validación (sin login).
let genRobot = null;
let genAccount = null; // cuenta SNR activa del genRobot (del pool snr-accounts)
let genChain = Promise.resolve();

async function ensureGenRobot() {
  // Reusar la sesión SOLO si sigue viva Y su cuenta sigue siendo la preferida del pool (no bloqueada/sin saldo).
  if (genRobot && genRobot.browser?.isConnected() && genAccount && pickAccount()?.user === genAccount.user) return genRobot;
  if (genRobot) await resetGenRobot(); // sesión muerta o toca cambiar de cuenta → recrear
  const acc = pickAccount();
  if (!acc) throw Object.assign(new Error('sin cuentas SNR usables (todas bloqueadas o sin saldo)'), { code: 'NO_ACCOUNTS' });
  genAccount = acc;
  const r = new SnrRobot({
    user: acc.user, pass: acc.pass,
    browserlessWs: BROWSERLESS_WS || null, headless: true, stateFile: null, log: (m) => console.error(m),
  });
  await r.start();
  genRobot = r;
  console.error(`[robot] genRobot usando cuenta ${acc.user} (${totalCuentas()} en pool)`);
  return r;
}
async function resetGenRobot() { try { await genRobot?.stop(); } catch {} genRobot = null; genAccount = null; }

function generar(job) {
  genChain = genChain.catch(() => {}).then(() => generarOne(job));
  return genChain;
}

async function generarOne(job) {
  const { reference, oficina, matricula, email, plan } = job;
  // BYPASS DE PRUEBA (gated por x-webhook-secret): si viene un PDF de prueba, NO tocamos el SNR ni el saldo —
  // corremos el estudio + los 2 correos sobre ESE PDF. Para probar el flujo Express sin gastar un CTL real.
  if (job.testPdfBase64) return entregarSobrePdf(Buffer.from(job.testPdfBase64, 'base64'), job);
  // Loop de FALLBACK por cuenta: si la cuenta activa se BLOQUEA, salta a otra. Acotado por nº de cuentas
  // (cada cuenta se intenta como máximo una vez). Los demás errores NO reintentan (igual que antes).
  for (let intentoCuenta = 0; ; intentoCuenta++) {
    let robot, cuenta;
    try {
      robot = await ensureGenRobot();
      cuenta = genAccount?.user;
    } catch (e) {
      // CUALQUIER error al arrancar el robot (Browserless caído, etc.) → FAILED + alerta. NUNCA dejar
      // que escape en silencio: el cliente pagó y la orden quedaría colgada en GENERATING para siempre.
      const msg = e.code === 'NO_ACCOUNTS'
        ? 'sin cuentas SNR disponibles (todas bloqueadas o sin saldo) — recargar o agregar cuenta'
        : `no se pudo iniciar el robot (¿Browserless caído?): ${String(e.message || e).slice(0, 200)}`;
      console.error(`[robot] ✕ ${matricula}: ${msg}`);
      await reportPanel({ reference, matricula, oficina, status: 'FAILED', errorCode: 'ERROR', error: msg }).catch(() => {});
      await enviarAlerta('🔴 Robot no pudo arrancar', `Pedido ${reference} (matrícula ${matricula}, ${oficina}): ${msg}\nEl cliente PAGÓ — gestionar reintento o devolución.`).catch(() => {});
      return;
    }
    try {
      return await generarConCuenta(robot, cuenta, job);
    } catch (e) {
      // BLOQUEO de cuenta → marcar en cooldown y reintentar con la siguiente cuenta usable.
      if (e.code === 'ACCOUNT_BLOCKED' && cuenta && intentoCuenta < totalCuentas()) {
        marcarBloqueada(cuenta);
        console.error(`[robot] cuenta ${cuenta} BLOQUEADA (cantidad inusual de ingresos) → fallback a otra cuenta`);
        await resetGenRobot();
        if (pickAccount()) continue; // hay otra cuenta usable → reintenta con ella
        await reportPanel({ reference, matricula, oficina, status: 'FAILED', errorCode: 'ERROR', error: 'todas las cuentas SNR bloqueadas hoy — recargar o agregar cuenta' });
        return;
      }
      // Otros errores: comportamiento de siempre (NO_DISPONIBLE no resetea; otro sí).
      const errorCode = e.code === 'NO_DISPONIBLE' ? 'NO_DISPONIBLE' : 'ERROR';
      await reportPanel({ reference, matricula, oficina, status: 'FAILED', errorCode, error: String(e.message || e).slice(0, 300) });
      console.error(`[robot] ✕ ${matricula} ${errorCode}: ${e.message} [cuenta ${cuenta}]`);
      if (errorCode !== 'NO_DISPONIBLE') await resetGenRobot();
      return;
    }
  }
}

// Planes que llevan Estudio de Títulos. 'avanzado' agrega la verificación de antecedentes.
const ESTUDIO_PLANS = new Set(['express', 'avanzado']);

// Construye el PDF del Estudio de Títulos (express y avanzado). Cada add-on es best-effort: si uno
// falla, el estudio igual sale. 'avanzado' agrega la verificación de antecedentes de los propietarios.
async function construirEstudioPdf(pdf, { matricula, oficina, plan }) {
  const { generarEstudio } = await import('./estudio.mjs');
  const { renderEstudioPdf } = await import('./estudio-pdf.mjs');
  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const data = await generarEstudio(pdf, { matricula, oficina });
  try { const { chequearAlertas } = await import('./alertas.mjs'); data.alertas = await chequearAlertas(data.propietarios); }
  catch (ae) { console.error(`[alertas] ✕ ${matricula}: ${ae.message}`); }
  try { const { estimarAvaluo } = await import('./avaluo.mjs'); data.avaluo = estimarAvaluo({ area: data.inmueble?.area, ciudad: oficina }); }
  catch (ve) { console.error(`[avaluo] ✕ ${matricula}: ${ve.message}`); }
  if (plan === 'avanzado') {
    try { const { verificarAntecedentes } = await import('./antecedentes.mjs'); data.antecedentes = await verificarAntecedentes(data.propietarios); }
    catch (ne) { console.error(`[antecedentes] ✕ ${matricula}: ${ne.message}`); data.antecedentes = { ok: false, motivo: ne.message }; }
  }
  const estudioPdf = await renderEstudioPdf(data, { matricula, oficina, fecha });
  return { data, estudioPdf };
}

// Una generación con una cuenta ya elegida. Lanza si falla (el caller decide fallback/no según el código).
async function generarConCuenta(robot, cuenta, { reference, oficina, matricula, email, plan }) {
  const r = await robot.generar({ oficina, matricula }); // ensureLoggedIn() adentro REUSA la sesión
  await reportPanel({ reference, matricula, oficina, status: 'OK', costCents: COST_CENTS });
  console.error(`[robot] ✅ ${matricula} generado (${r.pdf?.length || 0} bytes) [cuenta ${cuenta}]`);
  // Guardar el PDF en el panel para poder reenviarlo por WhatsApp sin re-loguear al SNR (best-effort).
  try {
    if (PANEL && SECRET && r.pdf) await fetch(`${PANEL}/api/admin/cert`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ reference, pdfBase64: r.pdf.toString('base64') }) });
  } catch (pe) { console.error('[robot] guardar PDF (WhatsApp) falló: ' + pe.message); }
    // ENTREGA del CTL de INMEDIATO (correo 1). DESACOPLE: no esperamos al Estudio (que puede tardar minutos por
    // la cola de NIM); el cliente recibe su certificado ya. Best-effort: el cert ya está generado+pagado.
    try {
      const d = await entregarCorreo({ pdf: r.pdf, matricula, oficina, email, reference });
      console.error(`[robot] correo CTL ${matricula}: ${d.sent ? 'ENVIADO a ' + email + (d.withPreview ? ' (con preview)' : '') : 'NO enviado (' + d.reason + ')'}`);
    } catch (de) {
      console.error(`[robot] ⚠ correo CTL ${matricula} FALLÓ (cert OK, reenviar manual): ${de.message}`);
      await enviarAlerta('🟠 Correo del certificado falló', `El CTL de la matrícula ${matricula} (${oficina}) SE GENERÓ pero el correo a ${email} falló: ${de.message}\nReenviar manual. El cliente igual puede pedirlo por WhatsApp.`).catch(() => {});
    }
    // SALDO: leer 1× por sesión (usa la sesión del robot; rápido, va ANTES del Estudio). Best-effort.
    try {
      const UMBRAL = Number(process.env.SNR_ALERTA_CERTS || 5);
      if (!saldoConocido(cuenta)) { const cop = await robot.leerSaldo(); if (cop != null) setSaldo(cuenta, cop * 100); }
      else descontarCert(cuenta);
      // Publicar el saldo REAL actual al panel (card agregado + estado por cuenta) tras cada generación.
      const cents = saldoCents(cuenta);
      if (cents != null) pushSaldo(cents);
      pushSnrStatus();
      if (debeAlertar(cuenta, UMBRAL)) {
        const n = certsRestantes(cuenta);
        console.error(`[saldo] ⚠ ALERTA: cuenta ${cuenta} con saldo para ~${n} certificado(s)`);
        await enviarAlerta(`⚠ Saldo bajo SNR (${cuenta})`, `La cuenta SNR ${cuenta} tiene saldo para ~${n} certificado(s). Recárgala en el portal del SNR para no interrumpir el servicio.\n\n— Sistema Certitradición`).catch(() => {});
      }
    } catch (se) { console.error('[saldo] lectura/alerta falló (no crítico): ' + se.message); }
    // EXPRESS: el Estudio de Títulos se genera DESPUÉS (el CTL ya salió) y se entrega en un 2º correo aparte.
    // Best-effort: si falla, el CTL ya llegó igual y se alerta para reenvío manual.
    if (ESTUDIO_PLANS.has(plan)) {
      try {
        const { data, estudioPdf } = await construirEstudioPdf(r.pdf, { matricula, oficina, plan });
        console.error(`[estudio] ✅ ${matricula} (${estudioPdf.length} bytes, semáforo ${data.semaforo}, concepto ${data.concepto?.estado ?? '-'}${plan === 'avanzado' ? `, antecedentes ${data.antecedentes?.ok ? data.antecedentes.resultados.length + ' persona(s)' : 'n/d'}` : ''})`);
        // Guardar el Estudio para poder reenviarlo por WhatsApp (manda AMBOS PDFs por el chat). Best-effort.
        try {
          if (PANEL && SECRET) await fetch(`${PANEL}/api/admin/cert`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ reference, estudioBase64: estudioPdf.toString('base64') }) });
        } catch (pe) { console.error('[estudio] guardar PDF (WhatsApp) falló: ' + pe.message); }
        const de2 = await entregarEstudio({ estudio: estudioPdf, matricula, oficina, email });
        console.error(`[estudio] correo 2 ${matricula}: ${de2.sent ? 'ENVIADO a ' + email : 'NO enviado (' + de2.reason + ')'}`);
      } catch (ee) {
        // El CTL YA se entregó. NO re-reportar como generación (duplica bitácora). Alerta para reenvío manual.
        console.error(`[estudio] ✕ ${matricula}: ${ee.message}`);
        await reportPanel({ reference, matricula, oficina, estudioFailed: true, error: String(ee.message || ee).slice(0, 200) }).catch(() => {});
        await enviarAlerta('🟠 Estudio pendiente (reenviar manual)', `El CTL de ${matricula} (${oficina}) YA se entregó a ${email}, pero el Estudio de Títulos falló: ${ee.message}\nGenerar/reenviar el Estudio manual.`).catch(() => {});
      }
    }
}

// BYPASS DE PRUEBA: corre el estudio + los 2 correos sobre un PDF dado, SIN SNR ni saldo. Best-effort.
async function entregarSobrePdf(pdf, { reference, oficina, matricula, email, plan }) {
  console.error(`[TEST] entrega de prueba sobre PDF (${pdf.length} bytes) · ${matricula} · plan ${plan} → ${email}`);
  try {
    const d = await entregarCorreo({ pdf, matricula, oficina, email, reference });
    console.error(`[TEST] correo CTL: ${d.sent ? 'ENVIADO a ' + email + (d.withPreview ? ' (con preview)' : '') : 'NO (' + d.reason + ')'}`);
  } catch (de) { console.error(`[TEST] correo CTL FALLÓ: ${de.message}`); }
  if (ESTUDIO_PLANS.has(plan)) {
    try {
      const { data, estudioPdf } = await construirEstudioPdf(pdf, { matricula, oficina, plan });
      console.error(`[TEST] estudio OK (${estudioPdf.length} bytes, semáforo ${data.semaforo}, concepto ${data.concepto?.estado ?? '-'}${plan === 'avanzado' ? `, antecedentes ${data.antecedentes?.ok ? data.antecedentes.resultados.length : 'n/d'}` : ''})`);
      const de2 = await entregarEstudio({ estudio: estudioPdf, matricula, oficina, email });
      console.error(`[TEST] correo Estudio: ${de2.sent ? 'ENVIADO a ' + email : 'NO (' + de2.reason + ')'}`);
    } catch (ee) { console.error(`[TEST] estudio FALLÓ: ${ee.message}`); }
  }
}

// ── DESPACHO POR LOTE (panel admin): N certificados en UN carrito y UN pago (generarLote), luego entrega
//    cada uno (CTL + estudio/antecedentes según plan). Serializado por genChain (comparte la página SNR).
function procesarLote(items) {
  genChain = genChain.catch(() => {}).then(() => procesarLoteOne(items));
  return genChain;
}
async function procesarLoteOne(items) {
  // Idempotencia por referencia: solo procesa las que ESTE proceso reclame (un ref se cobra 1 vez).
  const claimados = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!it || !/^\d{2,10}$/.test(String(it.matricula || '')) || typeof it.oficina !== 'string' || !it.oficina) continue;
    try { if (await claimGenerationJob(it.reference)) claimados.push(it); }
    catch (e) { console.error('[lote] claim falló ' + it.reference + ': ' + e.message); }
  }
  if (!claimados.length) { console.error('[lote] nada que procesar (todo reclamado o inválido)'); return; }
  console.error(`[lote] procesando ${claimados.length} pedido(s) en un carrito`);

  let robot, cuenta, res;
  try {
    robot = await ensureGenRobot();
    cuenta = genAccount?.user;
    res = await robot.generarLote(claimados);
  } catch (e) {
    console.error('[lote] generarLote falló: ' + e.message);
    for (const it of claimados) await reportPanel({ reference: it.reference, matricula: it.matricula, oficina: it.oficina, status: 'FAILED', errorCode: 'ERROR', error: 'lote: ' + String(e.message).slice(0, 150) }).catch(() => {});
    await enviarAlerta('🔴 Lote de despacho falló', `El lote de ${claimados.length} pedido(s) falló antes/durante el pago: ${e.message}`).catch(() => {});
    return;
  }

  // No disponibles → FAILED (no se cobraron; se saltaron del carrito).
  for (const nd of (res.noDisponibles || [])) {
    await reportPanel({ reference: nd.item.reference, matricula: nd.item.matricula, oficina: nd.item.oficina, status: 'FAILED', errorCode: 'NO_DISPONIBLE', error: 'no disponible: ' + nd.motivo }).catch(() => {});
  }

  const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  for (const { item, pdf, ok } of (res.pdfs || [])) {
    const { reference, matricula, oficina, email, plan } = item;
    if (!ok || !pdf) {
      await reportPanel({ reference, matricula, oficina, status: 'FAILED', errorCode: 'ERROR', error: 'generado y cobrado, descarga del historial falló (recuperar manual, NO regenerar)' }).catch(() => {});
      await enviarAlerta('🟠 Cert cobrado sin descargar (lote)', `El CTL de ${matricula} (${oficina}) se generó y cobró en el lote, pero la descarga falló. Recuperar manual del historial, NO regenerar.`).catch(() => {});
      continue;
    }
    try {
      await reportPanel({ reference, matricula, oficina, status: 'OK', costCents: COST_CENTS });
      try { if (PANEL && SECRET) await fetch(`${PANEL}/api/admin/cert`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ reference, pdfBase64: pdf.toString('base64') }) }); } catch (pe) { console.error('[lote] guardar PDF: ' + pe.message); }
      try { const d = await entregarCorreo({ pdf, matricula, oficina, email, reference }); console.error(`[lote] correo CTL ${matricula}: ${d.sent ? 'ENVIADO a ' + email : 'NO (' + d.reason + ')'}`); }
      catch (de) { console.error(`[lote] correo CTL ${matricula} FALLÓ: ${de.message}`); await enviarAlerta('🟠 Correo CTL falló (lote)', `El CTL de ${matricula} se generó pero el correo a ${email} falló. Reenviar manual.`).catch(() => {}); }
      if (cuenta) { try { if (!saldoConocido(cuenta)) { const cop = await robot.leerSaldo(); if (cop != null) setSaldo(cuenta, cop * 100); } else descontarCert(cuenta); } catch {} }
      if (ESTUDIO_PLANS.has(plan)) {
        try {
          const { data, estudioPdf } = await construirEstudioPdf(pdf, { matricula, oficina, plan });
          try { if (PANEL && SECRET) await fetch(`${PANEL}/api/admin/cert`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ reference, estudioBase64: estudioPdf.toString('base64') }) }); } catch {}
          const de2 = await entregarEstudio({ estudio: estudioPdf, matricula, oficina, email });
          console.error(`[lote] estudio ${matricula}: ${de2.sent ? 'ENVIADO' : 'NO'} · concepto ${data.concepto?.estado ?? '-'}`);
        } catch (ee) { console.error(`[lote] estudio ${matricula} FALLÓ: ${ee.message}`); await enviarAlerta('🟠 Estudio pendiente (lote)', `El CTL de ${matricula} se entregó a ${email} pero el Estudio falló: ${ee.message}. Reenviar manual.`).catch(() => {}); }
      }
    } catch (e) { console.error(`[lote] entrega ${matricula} error: ${e.message}`); }
  }
  try { const cents = cuenta ? saldoCents(cuenta) : null; if (cents != null) pushSaldo(cents); pushSnrStatus(); } catch {}
  console.error(`[lote] LISTO: ${res.pdfs?.filter((x) => x.ok).length ?? 0} entregados, ${res.noDisponibles?.length ?? 0} no disponibles`);
}

// ── VERIFICAR (rápido): CONSULTA PÚBLICA (sin login) con navegador persistente reusado entre consultas.
//    Serializado con un mutex (comparten una sola página). NO loguea: validar disponibilidad es público
//    (form `formOficinas` del homepage) → no quema logins ni se ve afectado por bloqueos de la cuenta.
let verifyRobot = null;
let chain = Promise.resolve();

async function ensureVerifyRobot() {
  if (verifyRobot) return verifyRobot;
  // Sin credenciales: la consulta pública no requiere sesión.
  const r = new SnrRobot({ browserlessWs: BROWSERLESS_WS || null, headless: true, stateFile: null, log: (m) => console.error(m) });
  await r.start();
  verifyRobot = r;
  console.error('[verify] navegador listo (consulta pública, SIN login)');
  return r;
}
async function resetVerifyRobot() {
  try { await verifyRobot?.stop(); } catch {}
  verifyRobot = null;
}

// Mantener la sesión SNR VIVA (expira a 15 min de inactividad). Navega a generate.snr; si la sesión
// murió, resetea para que la próxima verificación re-loguee. Así el cliente casi nunca pega el cold (~18s).
async function keepAlive() {
  try {
    if (!verifyRobot) { await ensureVerifyRobot(); return; } // re-calentar si no hay navegador
    const p = verifyRobot.page;
    await p.goto('https://certificados.supernotariado.gov.co/certificado', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const alive = (await p.locator('[id="formOficinas:inpMatricula"]').count().catch(() => 0)) > 0;
    if (alive) { console.error('[verify] heartbeat OK'); return; }
    console.error('[verify] heartbeat: navegador murió, re-calentando');
    await resetVerifyRobot();
    await ensureVerifyRobot();
  } catch (e) {
    console.error('[verify] heartbeat error, re-calentando: ' + e.message);
    await resetVerifyRobot();
    try { await ensureVerifyRobot(); } catch (e2) { console.error('[verify] re-warm falló: ' + e2.message); }
  }
}

// Fallback con NAVEGADOR (consulta pública Playwright): serializado sobre la página compartida del verifyRobot.
function browserVerify(oficina, matricula) {
  const run = chain.then(async () => {
    try {
      const r = await ensureVerifyRobot();
      return await r.consultarPublico(oficina, matricula);
    } catch (e) {
      console.error('[verify] reintento navegador tras error: ' + e.message);
      await resetVerifyRobot();
      const r = await ensureVerifyRobot();
      return await r.consultarPublico(oficina, matricula);
    }
  });
  chain = run.catch(() => {});
  return run;
}

async function doVerify(oficina, matricula) {
  // 1) RÁPIDO: HTTP directo (sin navegador, ~0.5s, en PARALELO). Si falla por lo que sea → fallback navegador.
  try { return await consultaHttp(oficina, matricula); }
  catch (e) { console.error('[verify] HTTP falló (' + e.message + ') → fallback navegador'); }
  // 2) Fallback: consulta pública con navegador (más lenta pero adaptable a cambios del portal).
  return browserVerify(oficina, matricula);
}

import { handleDbProxy, claimGenerationJob } from './db-proxy.mjs';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/orders') {
    if (!SECRET || req.headers['x-webhook-secret'] !== SECRET) { res.writeHead(401); return res.end('no autorizado'); }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => handleDbProxy(req, res, body));
    return;
  }
  if (req.method === 'POST' && req.url === '/verificar') {
    if (!SECRET || req.headers['x-webhook-secret'] !== SECRET) { res.writeHead(401); return res.end('no autorizado'); }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', async () => {
      let p;
      try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('JSON inválido'); }
      const oficina = String(p.oficina || ''), matricula = String(p.matricula || '').toUpperCase();
      if (!oficina || !matricula) { res.writeHead(400); return res.end('faltan oficina/matricula'); }
      try {
        const info = await doVerify(oficina, matricula);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ oficina, matricula, disponible: !!info.disponible, estado: info.estado, direccion: info.direccion, circulo: info.circulo }));
      } catch (e) {
        console.error('[verify] error final: ' + e.message);
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'verify failed' }));
      }
    });
    return;
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, browserless: !!BROWSERLESS_WS }));
  }
  // Estado del pool de cuentas SNR (cuál está activa, disponibilidad, saldo conocido por cuenta).
  if (req.method === 'GET' && req.url === '/cuentas') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ total: totalCuentas(), activa: genAccount?.user || null, cuentas: estadoCuentas() }));
  }
  if (req.method === 'POST' && req.url === '/generar') {
    if (!SECRET || req.headers['x-webhook-secret'] !== SECRET) { res.writeHead(401); return res.end('no autorizado'); }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', async () => {
      let p;
      try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('JSON inválido'); }
      // LOTE (despacho admin): si viene un array `items`, se procesa con generarLote (UN carrito, UN pago
      // para todos). Cada ítem lleva { reference, matricula, oficina, email, phone, plan }.
      if (Array.isArray(p.items)) {
        res.writeHead(202, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true, accepted: true, lote: p.items.length }));
        procesarLote(p.items).catch((e) => console.error('[robot] procesarLote throw', e));
        return;
      }
      // Validación de FRONTERA (defensa en profundidad): estos valores fluyen al HTML de los correos,
      // a nombres de archivo y al robot SNR. El checkout ya valida, pero /generar no debe confiar en eso.
      if (!/^\d{2,10}$/.test(String(p.matricula || ''))) { res.writeHead(400); return res.end('matricula inválida'); }
      if (typeof p.oficina !== 'string' || !p.oficina || p.oficina.length > 60 || /[<>&"']/.test(p.oficina)) { res.writeHead(400); return res.end('oficina inválida'); }
      // IDEMPOTENCIA POR REFERENCIA — el guardia decisivo: una referencia se cobra UNA sola vez.
      // Aunque le peguen N veces a /generar (webhook, reintento de Wompi, wiring viejo), solo el 1º cobra.
      // fail-CLOSED: si falla el claim o no hay referencia, NO se genera (mejor no cobrar que cobrar doble).
      let claimed;
      try { claimed = await claimGenerationJob(p.reference); }
      catch (e) { console.error('[robot] claim idempotencia falló: ' + e.message); res.writeHead(503, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'claim falló, no se generó' })); }
      if (!claimed) {
        console.error(`[robot] /generar DEDUP: referencia "${p.reference || '(sin ref)'}" ya reclamada o sin referencia → NO se cobra`);
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, dedup: true, reference: p.reference || null }));
      }
      // responder YA; generar en segundo plano
      res.writeHead(202, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, accepted: true, matricula: p.matricula }));
      generar(p).catch((e) => console.error('[robot] generar throw', e));
    });
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, () => {
  console.error('[robot] worker escuchando en :' + PORT + ' (browserless=' + !!BROWSERLESS_WS + ')');
  // calentar el navegador al arrancar (SIN login) → el primer cliente NO paga el cold de Browserless
  chain = chain.then(() => ensureVerifyRobot()).catch((e) => console.error('[verify] warm-boot falló: ' + e.message));
  // heartbeat cada 5 min: mantiene vivo el navegador/Browserless (consulta pública, sin login)
  setInterval(() => { chain = chain.then(keepAlive).catch(() => {}); }, 5 * 60 * 1000);
  // barredora cada 10 min: pide al panel detectar+alertar órdenes pagadas atascadas (red de seguridad final).
  if (PANEL && SECRET) setInterval(() => {
    fetch(`${PANEL}/api/admin/reaper`, { method: 'POST', headers: { 'x-webhook-secret': SECRET } })
      .then((r) => { if (!r.ok) console.error('[reaper] HTTP ' + r.status); })
      .catch((e) => console.error('[reaper] ' + e.message));
  }, 10 * 60 * 1000);
  // Estado del pool de cuentas SNR → panel (Vercel no alcanza al robot; se lo empujamos). Al arranque y c/10 min.
  if (PANEL && SECRET) {
    pushSnrStatus();
    setInterval(pushSnrStatus, 10 * 60 * 1000);
  }
});

function pushSnrStatus() {
  const body = JSON.stringify({ total: totalCuentas(), activa: genAccount?.user || null, cuentas: estadoCuentas() });
  fetch(`${PANEL}/api/admin/snr-status`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body })
    .then((r) => { if (!r.ok) console.error('[snr-status] HTTP ' + r.status); })
    .catch((e) => console.error('[snr-status] ' + e.message));
}
// Publica el saldo (centavos COP) al card agregado del panel (saldo_snapshots). Best-effort.
function pushSaldo(cents) {
  if (!(PANEL && SECRET) || !Number.isFinite(cents)) return;
  fetch(`${PANEL}/api/admin/saldo`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ saldoCents: cents }) })
    .then((r) => { if (!r.ok) console.error('[saldo] push HTTP ' + r.status); })
    .catch((e) => console.error('[saldo] push ' + e.message));
}
