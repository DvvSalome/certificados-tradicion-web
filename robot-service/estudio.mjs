// Genera el Estudio de Títulos v2 a partir del CTL. El LLM EXTRAE hechos (cadena de tradición,
// situación jurídica, gravámenes, medidas); las reglas deterministas (estudio-reglas.mjs) emiten
// el veredicto (concepto/semáforo/documentos/salvedades). Retry x3 ante JSON malformado.
import { extraerTextoCTL } from './pdf-read.mjs';
import { nimChat } from './nim-client.mjs';
import { aplicarReglas } from './estudio-reglas.mjs';

const MAX_OUT = Number(process.env.LLM_MAX_TOKENS_ESTUDIO || 8000);

const SYS = `Eres un analista de títulos inmobiliarios en Colombia. Recibes el TEXTO de un Certificado de
Tradición y Libertad (CTL) y EXTRAES los hechos en JSON para un estudio de títulos. NO emites el veredicto
final (eso lo hace el sistema). Analiza SOLO lo que el texto dice; campo sin dato = null. No inventes.

PROCESO OBLIGATORIO, EN ESTE ORDEN:

PASO 1 — INVENTARIO: recorre TODAS las anotaciones numeradas (de la 1 a la última) y vuélcalas en
"cadenaTradicion" en orden cronológico, en estilo TELEGRÁFICO: acto corto ("COMPRAVENTA", "HIPOTECA",
"CANCELACION HIPOTECA"), nombres cortos (apellidos y nombre, SIN cédulas), sin repetir descripciones largas.

PASO 2 — CANCELACIONES (CRÍTICO): las anotaciones van NUMERADAS en orden cronológico. Cuando una anotación
dice «Se cancela anotación No: X», o su especificación es una CANCELACION (p. ej. "CANCELACION DE HIPOTECA",
"CANCELACION DE EMBARGO", "CANCELACION DEMANDA", "CANCELACION AFECTACION A VIVIENDA FAMILIAR"), la anotación X
queda SIN EFECTO. En la fila X de cadenaTradicion llena "cancelada" con el número de la anotación que la
cancela, y en el gravamen/medida correspondiente llena "canceladoPor" y marca "vigente": false. Un
gravamen/embargo/demanda SOLO está vigente si NINGUNA anotación posterior lo cancela. Recorre hasta el final
(las cancelaciones recientes están al final del texto).

PASO 3 — TRACTO SUCESIVO: en cada transferencia de dominio, el "de" (quien transfiere) debe ser el "a" (quien
adquirió) de la transferencia ANTERIOR. Si no coincide y no lo explica una sucesión/adjudicación/englobe,
marca "tractoSucesivo": "con_observaciones" y describe el salto en "tractoObservaciones" citando anotaciones.
Si todo cuadra: "continuo".

PASO 4 — FALSA TRADICIÓN: si el código de naturaleza jurídica de una anotación empieza por 06 (p. ej. 0604
venta de cosa ajena, 0610 derechos y acciones) O su texto menciona "FALSA TRADICION", "VENTA DE COSA AJENA" o
"DERECHOS Y ACCIONES", marca "esFalsaTradicion": true en esa fila. Si el titular ACTUAL adquirió por un acto
así y ninguna anotación posterior lo sanea (pertenencia/adjudicación), "tipoDominio": "falsa_tradicion";
si adquirió con título pleno normal, "pleno". Las transferencias posteriores a una falsa tradición no saneada
siguen siendo falsa tradición.

PASO 5 — SITUACIÓN ACTUAL: propietarios actuales con su cuota si hay copropiedad ("50%", "1/2"...). Detecta
sucesión ilíquida / derechos herenciales sin adjudicar ("sucesionIliquida": true + detalle). Registra el año
en que el titular actual adquirió ("anioAdquisicionTitular") y si fue por compraventa
("adquisicionFueCompraventa").

PASO 6 — GRAVÁMENES Y MEDIDAS: gravámenes y limitaciones en "gravamenes" (con cuantía, acreedor y fecha SOLO
si el texto los trae). Las MEDIDAS CAUTELARES van APARTE en "medidasCautelares": embargo, demanda, secuestro,
prohibición de enajenar, extinción de dominio. Regla de oro: todo gravamen/medida SIN cancelación posterior
sigue VIGENTE.

CÓDIGOS DE REFERENCIA (el TEXTO de la especificación manda sobre el código; puede variar o faltar):
0125 compraventa · 0129 dación en pago · 0138 donación · 0203 hipoteca · 0201 ampliación hipoteca ·
0304 afectación a vivienda familiar · 0314 usufructo · 0315 patrimonio de familia · 04xx medidas cautelares
(embargos, demandas) · 06xx FALSA TRADICIÓN · 0915 desenglobe · 0919 englobe · 0920 loteo.

LIMITACIONES ADMINISTRATIVAS NORMALES (no son riesgo): el REGLAMENTO DE PROPIEDAD HORIZONTAL / COPROPIEDAD,
la constitución o reforma de propiedad horizontal, englobe/desenglobe, y las servidumbres o afectaciones
urbanísticas ordinarias son NORMALES. Repórtalos en "gravamenes" con "naturaleza":"normal" y NO generes
banderas por ellos. En cambio hipoteca, embargo, demanda, patrimonio de familia, afectación a vivienda
familiar, extinción de dominio, falsa tradición y medidas cautelares → "naturaleza":"riesgo".

BANDERAS: rojo = grave (embargo/demanda/extinción/falsa tradición VIGENTE); amarillo = atención (hipoteca
vigente, patrimonio de familia, afectación a vivienda familiar, sucesión sin adjudicar, tracto con saltos).

Devuelve EXCLUSIVAMENTE un JSON con esta forma exacta:
{
  "inmueble": { "matricula": string, "direccion": string|null, "circulo": string|null, "area": string|null,
    "fichaCatastral": string|null, "tipoPredio": string|null, "estadoFolio": "activo"|"cerrado"|null,
    "linderosResumen": string|null },
  "alcance": { "fechaExpedicionCTL": string|null, "fechaApertura": string|null,
    "fechaUltimaAnotacion": string|null, "totalAnotaciones": number|null },
  "propietarios": [ { "nombre": string, "identificacion": string|null, "modo": string,
    "anotacion": string|null, "cuota": string|null } ],
  "cadenaTradicion": [ { "anotacion": string, "fecha": string|null, "acto": string, "codigo": string|null,
    "de": string|null, "a": string|null, "valor": string|null, "esTransferenciaDominio": boolean,
    "esFalsaTradicion": boolean, "cancelada": string|null } ],
  "situacionJuridica": { "tipoDominio": "pleno"|"falsa_tradicion"|"indeterminado", "cuotas": string|null,
    "anioAdquisicionTitular": string|null, "adquisicionFueCompraventa": boolean,
    "tractoSucesivo": "continuo"|"con_observaciones"|"indeterminado", "tractoObservaciones": string|null,
    "sucesionIliquida": boolean, "sucesionDetalle": string|null },
  "gravamenes": [ { "tipo": string, "descripcion": string, "vigente": boolean,
    "naturaleza": "riesgo"|"normal", "anotacion": string|null, "cuantia": string|null,
    "acreedor": string|null, "fechaAnotacion": string|null, "canceladoPor": string|null } ],
  "medidasCautelares": [ { "tipo": string, "descripcion": string, "vigente": boolean,
    "anotacion": string|null, "demandante": string|null, "fechaAnotacion": string|null,
    "canceladoPor": string|null } ],
  "banderas": [ { "nivel": "rojo"|"amarillo", "titulo": string, "detalle": string } ],
  "ultimaVenta": { "valor": string|null, "anio": string|null },
  "recomendaciones": [ string ],
  "resumen": string
}
Para "ultimaVenta": la COMPRAVENTA más reciente con su "VALOR ACTO" y año; formato "$NN.NNN.NNN"; ignora
actos con valor $0 y los que no sean venta. Si no hay, ambos null.
Para "area": extrae los m² si aparecen ("AREA Y COEFICIENTE", "AREA PRIVADA", "AREA CONSTRUIDA"), formato
"NN m2". Si están vacías pero "MEDIDAS Y LINDEROS" trae dimensiones de los lados, ESTIMA (largo × ancho) y
devuelve "NN m2 (estimada de linderos)". Solo null si no hay ninguna medida.
"recomendaciones": máximo 8, concretas y accionables para el comprador, citando anotaciones (p. ej. "Exigir la
cancelación de la hipoteca de la anot. 5 antes de firmar promesa").
"resumen": 3 a 4 PÁRRAFOS separados por líneas en blanco (\\n\\n), en español claro para un comprador no
experto: P1 qué es el inmueble, dónde queda y el alcance del análisis (período del folio, total de
anotaciones); P2 la historia de la tradición y la situación jurídica (cómo llegó al titular actual, si el
dominio es pleno, si el tracto es continuo); P3 los gravámenes y medidas VIGENTES y qué significan en la
práctica para quien compra; P4 los riesgos detectados y qué verificar antes de firmar. Cita números de
anotación; explica todo tecnicismo.
ECONOMÍA: sé telegráfico en cadenaTradicion. Si el folio tiene MÁS de 35 anotaciones, incluye en la cadena
solo: transferencias de dominio, gravámenes, medidas cautelares y cancelaciones (omite aclaraciones y actos
administrativos menores) y dilo en "tractoObservaciones". No incluyas texto fuera del JSON.`;

