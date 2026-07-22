import type { Metadata } from 'next';
import PricingSection from '@/components/PricingSection';
import { PLANS } from '@/lib/config';

const BASE = 'https://certitradicion.com';

// Página real de precios (antes /#precio era solo un ancla y /precio daba 404).
// Existe para sitelinks de Google, para el llms.txt y para responder de frente
// la búsqueda "cuánto cuesta el certificado de tradición".
export const metadata: Metadata = {
  title: 'Precio del Certificado de Tradición y Libertad 2026',
  description:
    'Cuánto cuesta el Certificado de Tradición y Libertad en línea: desde $38.900 COP con entrega en minutos por correo y WhatsApp. Planes Certi Básico, Certi Express y Certi Avanzado.',
  alternates: { canonical: '/precio' },
  openGraph: {
    title: 'Precio del Certificado de Tradición y Libertad 2026',
    description: 'Desde $38.900 COP, entrega en minutos. Compara los planes y lo que incluye cada uno.',
    url: `${BASE}/precio`,
    type: 'website',
  },
};

export default function Precio() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}/precio`,
    name: 'Precio del Certificado de Tradición y Libertad 2026',
    url: `${BASE}/precio`,
    publisher: { '@id': `${BASE}/#organization` },
    mainEntity: {
      '@type': 'Service',
      name: 'Certificado de Tradición y Libertad en línea',
      provider: { '@id': `${BASE}/#organization` },
      offers: (['basico', 'express', 'avanzado'] as const).map((pid) => ({
        '@type': 'Offer',
        name: `Certi ${PLANS[pid].label}`,
        price: PLANS[pid].priceCop,
        priceCurrency: 'COP',
        url: `${BASE}/precio`,
        availability: 'https://schema.org/InStock',
      })),
    },
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
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <nav className="text-xs text-[var(--muted-2)]"><a href="/" className="hover:text-[var(--brand)]">Inicio</a> · <span className="text-[var(--muted)]">Precio</span></nav>
          <h1 className="mt-4 text-[clamp(1.8rem,5.5vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
            ¿Cuánto cuesta el Certificado de Tradición y Libertad?
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[var(--muted)]">
            El certificado en línea cuesta <strong className="text-[var(--foreground)]">desde $38.900 COP</strong> y llega a tu
            correo y WhatsApp en minutos. El precio incluye la tarifa del certificado electrónico ante la SNR más la gestión,
            la entrega inmediata y el soporte. Compara los tres planes y elige el que necesitas.
          </p>
        </div>

        <PricingSection />

        <div className="mx-auto max-w-4xl px-6 pb-14 text-center">
          <a href="/#comprar" className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand)] px-8 py-4 text-[16px] font-bold text-white shadow-lg transition-colors hover:bg-[var(--brand-600)]">
            Solicitar mi certificado ahora
          </a>
          <p className="mt-4 text-xs text-[var(--muted-2)]">
            Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR).
          </p>
        </div>
      </main>
    </div>
  );
}
