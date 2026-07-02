// Avalúo comercial DIGITAL (estimado referencial automatizado). NO es un avalúo formal de un perito.
// Heurística gratis: área (m², del CTL) × valor de referencia por m² de la ciudad → rango ±35%.
// Si no hay área, no estima (honesto). El valor/m² es un PROMEDIO de ciudad — ignora zona/estrato
// específicos → por eso es "referencial" y con rango amplio. Para precisión real haría falta el avalúo
// catastral por predio (integración de catastro), que es el upgrade natural.

// COP/m² — promedios residenciales aproximados, configurables. Refinar con datos de mercado reales.
const VALOR_M2 = {
  BOGOTA: 5500000, MEDELLIN: 4800000, CALI: 3600000, BARRANQUILLA: 3400000, CARTAGENA: 4200000,
  BUCARAMANGA: 3500000, PEREIRA: 3200000, MANIZALES: 3000000, CUCUTA: 2600000, IBAGUE: 2700000,
  'SANTA MARTA': 3300000, VILLAVICENCIO: 3000000, MONTERIA: 2800000, PASTO: 2800000, NEIVA: 2700000,
  ARMENIA: 2900000, POPAYAN: 2800000, VALLEDUPAR: 2700000, SINCELEJO: 2500000, TUNJA: 2900000,
  DEFAULT: 3200000,
};
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

function valorM2(ciudad) {
  const c = norm(ciudad);
  for (const k of Object.keys(VALOR_M2)) if (k !== 'DEFAULT' && c.includes(k)) return { v: VALOR_M2[k], ciudad: k };
  return { v: VALOR_M2.DEFAULT, ciudad: null };
}
// "80.5 m2", "80,50 MTS2", "80" → número o null
function parseArea(a) {
  if (a == null) return null;
  const m = String(a).replace(/\.(?=\d{3}\b)/g, '').replace(',', '.').match(/(\d+(\.\d+)?)/);
  const n = m ? Number(m[1]) : null;
  return n && n > 5 && n < 100000 ? n : null;
}
const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(n / 1000) * 1000);

// El $/m² BAJA con el tamaño (dilución del valor del suelo): un apartamento pequeño vale más por m² que
// una casa/lote grande. Ajuste por tramos → estimado más realista que un promedio plano de ciudad.
// ponytail: heurística por tramos; el upgrade real (precisión de perito) es integrar catastro por predio.
function factorTamano(a) {
  if (a <= 60) return 1.18;   // apto pequeño
  if (a <= 120) return 1.0;   // apto / casa pequeña (referencia)
  if (a <= 250) return 0.86;  // casa
  if (a <= 600) return 0.72;  // casa grande / lote
  return 0.6;                  // lote grande
}

// estimarAvaluo({ area, ciudad }) → { disponible, ciudad, valorM2, areaM2, estimado, min, max, metodologia, confianza, nota }
export function estimarAvaluo({ area, ciudad } = {}) {
  const a = parseArea(area);
  if (!a) return { disponible: false, motivo: 'sin área del inmueble en el CTL (se requiere para estimar)' };
  const { v, ciudad: cMatch } = valorM2(ciudad);
  const vAdj = Math.round(v * factorTamano(a) / 10000) * 10000;
  const base = a * vAdj;
  // Rango ±18% (más creíble que ±35%). Sin ciudad reconocida el estimado es más incierto → rango más amplio.
  const spread = cMatch ? 0.18 : 0.28;
  return {
    disponible: true,
    ciudad: cMatch || ciudad || null,
    valorM2: vAdj,
    areaM2: a,
    estimado: fmt(base),
    min: fmt(base * (1 - spread)),
    max: fmt(base * (1 + spread)),
    metodologia: `${a} m² × ${fmt(vAdj)}/m² (referencia residencial${cMatch ? ' ' + cMatch : ''}, ajustada por tamaño)`,
    confianza: cMatch ? 'media' : 'baja',
    nota: 'Estimado automatizado referencial basado en promedios de zona ajustados por tamaño. No es un avalúo formal de un perito. El valor real depende de la ubicación exacta, el estrato, el estado del inmueble y el mercado.',
  };
}
