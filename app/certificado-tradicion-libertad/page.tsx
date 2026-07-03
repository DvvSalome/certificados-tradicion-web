import type { Metadata } from 'next';
import { CIUDADES } from '@/lib/ciudades';
import { ArticleMeta, UPDATED_ISO } from '@/components/ArticleMeta';

const BASE = 'https://certitradicion.com';

export const metadata: Metadata = {
  title: 'Certificado de Tradición y Libertad: qué es y cómo obtenerlo en línea',
  description:
    'Qué es el Certificado de Tradición y Libertad (CTL), qué contiene, para qué sirve y cómo obtenerlo en línea en minutos en Colombia. Guía completa + solicitud a tu correo y WhatsApp.',
  alternates: { canonical: '/certificado-tradicion-libertad' },
  openGraph: {
    title: 'Certificado de Tradición y Libertad: qué es y cómo obtenerlo | Certitradición',
    description: 'Guía completa del Certificado de Tradición y Libertad en Colombia: qué es, qué contiene, para qué sirve y cómo obtenerlo en línea en minutos.',
    url: `${BASE}/certificado-tradicion-libertad`,
    type: 'article',
  },
};

const FAQS = [
  {
    q: '¿Qué es el Certificado de Tradición y Libertad?',
    a: 'Es el documento oficial expedido por la Superintendencia de Notariado y Registro (SNR) que resume la historia jurídica de un inmueble en Colombia: propietarios, compraventas, hipotecas, embargos, gravámenes y demás anotaciones del folio de matrícula inmobiliaria. Funciona como la "hoja de vida" del predio.',
  },
  {
    q: '¿Para qué sirve el Certificado de Tradición y Libertad?',
    a: 'Sirve para saber quién es el dueño real de un inmueble y si tiene cargas que limiten su venta o uso. Es indispensable antes de comprar, vender, hipotecar o arrendar, y suele exigirse en trámites bancarios, notariales, sucesiones y procesos judiciales.',
  },
  {
    q: '¿Cuánto cuesta y cuánto tarda?',
    a: 'Con Certitradición el plan Básico cuesta $38.900 e incluye la gestión, la tarifa del certificado electrónico ante la SNR y la entrega en minutos por correo y WhatsApp. El plan Express ($44.900) agrega un Estudio de Títulos con el análisis del inmueble. La entrega suele ser en cuestión de minutos tras confirmarse el pago.',
  },
  {
    q: '¿Cuál es la vigencia del certificado?',
    a: 'El Certificado de Tradición y Libertad tiene una vigencia de 30 días calendario desde su expedición. Pasado ese plazo, bancos y notarías suelen exigir uno actualizado, porque la situación del inmueble puede cambiar con nuevas anotaciones.',
  },
  {
    q: '¿Necesito ser el propietario para solicitarlo?',
    a: 'No. Es un documento público: cualquier persona puede solicitarlo sin ser el dueño ni demostrar interés. Basta con conocer el folio de matrícula inmobiliaria, o la oficina de registro y los datos del predio.',
  },
  {
    q: '¿Cómo verifico que el certificado es auténtico?',
    a: 'Cada certificado incluye un código de verificación de la SNR. Con ese código puedes confirmar su autenticidad directamente en el portal oficial de la Superintendencia de Notariado y Registro (supernotariado.gov.co).',
  },
];

