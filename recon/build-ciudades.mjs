// Lee el resultado del workflow (output file) y genera web/lib/ciudades.ts con los datos.
import fs from 'fs';

const OUT = 'C:/Users/jhanf/AppData/Local/Temp/claude/D--TRABAJOS-PROPIOS-projects-ALEXIS-TRADICION-CERTIFICADO/7129954f-c3cb-42ab-848d-7c609483de4a/tasks/wyjj3pazt.output';
const raw = fs.readFileSync(OUT, 'utf8');
const parsed = JSON.parse(raw); // el archivo completo es JSON: { summary, result: { ciudades } }
const ciudades = (parsed.result || parsed).ciudades;
if (!Array.isArray(ciudades) || !ciudades.length) throw new Error('sin ciudades');

// orden estable por nombre de ciudad
ciudades.sort((a, b) => a.ciudad.localeCompare(b.ciudad, 'es'));
fs.writeFileSync('recon/ciudades-content.json', JSON.stringify(ciudades, null, 2));

const header = `// Datos de las páginas por ciudad (SEO programático). Contenido generado con el workflow ciudades-ctl.
// La ruta /certificado-tradicion-libertad/[ciudad] renderiza esto.
export interface CiudadOficina { nombre: string; codigo: string }
export interface Ciudad {
  slug: string;
  ciudad: string;
  departamento: string;
  oficinas: CiudadOficina[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  comoObtener: string;
  faqs: { q: string; a: string }[];
}

export const CIUDADES: Ciudad[] = `;

const footer = `;

export function getCiudad(slug: string): Ciudad | undefined {
  return CIUDADES.find((c) => c.slug === slug);
}
`;

fs.writeFileSync('web/lib/ciudades.ts', header + JSON.stringify(ciudades, null, 2) + footer);
console.log('✅ web/lib/ciudades.ts con', ciudades.length, 'ciudades:', ciudades.map((c) => c.slug).join(', '));
