// Genera el Estudio de Títulos estructurado a partir del CTL. Lee el CTL → NIM (texto) → JSON validado.
import { extraerTextoCTL } from './pdf-read.mjs';
import { nimChat } from './nim-client.mjs';

const SYS = `Eres un analista jurídico inmobiliario en Colombia. Recibes el TEXTO de un Certificado de Tradición
y Libertad (CTL) y produces un "Estudio de Títulos" claro para un comprador no experto. Analiza SOLO lo que el
texto dice (no inventes). Identifica propietarios actuales, la cadena de tradición, y los gravámenes/limitaciones
VIGENTES (hipotecas, embargos, patrimonio de familia, afectación a vivienda familiar, demandas, falsa tradición,
servidumbres). Marca banderas de riesgo (rojo = grave: embargo/demanda/extinción/falsa tradición; amarillo =
atención: hipoteca vigente, patrimonio de familia). Devuelve EXCLUSIVAMENTE un JSON con esta forma exacta:
{
  "inmueble": { "matricula": string, "direccion": string|null, "circulo": string|null, "area": string|null },
  "propietarios": [ { "nombre": string, "identificacion": string|null, "modo": string, "anotacion": string|null } ],
  "gravamenes": [ { "tipo": string, "descripcion": string, "vigente": boolean, "anotacion": string|null } ],
  "banderas": [ { "nivel": "rojo"|"amarillo", "titulo": string, "detalle": string } ],
  "semaforo": "verde"|"amarillo"|"rojo",
  "resumen": string
}
Para "area": extrae el área del inmueble en metros cuadrados si aparece (secciones "AREA Y COEFICIENTE", "AREA PRIVADA" o "AREA CONSTRUIDA"), en formato "NN m2"; usa null si no aparece.
Reglas del semáforo: rojo si hay alguna bandera roja; amarillo si solo hay amarillas; verde si no hay banderas.
"resumen": 2-4 frases en español simple, directo al comprador. No incluyas texto fuera del JSON.`;

export async function generarEstudio(pdfBuffer, { matricula, oficina }) {
  const texto = await extraerTextoCTL(pdfBuffer);
  const user = `Matrícula: ${matricula} · Oficina: ${oficina}\n\nTEXTO DEL CTL:\n${texto.slice(0, 24000)}`;
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
