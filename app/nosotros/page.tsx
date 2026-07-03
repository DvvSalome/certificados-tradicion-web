import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/ArticleMeta';

const BASE = 'https://certitradicion.com';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Certitradición es un servicio privado de gestión documental operado por FourG Solutions en Barranquilla, Colombia. Ayudamos a obtener el Certificado de Tradición y Libertad en línea, rápido y seguro.',
  alternates: { canonical: '/nosotros' },
  openGraph: { title: 'Sobre Certitradición | FourG Solutions', description: 'Servicio privado de gestión del Certificado de Tradición y Libertad en Colombia.', url: `${BASE}/nosotros`, type: 'website' },
};

export default function Nosotros() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BASE}/nosotros`,
    name: 'Sobre Certitradición',
    url: `${BASE}/nosotros`,
    mainEntity: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
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
        <nav className="text-xs text-[var(--muted-2)]"><a href="/" className="hover:text-[var(--brand)]">Inicio</a> · <span className="text-[var(--muted)]">Nosotros</span></nav>

        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <h1 className="text-[clamp(1.8rem,5.5vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">Sobre Certitradición</h1>
            <ArticleMeta />
          </header>

          <p className="text-[16px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Certitradición</strong> es un servicio privado de gestión documental
            operado por <strong className="text-[var(--foreground)]">FourG Solutions</strong>, con sede en Barranquilla, Colombia.
            Ayudamos a personas, compradores, asesores inmobiliarios y abogados a obtener el
            <strong> Certificado de Tradición y Libertad</strong> de cualquier inmueble del país de forma 100% en línea, sin filas
            ni desplazamientos.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Qué hacemos</h2>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              Facilitamos la obtención del certificado oficial expedido por la Superintendencia de Notariado y Registro (SNR): el
              usuario ingresa la oficina de registro y la matrícula inmobiliaria, paga de forma segura con Wompi y recibe el
              documento por correo electrónico y WhatsApp, normalmente en cuestión de minutos. En el plan Express, además, entregamos
              un <strong>Estudio de Títulos</strong> con el análisis del inmueble: propietarios, gravámenes y limitaciones vigentes,
              banderas de riesgo, tamizaje de listas restrictivas y un avalúo comercial estimado.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Transparencia</h2>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              Somos un <strong>intermediario/gestor privado</strong>. No somos el canal oficial de la SNR ni una entidad
              gubernamental. El precio que cobramos incluye la tarifa del certificado electrónico ante la SNR, más nuestro servicio de
              gestión, la entrega inmediata y el soporte. El certificado que entregamos es el documento oficial, con su código de
              verificación de la SNR.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Nuestra política editorial</h2>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              El contenido informativo de este sitio (guías y explicaciones) busca ayudarte a entender el certificado y la situación
              jurídica de un inmueble. Es información general, no asesoría legal: para decisiones importantes recomendamos consultar a
              un abogado. Revisamos y actualizamos nuestras guías periódicamente para reflejar la normativa vigente.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Contacto y sede</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-5">
              <dl className="flex flex-col gap-2 text-[14.5px]">
                <div className="flex gap-2"><dt className="w-24 shrink-0 text-[var(--muted-2)]">Operado por</dt><dd className="font-medium text-[var(--foreground)]">FourG Solutions</dd></div>
                <div className="flex gap-2"><dt className="w-24 shrink-0 text-[var(--muted-2)]">Dirección</dt><dd className="font-medium text-[var(--foreground)]">Calle 80 B #42 D, Barranquilla, Atlántico, Colombia</dd></div>
                <div className="flex gap-2"><dt className="w-24 shrink-0 text-[var(--muted-2)]">Correo</dt><dd className="font-medium"><a href="mailto:certificados@certitradicion.com" className="text-[var(--brand)] hover:underline">certificados@certitradicion.com</a></dd></div>
                <div className="flex gap-2"><dt className="w-24 shrink-0 text-[var(--muted-2)]">WhatsApp</dt><dd className="font-medium"><a href="https://wa.me/573212258245" className="text-[var(--brand)] hover:underline">+57 321 225 8245</a></dd></div>
              </dl>
            </div>
          </section>
        </article>

        <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-50)] p-6 text-center">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">¿Listo para obtener tu certificado?</p>
          <a href="/" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar ahora</a>
        </div>

        <p className="text-center text-xs text-[var(--muted-2)]">Certitradición · operado por FourG Solutions · Barranquilla, Colombia</p>
      </main>
    </div>
  );
}
