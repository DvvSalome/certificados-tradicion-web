// Lee el resultado del workflow cluster-guias-ctl y genera web/lib/guias.ts.
import fs from 'fs';
const OUT = 'C:/Users/jhanf/AppData/Local/Temp/claude/D--TRABAJOS-PROPIOS-projects-ALEXIS-TRADICION-CERTIFICADO/7129954f-c3cb-42ab-848d-7c609483de4a/tasks/wnk7z3jh4.output';
const parsed = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const guias = (parsed.result || parsed).guias;
if (!Array.isArray(guias) || !guias.length) throw new Error('sin guías');
fs.writeFileSync('recon/guias-content.json', JSON.stringify(guias, null, 2));

const header = `// Cluster de contenido: guías por anotación/concepto del Certificado de Tradición y Libertad.
// Contenido generado con el workflow cluster-guias-ctl. La ruta /guias/[slug] renderiza esto.
export interface Guia {
  slug: string;
  tema: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  secciones: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const GUIAS: Guia[] = `;
const footer = `;

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}
`;
fs.writeFileSync('web/lib/guias.ts', header + JSON.stringify(guias, null, 2) + footer);
console.log('✅ web/lib/guias.ts con', guias.length, 'guías:', guias.map((g) => g.slug).join(', '));
