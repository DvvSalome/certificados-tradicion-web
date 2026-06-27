import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: '¿Cuánto cuesta un Certificado de Tradición y Libertad en 2026?',
  description:
    'Precio del Certificado de Tradición y Libertad en 2026: servicio de gestión con entrega en minutos por correo y WhatsApp, soporte humano y pago seguro. Precio único, todo incluido, sin cobros ocultos.',
  alternates: { canonical: '/precio' },
};

const COMPARISON = [
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
            ¿Cuánto cuesta un Certificado de Tradición y Libertad?
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
            Nuestro servicio de gestión tiene un{' '}
            <strong className="text-[var(--foreground)]">precio único de $39.800</strong>, todo incluido:
            la gestión completa del trámite, la entrega en minutos por correo y WhatsApp, el soporte humano
            y el pago 100% seguro con Wompi. Sin suscripciones ni cobros ocultos.
          </p>
          <p className="text-sm font-medium text-[var(--muted-2)]">Actualizado: junio 2026</p>
        </header>

        {/* Price card */}
        <section className="flex justify-center">
          <article className="relative flex w-full max-w-md flex-col gap-3 rounded-2xl border-2 border-[var(--brand)] bg-[var(--brand-50)] p-6 shadow-sm">
            <span className="absolute -top-3 left-6 rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
              Precio único
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
              Servicio de gestión Certitradición
            </p>
            <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              $39.800
              <span className="ml-2 align-middle text-sm font-medium text-[var(--muted)]">todo incluido</span>
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              Incluye la gestión completa, entrega en minutos por correo y WhatsApp, soporte humano y
              pago 100% seguro con Wompi. Precio único, sin suscripciones ni cobros ocultos.
            </p>
          </article>
        </section>

        {/* Comparison table */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Hacerlo por tu cuenta vs. nuestro servicio
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
            El documento es el mismo certificado oficial. La diferencia está en la inmediatez, el
            acompañamiento y la comodidad. Esta es la comparación punto por punto:
          </p>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#fafbfd]">
                  <th className="px-4 py-3.5 font-semibold text-[var(--foreground)] sm:px-5">
                    Característica
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--muted)] sm:px-5">
                    Portal oficial (autogestión)
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--brand)] sm:px-5">
                    Nuestro servicio
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? 'bg-[#fafbfd]' : undefined}>
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
            <strong className="text-[var(--accent)]">Transparencia:</strong> el certificado que entregamos
            es el mismo documento oficial de la Superintendencia de Notariado y Registro. Nuestro precio
            corresponde al servicio de gestión: la inmediatez, el acompañamiento y el pago seguro.
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
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </section>
  );
}
