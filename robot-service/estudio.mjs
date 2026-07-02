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

LIMITACIONES ADMINISTRATIVAS NORMALES (no son riesgo): el REGLAMENTO DE PROPIEDAD HORIZONTAL / COPROPIEDAD, la
constitución o reforma de propiedad horizontal, englobe/desenglobe, y las servidumbres o afectaciones
urbanísticas ordinarias son NORMALES (la mayoría de apartamentos y casas en conjunto los tienen). Repórtalos en
"gravamenes" con "naturaleza":"normal", NO generes banderas por ellos y NO afectan el semáforo. En cambio,
hipoteca, embargo, demanda, patrimonio de familia, afectación a vivienda familiar, extinción de dominio,
falsa tradición y medidas cautelares SÍ son de riesgo → "naturaleza":"riesgo".

Identifica propietarios actuales, la cadena de tradición, y los gravámenes/limitaciones VIGENTES (hipotecas,
embargos, patrimonio de familia, afectación a vivienda familiar, demandas, falsa tradición, servidumbres). Marca
banderas de riesgo (rojo = grave: embargo/demanda/extinción/falsa tradición VIGENTE; amarillo = atención:
hipoteca vigente, patrimonio de familia). Devuelve EXCLUSIVAMENTE un JSON con esta forma exacta:
{
  "inmueble": { "matricula": string, "direccion": string|null, "circulo": string|null, "area": string|null },
  "propietarios": [ { "nombre": string, "identificacion": string|null, "modo": string, "anotacion": string|null } ],
  "gravamenes": [ { "tipo": string, "descripcion": string, "vigente": boolean, "naturaleza": "riesgo"|"normal", "anotacion": string|null } ],
  "banderas": [ { "nivel": "rojo"|"amarillo", "titulo": string, "detalle": string } ],
  "ultimaVenta": { "valor": string|null, "anio": string|null },
  "semaforo": "verde"|"amarillo"|"rojo",
  "resumen": string
}
Para "ultimaVenta": busca la COMPRAVENTA (venta) MÁS RECIENTE en la cadena de tradición y devuelve su valor
declarado ("VALOR ACTO") y el año. Formato valor: "$NN.NNN.NNN" (con separador de miles). Ignora actos con
VALOR ACTO $0, y actos que NO sean venta (hipoteca, embargo, aclaración, englobe). Si no hay ninguna, ambos null.
Para "area": extrae el área del inmueble en m² si aparece llena (secciones "AREA Y COEFICIENTE", "AREA PRIVADA" o "AREA CONSTRUIDA"), formato "NN m2". Si esas casillas están VACÍAS pero en "MEDIDAS Y LINDEROS" / "CABIDA Y LINDEROS" hay dimensiones en metros de los lados del predio, ESTIMA el área aproximada (largo × ancho aproximados de los lados) y devuélvela como "NN m2 (estimada de linderos)". Solo usa null si no hay ninguna medida.
Reglas del semáforo: rojo si hay alguna bandera roja; amarillo si solo hay amarillas; verde si no hay banderas.
"resumen": un análisis de 5 a 8 frases (2-3 párrafos cortos), en español claro y directo al comprador, que cubra
EN ESTE ORDEN: (1) qué es el inmueble y su ubicación; (2) quién es el propietario actual y CÓMO lo adquirió
(compraventa, sucesión, etc.) según la última anotación; (3) qué gravámenes o limitaciones VIGENTES tiene y qué
significan en la práctica para quien compra (p. ej. "tiene una hipoteca vigente: debe cancelarse antes o en la
venta"); (4) las banderas de riesgo detectadas y su gravedad; (5) una recomendación práctica final (p. ej.
"puede comprarse con tranquilidad verificando X", o "NO firmar hasta resolver la demanda de la anotación N").
Sé concreto, cita números de anotación cuando ayuden, y no uses tecnicismos sin explicarlos. No inventes datos
que no estén en el texto. No incluyas texto fuera del JSON.`;

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
  data.propietarios = (Array.isArray(data.propietarios) ? data.propietarios : []).filter((p) => p && typeof p === 'object');
  data.gravamenes = (Array.isArray(data.gravamenes) ? data.gravamenes : [])
    .filter((g) => g && typeof g === 'object')
    .map((g) => ({ ...g, naturaleza: g.naturaleza === 'normal' ? 'normal' : 'riesgo' }));
  data.banderas = (Array.isArray(data.banderas) ? data.banderas : []).filter((b) => b && typeof b === 'object');
  data.ultimaVenta = data.ultimaVenta && typeof data.ultimaVenta === 'object' ? data.ultimaVenta : { valor: null, anio: null };
  // Semáforo SIEMPRE derivado de las banderas (no confiar en el valor del modelo aunque sea sintácticamente
  // válido): evita que el badge diga "verde" mientras hay una bandera roja (embargo/demanda) listada debajo.
  data.semaforo = data.banderas.some((b) => b.nivel === 'rojo') ? 'rojo' : data.banderas.length ? 'amarillo' : 'verde';
  data.resumen = typeof data.resumen === 'string' ? data.resumen : '';
  return data;
}
