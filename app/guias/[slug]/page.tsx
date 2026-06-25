import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIAS, getGuia } from '@/lib/guias';

const BASE = 'https://certitradicion.com';

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { title: g.metaTitle, description: g.metaDescription, url: `${BASE}/guias/${g.slug}`, type: 'article' },
  };
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) notFound();
  const otras = GUIAS.filter((x) => x.slug !== g.slug).slice(0, 4);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: g.h1,
        description: g.metaDescription,
        about: g.tema,
        inLanguage: 'es-CO',
        author: { '@type': 'Organization', name: 'Certitradición' },
        publisher: { '@type': 'Organization', name: 'Certitradición', url: BASE },
        mainEntityOfPage: `${BASE}/guias/${g.slug}`,
      },
      { '@type': 'FAQPage', mainEntity: g.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Guías', item: `${BASE}/guias` },
          { '@type': 'ListItem', position: 3, name: g.tema, item: `${BASE}/guias/${g.slug}` },
        ],
      },
    ],
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
          <a href="/" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar</a>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-7 px-5 py-10 lg:py-14">
        <nav className="text-xs text-[var(--muted-2)]">
          <a href="/" className="hover:text-[var(--brand)]">Inicio</a> · <a href="/guias" className="hover:text-[var(--brand)]">Guías</a> · <span className="text-[var(--muted)]">{g.tema}</span>
        </nav>

        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <h1 className="text-[clamp(1.7rem,5.5vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">{g.h1}</h1>
            <p className="text-[16px] leading-relaxed text-[var(--muted)]">{g.intro}</p>
          </header>

          {g.secciones.map((s, i) => (
            <section key={i} className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{s.heading}</h2>
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">{s.body}</p>
            </section>
          ))}
        </article>

        <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-50)] p-6 text-center">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">Verifícalo en tu Certificado de Tradición y Libertad</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Genéralo en línea, a tu correo en minutos · pago seguro con Wompi.</p>
          <a href="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">
            Generar mi certificado
            <span className="grid size-5 place-items-center rounded-full bg-white/20"><svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </a>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Preguntas frecuentes</h2>
          {g.faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
              <p className="text-[15px] font-semibold text-[var(--foreground)]">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-[var(--border)] pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">Sigue aprendiendo</p>
          <ul className="flex flex-col gap-2">
            <li><a href="/como-leer-certificado" className="text-[14px] font-medium text-[var(--brand)] hover:underline">› Cómo leer un Certificado de Tradición y Libertad (guía completa)</a></li>
            {otras.map((o) => (
              <li key={o.slug}><a href={`/guias/${o.slug}`} className="text-[14px] font-medium text-[var(--brand)] hover:underline">› {o.tema}</a></li>
            ))}
          </ul>
        </section>

        <p className="text-center text-xs text-[var(--muted-2)]">Servicio de gestión privado — no somos canal oficial de la SNR · Contenido informativo</p>
      </main>
    </div>
  );
}
