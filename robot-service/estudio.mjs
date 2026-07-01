// Genera el Estudio de Títulos estructurado a partir del CTL. Lee el CTL → NIM (texto) → JSON validado.
import { extraerTextoCTL } from './pdf-read.mjs';
import { nimChat } from './nim-client.mjs';

const SYS = `Eres un analista jurídico inmobiliario en Colombia. Recibes el TEXTO de un Certificado de Tradición
y Libertad (CTL) y produces un "Estudio de Títulos" claro para un comprador no experto. Analiza SOLO lo que el
texto dice (no inventes).

CRÍTICO — CANCELACIONES (lo más importante): las anotaciones van NUMERADAS en orden cronológico. Cuando una
anotación dice «Se cancela anotación No: X», o su especificación es una CANCELACION (p. ej. "CANCELACION DE
HIPOTECA", "CANCELACION DE EMBARGO", "CANCELACION DEMANDA", "CANCELACION AFECTACION A VIVIENDA FAMILIAR"),
entonces la anotación X y su gravamen/medida/limitación quedan SIN EFECTO: NO está vigente. Un
gravamen/embargo/demanda/limitación SOLO está vigente si NINGUNA anotación POSTERIOR lo cancela. Recorre TODAS
las anotaciones de principio a fin (incluidas las MÁS RECIENTES al final) y reporta en "gravamenes"/"banderas"
ÚNICAMENTE lo que siga vigente hoy. Si una hipoteca/embargo/demanda vieja fue cancelada, NO la reportes.

Identifica propietarios actuales, la cadena de tradición, y los gravámenes/limitaciones VIGENTES (hipotecas,
embargos, patrimonio de familia, afectación a vivienda familiar, demandas, falsa tradición, servidumbres). Marca
banderas de riesgo (rojo = grave: embargo/demanda/extinción/falsa tradición VIGENTE; amarillo = atención:
hipoteca vigente, patrimonio de familia). Devuelve EXCLUSIVAMENTE un JSON con esta forma exacta:
{
  "inmueble": { "matricula": string, "direccion": string|null, "circulo": string|null, "area": string|null },
  "propietarios": [ { "nombre": string, "identificacion": string|null, "modo": string, "anotacion": string|null } ],
  "gravamenes": [ { "tipo": string, "descripcion": string, "vigente": boolean, "anotacion": string|null } ],
  "banderas": [ { "nivel": "rojo"|"amarillo", "titulo": string, "detalle": string } ],
  "semaforo": "verde"|"amarillo"|"rojo",
  "resumen": string
}
Para "area": extrae el área del inmueble en m² si aparece llena (secciones "AREA Y COEFICIENTE", "AREA PRIVADA" o "AREA CONSTRUIDA"), formato "NN m2". Si esas casillas están VACÍAS pero en "MEDIDAS Y LINDEROS" / "CABIDA Y LINDEROS" hay dimensiones en metros de los lados del predio, ESTIMA el área aproximada (largo × ancho aproximados de los lados) y devuélvela como "NN m2 (estimada de linderos)". Solo usa null si no hay ninguna medida.
Reglas del semáforo: rojo si hay alguna bandera roja; amarillo si solo hay amarillas; verde si no hay banderas.
"resumen": 2-4 frases en español simple, directo al comprador. No incluyas texto fuera del JSON.`;

export async function generarEstudio(pdfBuffer, { matricula, oficina }) {
  const texto = await extraerTextoCTL(pdfBuffer);
  // CTL completo (antes cortaba en 24000 chars ≈ media hoja → se perdía el final, donde suelen estar las
  // cancelaciones y las medidas más recientes). llama-3.3-70b tiene contexto de 128k tokens; 120k chars caben.
  const user = `Matrícula: ${matricula} · Oficina: ${oficina}\n\nTEXTO DEL CTL (léelo COMPLETO, las cancelaciones y medidas recientes están al final):\n${texto.slice(0, 120000)}`;
  const raw = await nimChat([{ role: 'system', content: SYS }, { role: 'user', content: user }], { json: true, maxTokens: 3000 });
  let data;
  try { data = JSON.parse(raw); } catch { data = JSON.parse((raw.match(/\{[\s\S]*\}/) || ['{}'])[0]); }
  // saneo + defaults (nunca confiar 100% en el modelo). matrícula = SIEMPRE la del caller (autoritativa,
  // es un documento legal); círculo cae a la oficina si el modelo no lo trae.
  const im = data.inmueble || {};
  data.inmueble = { matricula: String(matricula), direccion: im.direccion ?? null, circulo: im.circulo ?? (oficina || null), area: im.area ?? null };
  data.propietarios = Array.isArray(data.propietarios) ? data.propietarios : [];
  data.gravamenes = Array.isArray(data.gravamenes) ? data.gravamenes : [];
  data.banderas = Array.isArray(data.banderas) ? data.banderas : [];
  if (!['verde', 'amarillo', 'rojo'].includes(data.semaforo)) {
    data.semaforo = data.banderas.some((b) => b.nivel === 'rojo') ? 'rojo' : data.banderas.length ? 'amarillo' : 'verde';
  }
  data.resumen = typeof data.resumen === 'string' ? data.resumen : '';
  return data;
}
