// Worker del robot SNR. Recibe el disparo del webhook de pago (POST /generar) y genera el CTL
// conectándose a Browserless por CDP (sin Chromium local). Procesa ASÍNCRONO (responde 202 al
// instante) y reporta el resultado al panel (/api/admin/generation) → OK marca DELIVERED;
// NO_DISPONIBLE dispara la devolución automática; otro error queda FAILED + alerta.
import http from 'http';
import { SnrRobot } from './snr-robot.mjs';
import { entregarCorreo, enviarAlerta } from './deliver.mjs';
import { consultaHttp } from './snr-consulta-http.mjs';
import { pickAccount, marcarBloqueada, totalCuentas, estado as estadoCuentas, setSaldo, descontarCert, saldoConocido, debeAlertar, certsRestantes } from './snr-accounts.mjs';

const PORT = Number(process.env.PORT || 3000);
const SECRET = process.env.N8N_WEBHOOK_SECRET || '';
const PANEL = (process.env.PANEL_BASE_URL || '').replace(/\/$/, '');
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

// Una generación con una cuenta ya elegida. Lanza si falla (el caller decide fallback/no según el código).
async function generarConCuenta(robot, cuenta, { reference, oficina, matricula, email, plan }) {
  const r = await robot.generar({ oficina, matricula }); // ensureLoggedIn() adentro REUSA la sesión
  await reportPanel({ reference, matricula, oficina, status: 'OK', costCents: COST_CENTS });
  console.error(`[robot] ✅ ${matricula} generado (${r.pdf?.length || 0} bytes) [cuenta ${cuenta}]`);
  // Guardar el PDF en el panel para poder reenviarlo por WhatsApp sin re-loguear al SNR (best-effort).
  try {
    if (PANEL && SECRET && r.pdf) await fetch(`${PANEL}/api/admin/cert`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET }, body: JSON.stringify({ reference, pdfBase64: r.pdf.toString('base64') }) });
  } catch (pe) { console.error('[robot] guardar PDF (WhatsApp) falló: ' + pe.message); }
    // EXPRESS: Estudio de Títulos (best-effort — el CTL YA está reportado/entregado; si esto falla, el CTL igual sale).
    let estudioPdf = null;
    if (plan === 'express') {
      try {
        const { generarEstudio } = await import('./estudio.mjs');
        const { renderEstudioPdf } = await import('./estudio-pdf.mjs');
        const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
        const data = await generarEstudio(r.pdf, { matricula, oficina });
        // Add-ons Express (best-effort cada uno; si uno falla, el resto + el estudio igual salen).
        try { const { chequearAlertas } = await import('./alertas.mjs'); data.alertas = await chequearAlertas(data.propietarios); }
        catch (ae) { console.error(`[alertas] ✕ ${matricula}: ${ae.message}`); }
        try { const { estimarAvaluo } = await import('./avaluo.mjs'); data.avaluo = estimarAvaluo({ area: data.inmueble?.area, ciudad: oficina }); }
        catch (ve) { console.error(`[avaluo] ✕ ${matricula}: ${ve.message}`); }
        estudioPdf = await renderEstudioPdf(data, { matricula, oficina, fecha });
        console.error(`[estudio] ✅ ${matricula} (${estudioPdf.length} bytes, semáforo ${data.semaforo}, alertas ${data.alertas?.coincidencias?.length ?? '-'}, avaluo ${data.avaluo?.disponible ? 'sí' : 'no'})`);
      } catch (ee) {
        // Best-effort: NO re-reportar como generación (duplicaría la bitácora). Solo alerta "estudio pendiente".
        console.error(`[estudio] ✕ ${matricula}: ${ee.message}`);
        await reportPanel({ reference, matricula, oficina, estudioFailed: true, error: String(ee.message || ee).slice(0, 200) }).catch(() => {});
      }
    }
    // ENTREGA por correo (best-effort: el cert ya está generado+pagado; si el correo falla se loguea)
    try {
      const d = await entregarCorreo({ pdf: r.pdf, matricula, oficina, email, reference, estudio: estudioPdf });
      console.error(`[robot] correo ${matricula}: ${d.sent ? 'ENVIADO a ' + email + (d.withPreview ? ' (con preview)' : '') : 'NO enviado (' + d.reason + ')'}`);
    } catch (de) {
      console.error(`[robot] ⚠ correo ${matricula} FALLÓ (cert OK, reenviar manual): ${de.message}`);
      await enviarAlerta('🟠 Correo del certificado falló', `El CTL de la matrícula ${matricula} (${oficina}) SE GENERÓ pero el correo a ${email} falló: ${de.message}\nReenviar manual. El cliente igual puede pedirlo por WhatsApp.`).catch(() => {});
    }
    // SALDO: leer 1× por sesión (anclado en "Saldo Actual", confiable) y descontar local por cert.
    // Alerta por correo al admin la 1ª vez que cae bajo el umbral (rearmable). Best-effort.
    try {
      const UMBRAL = Number(process.env.SNR_ALERTA_CERTS || 5);
      if (!saldoConocido(cuenta)) { const cop = await robot.leerSaldo(); if (cop != null) setSaldo(cuenta, cop * 100); }
      else descontarCert(cuenta);
      if (debeAlertar(cuenta, UMBRAL)) {
        const n = certsRestantes(cuenta);
        console.error(`[saldo] ⚠ ALERTA: cuenta ${cuenta} con saldo para ~${n} certificado(s)`);
        await enviarAlerta(`⚠ Saldo bajo SNR (${cuenta})`, `La cuenta SNR ${cuenta} tiene saldo para ~${n} certificado(s). Recárgala en el portal del SNR para no interrumpir el servicio.\n\n— Sistema Certitradición`).catch(() => {});
      }
    } catch (se) { console.error('[saldo] lectura/alerta falló (no crítico): ' + se.message); }
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

const server = http.createServer((req, res) => {
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
    req.on('end', () => {
      let p;
      try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('JSON inválido'); }
      if (!p.oficina || !p.matricula) { res.writeHead(400); return res.end('faltan oficina/matricula'); }
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
});
