import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Cuánto cuesta un Certificado de Tradición y Libertad en 2026?',
  description:
    'Precio del Certificado de Tradición y Libertad en 2026: tarifa oficial del certificado electrónico ($23.000) frente al servicio de gestión con entrega en minutos por correo y WhatsApp, soporte y pago seguro. Tabla comparativa actualizada.',
  alternates: { canonical: '/precio' },
};

const COMPARISON = [
  {
    feature: 'Valor de referencia',
    official: '$23.000 (electrónico)',
    us: '$39.900 todo incluido',
  },
  {
    feature: 'Entrega',
    official: 'Según disponibilidad del portal',
    us: 'En minutos, garantizada',
  },
  {
    feature: 'Canales de envío',
    official: 'Descarga en el portal',
    us: 'Correo electrónico y WhatsApp',
  },
  {
    feature: 'Soporte y acompañamiento',
    official: 'Autogestión, sin asesoría',
    us: 'Soporte humano durante el trámite',
  },
  {
    feature: 'Pago',
    official: 'Pasarela oficial',
    us: 'Pago seguro con Wompi (tarjeta/PSE)',
  },
  {
    feature: 'Ayuda si no conoces la matrícula',
    official: 'No incluida',
    us: 'Te ayudamos a ubicarla',
  },
];

export default function PrecioPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-12 lg:py-16">
        <header className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
            Precios 2026
          </span>
          <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--foreground)]">
            ¿Cuánto cuesta un Certificado de Tradición y Libertad en 2026?
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
            En 2026, la tarifa oficial del Certificado de Tradición y Libertad electrónico es de
            aproximadamente <strong className="text-[var(--foreground)]">$23.000</strong>, valor que
            fija la Superintendencia de Notariado y Registro (SNR). A ese costo base, un servicio de
            gestión como el nuestro suma la entrega inmediata, el soporte y el pago seguro.
          </p>
          <p className="text-sm font-medium text-[var(--muted-2)]">Actualizado: junio 2026</p>
        </header>

        {/* Price cards */}
        <section className="grid gap-5 sm:grid-cols-2">
          <article className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Tarifa oficial (autogestión)
            </p>
            <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              $23.000
              <span className="ml-2 align-middle text-sm font-medium text-[var(--muted)]">
                electrónico
              </span>
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              Es el valor de referencia que cobra el portal oficial de la SNR por el certificado
              electrónico. Implica gestionarlo tú mismo, sin acompañamiento ni entrega asistida.
            </p>
          </article>

          <article className="relative flex flex-col gap-3 rounded-2xl border-2 border-[var(--brand)] bg-[var(--brand-50)] p-6 shadow-sm">
            <span className="absolute -top-3 left-6 rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
              Recomendado
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
              Servicio de gestión Certitradición
            </p>
            <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              $39.900
              <span className="ml-2 align-middle text-sm font-medium text-[var(--muted)]">
                todo incluido
              </span>
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              Incluye la gestión completa, entrega en minutos por correo y WhatsApp, soporte humano
              y pago 100% seguro con Wompi. Precio único, sin suscripciones ni cobros ocultos.
            </p>
          </article>
        </section>

        {/* Comparison table */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Tarifa oficial vs. servicio de gestión
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
            La diferencia de precio no está en el documento —es el mismo certificado oficial— sino
            en la inmediatez, el acompañamiento y la comodidad. Esta es la comparación punto por
            punto:
          </p>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#fafbfd]">
                  <th className="px-4 py-3.5 font-semibold text-[var(--foreground)] sm:px-5">
                    Característica
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--muted)] sm:px-5">
                    Portal oficial
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--brand)] sm:px-5">
                    Nuestro servicio
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 1 ? 'bg-[#fafbfd]' : undefined}
                  >
                    <td className="px-4 py-3.5 font-medium text-[var(--foreground)] sm:px-5">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--muted)] sm:px-5">{row.official}</td>
                    <td className="px-4 py-3.5 text-[var(--foreground)] sm:px-5">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="rounded-2xl border border-[var(--border)] bg-[var(--accent-50)] px-5 py-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--accent)]">Transparencia:</strong> el certificado que
            entregamos es el mismo documento oficial de la Superintendencia de Notariado y Registro.
            Lo que pagas de más respecto a la tarifa oficial corresponde exclusivamente al servicio
            de gestión, la inmediatez y el soporte.
          </p>
        </section>

        <CtaPanel
          title="Obtén tu certificado sin filas ni esperas"
          text="Ingresa tu matrícula inmobiliaria, paga seguro con Wompi y recíbelo en minutos por correo y WhatsApp."
        />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Shared layout (consistent with the rest of the site) ── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
        <a href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm"
          >
            <ShieldIcon className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
              Certificado de Tradición
            </p>
            <p className="text-[11px] font-medium text-[var(--muted-2)]">Gestión en línea · Colombia</p>
          </div>
        </a>
        <a
          href="/"
          className="hidden rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)] sm:inline-flex"
        >
          Solicitar certificado
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-1.5 px-5 py-7 text-center text-xs leading-relaxed text-[var(--muted-2)]">
        <p>Pago seguro procesado por Wompi · Entrega por correo y WhatsApp</p>
        <p className="max-w-xl">
          Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y
          Registro (SNR); facilitamos el trámite en tu nombre. La tarifa oficial la define la SNR en{' '}
          <a
            href="https://www.supernotariado.gov.co"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-medium text-[var(--brand)] underline underline-offset-2"
          >
            supernotariado.gov.co
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

function CtaPanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--brand-50)] p-7 text-center shadow-sm sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">{text}</p>
      <a
        href="/"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)]"
      >
        Solicitar mi certificado
        <ArrowIcon className="size-4" />
      </a>
    </section>
  );
}

/* ── Inline icons (no external deps) ── */

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
