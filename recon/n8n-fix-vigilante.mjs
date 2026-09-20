// Republica el vigilante de verificación (n8n ov2wvhH8Tym6U5kA) para que pruebe TRES matrículas
// y solo declare la caída si fallan LAS TRES.
//
// Por qué: el 2026-09-19 el vigilante mandó 29 correos "🔴 NADIE puede comprar" durante 31 horas
// con el sitio perfectamente vivo. Sondeaba UN solo folio (MARINILLA 19471) y ese folio empezó a
// devolver el modal ambiguo del SNR ("fue encontrada… sin dirección", Estado No Disponible), que
// el guardia del 2026-09-06 bloquea a propósito (SNR_SIN_VALIDAR → 502). Un folio suelto NO es
// una caída: en una muestra de 10 matrículas reales, 8 validaban bien.
//
// La sonda CORTA AL PRIMER ÉXITO: en el día bueno hace la misma única consulta de siempre y solo
// escala a la segunda y la tercera cuando la anterior falla. Así no se triplica la carga sobre el
// portal del SNR ni sobre la cola serial del robot.
//
//   node recon/n8n-fix-vigilante.mjs            (aplica)
//   node recon/n8n-fix-vigilante.mjs --dry      (solo muestra lo que haría)
//
// La llave del API y el secreto del puente se leen de recon/n8n-fix-verify.mjs y del workflow que
// ya está publicado: este archivo no guarda secretos nuevos.
import crypto from 'crypto';
import fs from 'fs';

const N8N = 'https://n8n.fourgsolutions.com';
const WF_ID = 'ov2wvhH8Tym6U5kA';
const DRY = process.argv.includes('--dry');
const KEY = fs.readFileSync(new URL('./n8n-fix-verify.mjs', import.meta.url), 'utf8')
  .match(/^const KEY = '([^']+)';$/m)?.[1];
if (!KEY) throw new Error('no encontré la llave del API en recon/n8n-fix-verify.mjs');

