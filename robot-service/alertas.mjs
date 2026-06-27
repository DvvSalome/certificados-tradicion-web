// Alertas de listas restrictivas (lavado de activos). Cruza los propietarios del Estudio contra la
// Lista OFAC/SDN (la "Lista Clinton" — la referencia de lavado de activos en Colombia). Descargable,
// gratis, SIN captcha. La extinción de dominio NO va aquí: sale del propio CTL (medidas cautelares de la
// Fiscalía/SAE), que el Estudio ya marca como bandera.
//
// CONSERVADOR: solo marca coincidencia FUERTE (todos los tokens significativos del nombre del propietario
// presentes en una entrada de la lista) y SIEMPRE como "posible coincidencia para revisión", nunca como
// determinación. Es un tamizaje automatizado, no una afirmación de que la persona esté en la lista.
import fs from 'fs';

const OFAC_URL = process.env.OFAC_SDN_URL || 'https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.CSV';
const CACHE_FILE = process.env.OFAC_CACHE_FILE || '/tmp/ofac-sdn.csv';
const TTL_MS = Number(process.env.OFAC_TTL_HOURS || 24) * 3600 * 1000;
const STOP = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'SAS', 'SA', 'LTDA', 'SAC', 'CIA', 'THE', 'OF', 'AND']);

export const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
export const tokens = (s) => norm(s).split(' ').filter((t) => t.length >= 3 && !STOP.has(t));

let _sdn = null; // [{name, tokens:Set, program, type}]

async function descargarOfac() {
  try {
    const st = fs.statSync(CACHE_FILE);
    if (Date.now() - st.mtimeMs < TTL_MS) return fs.readFileSync(CACHE_FILE, 'utf8'); // caché fresca
  } catch {}
  const res = await fetch(OFAC_URL, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error('OFAC HTTP ' + res.status);
  const txt = await res.text();
  try { fs.writeFileSync(CACHE_FILE, txt); } catch (e) { console.error('[alertas] no se pudo cachear OFAC:', e.message); }
  return txt;
}

// Parse del SDN.CSV: ent_num,"name",type,"program",...,"remarks". Saca el nombre + los a.k.a. de remarks.
export function parseSdn(csv) {
  const out = [];
  for (const line of csv.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const f = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g);
    if (!f || f.length < 4) continue;
    const clean = (x) => (x || '').replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim();
    const name = clean(f[1]);
    if (!name || name === '-0-') continue;
    const type = clean(f[2]);
    const program = clean(f[3]);
    const remarks = clean(f[f.length - 1]);
    const names = [name];
    const akas = remarks.match(/a\.k\.a\.\s+'([^']+)'/gi);
    if (akas) for (const a of akas) { const m = a.match(/'([^']+)'/); if (m) names.push(m[1]); }
    for (const nm of names) {
      const tk = tokens(nm);
      if (tk.length >= 2) out.push({ name: nm, tokens: new Set(tk), program, type });
    }
  }
  return out;
}

async function ensureSdn() {
  if (_sdn) return _sdn;
  _sdn = parseSdn(await descargarOfac());
  return _sdn;
}

// Cruza propietarios ({nombre}) contra OFAC. Coincidencia FUERTE = todos los tokens significativos del
// propietario están en una entrada SDN (orden-independiente). Para REVISIÓN, no es determinación.
export async function chequearAlertas(propietarios) {
  const sdn = await ensureSdn().catch((e) => { console.error('[alertas] OFAC no disponible:', e.message); return null; });
  if (!sdn) return { ok: false, fuente: 'OFAC SDN', coincidencias: [] };
  const coincidencias = [];
  for (const p of propietarios || []) {
    const tk = tokens(p.nombre);
    if (tk.length < 2) continue; // nombre demasiado corto → no chequear (evita falsos positivos)
    for (const e of sdn) {
      if (tk.every((t) => e.tokens.has(t))) {
        coincidencias.push({ propietario: p.nombre, lista: 'OFAC/SDN (Lista Clinton)', entrada: e.name, programa: e.program });
        break;
      }
    }
  }
  return { ok: true, fuente: 'OFAC SDN (Lista Clinton)', totalLista: sdn.length, coincidencias };
}
