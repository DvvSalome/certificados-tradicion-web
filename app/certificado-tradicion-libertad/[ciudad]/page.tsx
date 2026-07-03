import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CIUDADES, getCiudad } from '@/lib/ciudades';

const BASE = 'https://certitradicion.com';

export function generateStaticParams() {
  return CIUDADES.map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  const { ciudad } = await params;
  const c = getCiudad(ciudad);
  if (!c) return {};
  const url = `${BASE}/certificado-tradicion-libertad/${c.slug}`;
  // Normaliza el título: quita sufijos viejos (marca duplicada o precios desactualizados como "| $39.900")
  // del metaTitle; el template del layout ("%s | Certitradición") agrega la marca UNA sola vez.
  let baseTitle = c.metaTitle;
  while (/\s*\|\s*(Certitradici[oó]n|\$[\d.,]+)\s*$/i.test(baseTitle)) {
    baseTitle = baseTitle.replace(/\s*\|\s*(Certitradici[oó]n|\$[\d.,]+)\s*$/i, '').trim();
  }
  return {
    title: baseTitle,
    description: c.metaDescription,
    alternates: { canonical: `/certificado-tradicion-libertad/${c.slug}` },
    openGraph: {
      title: `${baseTitle} | Certitradición`,
      description: c.metaDescription,
      url,
      type: 'website',
      siteName: 'Certitradición',
      locale: 'es_CO',
      images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: `Certificado de Tradición y Libertad en ${c.ciudad}` }],
    },
  };
}

export default async function CiudadPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const c = getCiudad(ciudad);
  if (!c) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Certificado de Tradición y Libertad en ${c.ciudad}`,
        serviceType: 'Gestión de Certificado de Tradición y Libertad',
        areaServed: { '@type': 'City', name: c.ciudad, containedInPlace: { '@type': 'AdministrativeArea', name: c.departamento } },
        provider: { '@type': 'Organization', name: 'Certitradición', url: BASE },
        offers: { '@type': 'Offer', price: '39900', priceCurrency: 'COP' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Ciudades', item: `${BASE}/certificado-tradicion-libertad` },
          { '@type': 'ListItem', position: 3, name: c.ciudad, item: `${BASE}/certificado-tradicion-libertad/${c.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certificado de Tradición</span>
          </a>
          <a href="/" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar</a>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 lg:py-14">
        <nav className="text-xs text-[var(--muted-2)]">
          <a href="/" className="hover:text-[var(--brand)]">Inicio</a> ·{' '}
          <a href="/certificado-tradicion-libertad" className="hover:text-[var(--brand)]">Ciudades</a> · <span className="text-[var(--muted)]">{c.ciudad}</span>
        </nav>

        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent-50)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">{c.departamento}</span>
          <h1 className="text-[clamp(1.8rem,6vw,2.5rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">{c.h1}</h1>
          <p className="text-[16px] leading-relaxed text-[var(--muted)]">{c.intro}</p>
        </div>

        <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-50)] p-6 text-center">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">Genera tu certificado de {c.ciudad} ahora</p>
          <p className="mt-1 text-sm text-[var(--muted)]">En línea, a tu correo en minutos · pago seguro con Wompi.</p>
          <a href="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">
            Solicitar mi certificado
            <span className="grid size-5 place-items-center rounded-full bg-white/20"><svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </a>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Cómo obtener el certificado de un inmueble en {c.ciudad}</h2>
          <p className="text-[15px] leading-relaxed text-[var(--muted)]">{c.comoObtener}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {c.oficinas.map((o) => (
              <span key={o.codigo} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-[13px] shadow-sm">
                <span className="grid min-w-[2.6rem] place-items-center rounded-md bg-[var(--background)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[var(--brand)]">{o.codigo}</span>
                <span className="text-[var(--foreground)]">{o.nombre}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Preguntas frecuentes — {c.ciudad}</h2>
          <div className="flex flex-col gap-3">
            {c.faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                <p className="text-[15px] font-semibold text-[var(--foreground)]">{f.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-[var(--muted-2)]">
          Servicio de gestión privado — no somos canal oficial de la Superintendencia de Notariado y Registro (SNR). Facilitamos el trámite en tu nombre.
        </p>
      </main>
    </div>
  );
}