const api = (ruta, init = {}) =>
  fetch(`${N8N}/api/v1${ruta}`, { ...init, headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json', ...(init.headers || {}) } });

const actual = await api(`/workflows/${WF_ID}`).then((r) => r.json());
if (!actual?.nodes) throw new Error('no pude leer el workflow: ' + JSON.stringify(actual).slice(0, 200));
fs.writeFileSync(new URL('./n8n-vigilante-respaldo.json', import.meta.url), JSON.stringify(actual, null, 2));
console.log('respaldo guardado en recon/n8n-vigilante-respaldo.json');

// El secreto del puente ya vive en el nodo publicado: se reusa, no se escribe aquí.
const SECRETO = actual.nodes
  .flatMap((n) => n.parameters?.headerParameters?.parameters ?? [])
  .find((p) => /webhook-secret/i.test(p.name))?.value;
if (!SECRETO) throw new Error('no encontré el x-webhook-secret en el workflow actual');

const nodo = (nombre) => actual.nodes.find((n) => n.name === nombre);
const id = () => crypto.randomUUID();

// ── La sonda: tres folios de oficinas distintas, verificados en vivo el 2026-09-19 ──
const jsSonda = `
// Prueba hasta TRES matrículas reales de oficinas distintas y CORTA al primer éxito.
// Caído = fallan las tres. Una sola matrícula no basta: puede caer en el modal ambiguo del SNR
// ("fue encontrada… sin dirección") que el robot bloquea a propósito, y eso no es una caída.
// (Alarma falsa de 31 h del 2026-09-19.)
const SECRETO = ${JSON.stringify(SECRETO)};
const URL_PUENTE = 'https://certificados.fourgsolutions.com/api/verificar';
const PRUEBAS = [
  { oficina: 'SOACHA', matricula: '222595' },
  { oficina: 'CALI', matricula: '141233' },
  { oficina: 'BARRANQUILLA', matricula: '95200' },
];

const H = (typeof this !== 'undefined' && this && this.helpers) ? this.helpers : null;
async function pedir(body) {
  if (H && typeof H.httpRequest === 'function') {
    const r = await H.httpRequest({
      method: 'POST', url: URL_PUENTE, body, json: true, timeout: 30000,
      headers: { 'x-webhook-secret': SECRETO },
      returnFullResponse: true, ignoreHttpStatusErrors: true,
    });
    return { codigo: r.statusCode, cuerpo: (r.body && typeof r.body === 'object') ? r.body : {} };
  }
  const r = await fetch(URL_PUENTE, {
    method: 'POST', headers: { 'x-webhook-secret': SECRETO, 'content-type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(30000),
  });
  let c = {}; try { c = await r.json(); } catch (e) { c = {}; }
  return { codigo: r.status, cuerpo: (c && typeof c === 'object') ? c : {} };
}

const resultados = [];
for (const p of PRUEBAS) {
  let ok = false, detalle = '';
  try {
    const r = await pedir({ oficina: p.oficina, matricula: p.matricula });
    const httpOk = r.codigo >= 200 && r.codigo < 300;
    const b = r.cuerpo;
    // EXIGE disponible === true, no basta con "el puente respondió". Las tres matrículas de prueba
    // SÍ están disponibles, así que cualquier otra cosa (incluido el "no concluyente honesto" que
    // el robot devuelve cuando el portal público deja de discriminar) es señal de problema en ese
    // folio, y se escala al siguiente. Si los tres dan eso, la pre-validación del SNR se cayó de
    // verdad y nadie puede comprar: ahí sí es alarma.
    ok = httpOk && b.disponible === true;
    detalle = ok ? 'ok' : (!httpOk ? ('HTTP ' + r.codigo) : (b.error ? String(b.error).slice(0, 60) : (b.ambiguo ? 'el portal no discrimina' : (b.estado ? String(b.estado).slice(0, 40) : 'respuesta sin datos'))));
  } catch (e) {
    detalle = 'sin respuesta: ' + String((e && e.message) || e).slice(0, 50);
  }
  resultados.push({ oficina: p.oficina, matricula: p.matricula, ok: ok, detalle: detalle });
  if (ok) break; // corte temprano: en el día bueno esto es UNA sola consulta, como antes
}

const buenas = resultados.filter(function (r) { return r.ok; }).length;
const fallos = resultados.filter(function (r) { return !r.ok; });
const linea = resultados.map(function (r) { return r.oficina + ' ' + r.matricula + (r.ok ? ' ✓' : ' ✗ ' + r.detalle); }).join(' · ');

return [{ json: {
  __ok: buenas > 0,
  __probadas: resultados.length,
  __fallos: fallos.length,
  __prueba: linea,
  __detalle: buenas > 0
    ? ('responde ' + resultados[resultados.length - 1].oficina + (fallos.length ? ' (falló antes: ' + fallos.map(function (r) { return r.oficina + ' ' + r.detalle; }).join(', ') + ')' : ''))
    : ('fallaron las ' + resultados.length + ': ' + fallos.map(function (r) { return r.oficina + ' ' + r.detalle; }).join(' · ')),
} }];
`.trim();

// ── Decidir: misma máquina de estados, pero el "ok" ya lo trae la sonda ──
const jsDecidir = `
// Decide si hay que alertar. Guarda estado entre corridas para NO inundar el correo:
// avisa cuando CAE, cuando VUELVE, y una vez por hora mientras siga caído.
// El "ok" lo decide la sonda: hay caída solo si fallaron las TRES matrículas.
const s = $getWorkflowStaticData('global');
const r = $input.first().json;

const ok = r.__ok === true;
const detalle = r.__detalle || 'sin detalle';
const prueba = r.__prueba || '(sin prueba)';

const ahora = Date.now();
const RECORDAR_MS = 60 * 60 * 1000;
const antes = s.caido === true;
let alerta = null;

if (!ok) {
  if (!antes) {
    alerta = { kind: 'verificacion_caida', titulo: '🔴 Certitradición: NADIE puede comprar',
      msg: 'Las TRES matrículas de prueba fallaron: la verificación no responde y el checkout no deja pagar sin verificar. Cada visitante que entra se va sin comprar. Revisar el servicio robot en EasyPanel (proyecto certificados).' };
    s.desde = ahora;
  } else if (ahora - (s.ultimoAviso || 0) > RECORDAR_MS) {
    const mins = Math.round((ahora - (s.desde || ahora)) / 60000);
    alerta = { kind: 'verificacion_caida', titulo: '🔴 Certitradición SIGUE caído (' + mins + ' min)',
      msg: 'La verificación lleva ' + mins + ' minutos sin responder con ninguna de las tres matrículas. Las ventas siguen en cero.' };
  }
  s.caido = true;
} else {
  if (antes) {
    const mins = Math.round((ahora - (s.desde || ahora)) / 60000);
    alerta = { kind: 'verificacion_ok', titulo: '✅ Certitradición volvió',
      msg: 'La verificación responde otra vez. Estuvo caída ' + mins + ' minutos.' };
  }
  s.caido = false;
}

if (!alerta) return [];
s.ultimoAviso = ahora;
return [{ json: { kind: alerta.kind, title: alerta.titulo, message: alerta.msg,
  data: { detalle, prueba, panel: 'https://certitradicion.com/admin' },
  at: new Date().toISOString() } }];
`.trim();

const sonda = { id: id(), name: 'Probar 3 matrículas', type: 'n8n-nodes-base.code', typeVersion: 2, position: [460, 300], parameters: { jsCode: jsSonda } };
const decidir = { ...nodo('Decidir'), position: [700, 300], parameters: { jsCode: jsDecidir } };
const nodes = [nodo('Cada 5 min'), sonda, decidir, nodo('Avisar por correo')];
const connections = {
  'Cada 5 min': { main: [[{ node: 'Probar 3 matrículas', type: 'main', index: 0 }]] },
  'Probar 3 matrículas': { main: [[{ node: 'Decidir', type: 'main', index: 0 }]] },
  Decidir: { main: [[{ node: 'Avisar por correo', type: 'main', index: 0 }]] },
};
const wf = { name: actual.name, nodes, connections, settings: actual.settings ?? { executionOrder: 'v1' } };

if (DRY) {
  console.log('DRY · nodos:', nodes.map((n) => n.name).join(' → '));
  console.log('DRY · matrículas de prueba: SOACHA 222595, CALI 141233, BARRANQUILLA 95200 (corte al primer éxito)');
  process.exit(0);
}

const put = await api(`/workflows/${WF_ID}`, { method: 'PUT', body: JSON.stringify(wf) });
const j = await put.json();
console.log('actualizar:', put.status, j.id ? 'OK' : JSON.stringify(j).slice(0, 300));
const act = await api(`/workflows/${WF_ID}/activate`, { method: 'POST' });
console.log('activar:', act.status, (await act.json().catch(() => ({}))).active === true ? 'ACTIVO' : '?');
