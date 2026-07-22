import type { Metadata } from 'next';
import FaqSection from '@/components/FaqSection';
import { FAQS } from '@/lib/site-content';

const BASE = 'https://certitradicion.com';

// Página real de FAQ (antes /#preguntas-frecuentes era solo un ancla y /preguntas-frecuentes
// daba 404). Sitelink + FAQPage schema propio + destino estable para el llms.txt.
export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre el Certificado de Tradición y Libertad',
  description:
    'Qué es el Certificado de Tradición y Libertad, para qué sirve, cuánto cuesta, cuál es su vigencia, quién puede pedirlo y cómo se entrega. Respuestas claras y al grano.',
  alternates: { canonical: '/preguntas-frecuentes' },
  openGraph: {
    title: 'Preguntas frecuentes · Certitradición',
    description: 'Todo lo que necesitas saber del Certificado de Tradición y Libertad en Colombia.',
    url: `${BASE}/preguntas-frecuentes`,
    type: 'website',
  },
};

export default function PreguntasFrecuentes() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE}/preguntas-frecuentes`,
    url: `${BASE}/preguntas-frecuentes`,
    publisher: { '@id': `${BASE}/#organization` },
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certificado de Tradición</span>
          </a>
          <a href="/#comprar" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar</a>
        </div>
      </header>

      <main className="pb-4">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <nav className="text-xs text-[var(--muted-2)]"><a href="/" className="hover:text-[var(--brand)]">Inicio</a> · <span className="text-[var(--muted)]">Preguntas frecuentes</span></nav>
        </div>

        <FaqSection />

        <div className="mx-auto max-w-3xl px-6 pb-14 text-center">
          <p className="mb-4 text-[15px] text-[var(--muted)]">¿Resueltas tus dudas? Pide tu certificado en minutos.</p>
          <a href="/#comprar" className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand)] px-8 py-4 text-[16px] font-bold text-white shadow-lg transition-colors hover:bg-[var(--brand-600)]">
            Solicitar mi certificado
          </a>
        </div>
      </main>
    </div>
  );
}