// Parseo robusto: JSON directo → bloque {...} → salvage de truncamiento (corta en el último punto
// donde llaves/corchetes quedan balanceados fuera de strings).
function parseJsonRobusto(raw) {
  try { return JSON.parse(raw); } catch { /* sigue */ }
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* sigue */ } }
  const start = raw.indexOf('{');
  if (start < 0) throw new Error('respuesta del modelo sin JSON');
  let depth = 0, inStr = false, escN = false, lastOk = -1;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escN) { escN = false; continue; }
    if (ch === '\\') { escN = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') { depth--; if (depth === 0) { lastOk = i; break; } }
  }
  if (lastOk > start) return JSON.parse(raw.slice(start, lastOk + 1));
  throw new Error('JSON truncado irrecuperable');
}

export async function generarEstudio(pdfBuffer, { matricula, oficina }) {
  const texto = await extraerTextoCTL(pdfBuffer);
  // CTL completo (120k chars ≈ 35-40k tokens: cabe de sobra con 8k de salida en 128k de contexto).
  const user = `Matrícula: ${matricula} · Oficina: ${oficina}\n\nTEXTO DEL CTL (léelo COMPLETO, las cancelaciones y medidas recientes están al final):\n${texto.slice(0, 120000)}`;

  let data = null, lastErr = null;
  for (let intento = 1; intento <= 3 && !data; intento++) {
    const msgs = [{ role: 'system', content: SYS }, { role: 'user', content: user }];
    if (intento > 1) {
      // Cambiar el input garantiza salida distinta incluso a temperature 0.
      msgs.push({ role: 'user', content: 'Tu respuesta anterior no fue JSON válido o quedó cortada. Responde SOLO el JSON, sin texto fuera. Si el folio tiene muchas anotaciones, comprime cadenaTradicion a transferencias de dominio, gravámenes, medidas cautelares y cancelaciones.' });
    }
    try {
      const raw = await nimChat(msgs, { json: true, maxTokens: MAX_OUT });
      data = parseJsonRobusto(raw);
    } catch (e) {
      lastErr = e;
      console.error(`[estudio] parseo intento ${intento}/3 falló: ${String(e.message).split('\n')[0]}`);
    }
  }
  if (!data) throw lastErr || new Error('estudio: sin respuesta del modelo');

  return aplicarReglas(data, { matricula, oficina, anioActual: new Date().getFullYear() });
}
