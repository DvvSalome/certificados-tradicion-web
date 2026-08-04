// Fusiona las ciudades generadas por el workflow en web/lib/ciudades.ts (append al array CIUDADES).
import fs from 'fs';

const OUT = 'C:/Users/jhanf/AppData/Local/Temp/claude/D--TRABAJOS-PROPIOS-projects-ALEXIS-TRADICION-CERTIFICADO/7129954f-c3cb-42ab-848d-7c609483de4a/tasks/w5acka2yn.output';
const CITY_TS = 'D:/TRABAJOS PROPIOS/projects/ALEXIS TRADICION CERTIFICADO/web/lib/ciudades.ts';

// 1) leer + parsear la salida (puede venir doble-encodeada como string JSON)
let raw = fs.readFileSync(OUT, 'utf8').trim();
let data = JSON.parse(raw);
if (data && typeof data === 'object' && !Array.isArray(data) && 'result' in data) data = data.result; // envoltorio del workflow
if (typeof data === 'string') data = JSON.parse(data);
if (!Array.isArray(data)) throw new Error('salida no es un array');
console.log(`salida: ${data.length} ciudades`);

// 2) leer ciudades.ts y detectar slugs existentes (evitar duplicados)
let content = fs.readFileSync(CITY_TS, 'utf8');
const existing = new Set([...content.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]));
const nuevas = data.filter((c) => c && c.slug && !existing.has(c.slug));
console.log(`existentes: ${existing.size} · nuevas a agregar: ${nuevas.length}`);
if (!nuevas.length) { console.log('nada que agregar'); process.exit(0); }

// 3) validar forma mínima
for (const c of nuevas) {
  for (const k of ['slug', 'ciudad', 'departamento', 'oficinas', 'metaTitle', 'metaDescription', 'h1', 'intro', 'comoObtener', 'faqs']) {
    if (c[k] == null) throw new Error(`ciudad ${c.slug} sin campo ${k}`);
  }
  if (!Array.isArray(c.faqs) || c.faqs.length !== 3) throw new Error(`ciudad ${c.slug}: faqs != 3`);
}

// 4) formatear como elementos del array (indent 2 espacios, igual que los existentes)
const indent = (s) => s.split('\n').map((l) => '  ' + l).join('\n');
const ordered = nuevas.map((c) => ({
  slug: c.slug, ciudad: c.ciudad, departamento: c.departamento, oficinas: c.oficinas,
  metaTitle: c.metaTitle, metaDescription: c.metaDescription, h1: c.h1,
  intro: c.intro, comoObtener: c.comoObtener, faqs: c.faqs,
}));
const block = ordered.map((c) => indent(JSON.stringify(c, null, 2))).join(',\n');

// 5) insertar antes del cierre del array CIUDADES (`\n];`)
const marker = '\n];';
const idx = content.indexOf(marker);
if (idx < 0) throw new Error('no se encontró el cierre del array CIUDADES');
content = content.slice(0, idx) + ',\n' + block + content.slice(idx);

fs.writeFileSync(CITY_TS, content, 'utf8');
const total = [...content.matchAll(/"slug":\s*"([^"]+)"/g)].length;
console.log(`✓ ciudades.ts actualizado · total ahora: ${total} ciudades`);
console.log('nuevas:', nuevas.map((c) => c.slug).join(', '));