export default function PilarCTL() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${BASE}/certificado-tradicion-libertad#article`,
        headline: 'Certificado de Tradición y Libertad: qué es y cómo obtenerlo en línea',
        description: metadata.description,
        about: 'Certificado de Tradición y Libertad',
        inLanguage: 'es-CO',
        datePublished: '2026-06-01',
        dateModified: UPDATED_ISO,
        author: { '@type': 'Organization', name: 'Certitradición', url: BASE },
        publisher: { '@type': 'Organization', name: 'Certitradición', url: BASE },
        mainEntityOfPage: `${BASE}/certificado-tradicion-libertad`,
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/certificado-tradicion-libertad#faq`,
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Certificado de Tradición y Libertad', item: `${BASE}/certificado-tradicion-libertad` },
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
          <a href="/" className="hover:text-[var(--brand)]">Inicio</a> · <span className="text-[var(--muted)]">Certificado de Tradición y Libertad</span>
        </nav>

        <article className="flex flex-col gap-7">
          <header className="flex flex-col gap-3">
            <h1 className="text-[clamp(1.9rem,6vw,2.5rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
              Certificado de Tradición y Libertad: qué es y cómo obtenerlo
            </h1>
            <ArticleMeta />
          </header>

          {/* Respuesta directa (citation-ready para IA y AI Overviews) */}
          <div className="rounded-2xl border-l-4 border-[var(--brand)] bg-[var(--brand-50)] p-5">
            <p className="text-[16.5px] leading-relaxed text-[var(--foreground)]">
              El <strong>Certificado de Tradición y Libertad</strong> (CTL) es el documento oficial expedido por la
              <strong> Superintendencia de Notariado y Registro (SNR)</strong> que muestra la historia jurídica completa de un
              inmueble en Colombia: quiénes han sido y quién es su propietario, y todas las cargas que lo afectan
              (hipotecas, embargos, gravámenes y demás anotaciones). Es la <strong>"hoja de vida" del predio</strong> y se
              obtiene a partir del <strong>número de matrícula inmobiliaria</strong>. Con Certitradición lo generas en línea y
              lo recibes por correo y WhatsApp en minutos.
            </p>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">¿Qué es el Certificado de Tradición y Libertad?</h2>
            <p className="text-[15.5px] leading-relaxed text-[var(--muted)]">
              El CTL es el resumen oficial del <strong>folio de matrícula inmobiliaria</strong>, el registro donde la SNR anota,
              de forma cronológica y numerada, cada acto jurídico que afecta a un inmueble desde que se abrió su matrícula. Cada
              vez que un predio se vende, se hipoteca, se embarga o recibe una medida cautelar, queda una <strong>anotación</strong>
              en ese folio. El certificado condensa esa historia en un documento con validez legal.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">¿Qué contiene?</h2>
            <ul className="flex flex-col gap-2.5">
              {[
                ['Identificación del inmueble', 'Matrícula inmobiliaria, dirección, círculo registral y datos catastrales.'],
                ['Propietarios y cadena de tradición', 'Quién es el dueño actual y cómo se ha transferido la propiedad (compraventas, sucesiones, donaciones).'],
                ['Gravámenes y limitaciones', 'Hipotecas, patrimonio de familia, afectación a vivienda familiar, servidumbres y limitaciones al dominio.'],
                ['Medidas cautelares', 'Embargos, demandas, extinción de dominio y otras anotaciones judiciales.'],
                ['Cancelaciones', 'Qué gravámenes o medidas ya fueron cancelados y cuáles siguen vigentes hoy.'],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  <span className="text-[15px] leading-relaxed text-[var(--muted)]"><strong className="text-[var(--foreground)]">{t}:</strong> {d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">¿Para qué sirve?</h2>
            <p className="text-[15.5px] leading-relaxed text-[var(--muted)]">
              Sirve para <strong>verificar la situación jurídica de un inmueble antes de tomar decisiones</strong>: confirmar quién
              es el dueño real, si está libre de hipotecas o embargos, y si existen limitaciones que impidan venderlo o usarlo.
              Es indispensable antes de <strong>comprar, vender, hipotecar o arrendar</strong>, y lo exigen bancos, notarías,
              sucesiones y procesos judiciales. Cualquier comprador prudente lo revisa antes de firmar una promesa de compraventa
              o entregar dinero.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">¿Cómo obtenerlo?</h2>
            <p className="text-[15.5px] leading-relaxed text-[var(--muted)]">
              Hay dos caminos, y aquí te lo contamos con transparencia:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                <p className="text-[15px] font-semibold text-[var(--foreground)]">Portal oficial de la SNR</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">Directamente en el sitio de la Superintendencia. Pagas la tarifa oficial del certificado electrónico y lo descargas tú mismo, según la disponibilidad del portal.</p>
              </div>
              <div className="rounded-2xl border-2 border-[var(--brand)] bg-[var(--brand-50)] p-4">
                <p className="text-[15px] font-semibold text-[var(--brand)]">Con Certitradición (gestión privada)</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">Ingresas la matrícula, pagas de forma segura con Wompi y lo recibes por correo y WhatsApp en minutos, con soporte. El precio incluye la tarifa oficial más el servicio de gestión y la entrega inmediata.</p>
              </div>
            </div>
            <p className="text-[13.5px] leading-relaxed text-[var(--muted-2)]">
              Certitradición es un <strong>intermediario/gestor privado</strong>; no somos el canal oficial de la SNR. Cobramos por
              la gestión, la entrega inmediata y el soporte.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Vigencia: 30 días</h2>
            <p className="text-[15.5px] leading-relaxed text-[var(--muted)]">
              El certificado tiene una <strong>vigencia de 30 días calendario</strong> desde su expedición. Como la situación de un
              inmueble puede cambiar con nuevas anotaciones, bancos y notarías suelen exigir uno reciente. Por eso conviene
              solicitarlo justo cuando lo vas a usar.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Cómo leerlo y verificar su autenticidad</h2>
            <p className="text-[15.5px] leading-relaxed text-[var(--muted)]">
              Entender las anotaciones es clave para no llevarte sorpresas. En nuestra guía{' '}
              <a href="/como-leer-certificado" className="font-semibold text-[var(--brand)] hover:underline">cómo leer un Certificado de Tradición y Libertad</a>{' '}
              explicamos qué significa cada sección y cada tipo de anotación. Para confirmar que un certificado es auténtico, usa el
              <strong> código de verificación</strong> que trae el documento en el portal oficial de la SNR
              (supernotariado.gov.co).
            </p>
          </section>
        </article>

        {/* CTA */}
        <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-50)] p-6 text-center">
          <p className="text-[16px] font-semibold text-[var(--foreground)]">Obtén tu Certificado de Tradición y Libertad</p>
          <p className="mt-1 text-sm text-[var(--muted)]">En línea, a tu correo y WhatsApp en minutos · pago seguro con Wompi.</p>
          <a href="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">
            Generar mi certificado
            <span className="grid size-5 place-items-center rounded-full bg-white/20"><svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </a>
        </div>

        {/* FAQ */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Preguntas frecuentes</h2>
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
              <p className="text-[15px] font-semibold text-[var(--foreground)]">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
            </div>
          ))}
        </section>

        {/* Índice de ciudades (al final, no como cuerpo) */}
        <section className="border-t border-[var(--border)] pt-6">
          <h2 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Certificado de Tradición y Libertad por ciudad</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">Generamos el certificado de inmuebles en toda Colombia. Encuentra tu ciudad:</p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {CIUDADES.map((c) => (
              <li key={c.slug}>
                <a href={`/certificado-tradicion-libertad/${c.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white/60 px-4 py-3 transition-colors hover:border-[var(--brand-ring)] hover:bg-[var(--brand-50)]">
                  <span>
                    <span className="block text-[14.5px] font-semibold text-[var(--foreground)]">{c.ciudad}</span>
                    <span className="block text-xs text-[var(--muted-2)]">{c.departamento}</span>
                  </span>
                  <svg className="size-4 shrink-0 text-[var(--muted-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-xs text-[var(--muted-2)]">
          Servicio de gestión privado — no somos canal oficial de la SNR · <a href="/nosotros" className="font-semibold text-[var(--brand)] hover:underline">Sobre nosotros</a> · Contenido informativo
        </p>
      </main>
    </div>
  );
}
