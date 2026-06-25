import CheckoutForm from '@/components/CheckoutForm';
import { PRICE_COP, formatCOP } from '@/lib/config';

export default function Home() {
  const priceLabel = formatCOP(PRICE_COP);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
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
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-[var(--accent-50)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] sm:inline-flex">
            <LockIcon className="size-3.5" />
            Pago 100% seguro
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-16">
        {/* Left: value proposition */}
        <section className="flex flex-col gap-7 lg:pt-2">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
              </span>
              Documento oficial de la SNR
            </span>

            <h1 className="text-[clamp(2rem,7vw,2.9rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--foreground)]">
              Tu Certificado de Tradición y Libertad,{' '}
              <span className="text-[var(--brand)]">en minutos.</span>
            </h1>

            <p className="max-w-md text-[17px] leading-relaxed text-[var(--muted)]">
              Solicítalo en línea con tu matrícula inmobiliaria y recíbelo por correo o WhatsApp.
              Rápido, seguro y sin filas.
            </p>
          </div>

          {/* Trust bullets */}
          <ul className="flex flex-col gap-3.5">
            {[
              { t: 'Entrega por correo y WhatsApp', d: 'Lo recibes en formato PDF, listo para descargar e imprimir.' },
              { t: 'Validez de 30 días', d: 'Vigencia legal según los términos de la Superintendencia de Notariado y Registro.' },
              { t: 'Pago protegido por Wompi', d: 'Tus datos viajan cifrados. No almacenamos tu información de pago.' },
            ].map((f) => (
              <li key={f.t} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-50)] text-[var(--accent)]"
                >
                  <CheckIcon className="size-3.5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--foreground)]">{f.t}</p>
                  <p className="text-sm leading-snug text-[var(--muted)]">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Steps */}
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Cómo funciona
            </p>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                { n: '1', t: 'Ingresa los datos', d: 'Oficina y matrícula.' },
                { n: '2', t: 'Paga seguro', d: 'Con tarjeta o PSE vía Wompi.' },
                { n: '3', t: 'Recíbelo', d: 'En tu correo o WhatsApp.' },
              ].map((s) => (
                <li key={s.n} className="flex flex-col gap-1.5">
                  <span className="grid size-7 place-items-center rounded-full bg-[var(--brand-50)] text-sm font-bold text-[var(--brand)]">
                    {s.n}
                  </span>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{s.t}</p>
                  <p className="text-xs leading-snug text-[var(--muted)]">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Right: checkout card */}
        <section className="lg:pt-2">
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_12px_40px_-12px_rgba(13,27,42,0.18)]">
              {/* Price header */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--brand-50)] px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                    Solicitud de certificado
                  </p>
                  <p className="text-sm text-[var(--muted)]">Pago único · sin suscripciones</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{priceLabel}</p>
                  <p className="text-[11px] font-medium text-[var(--muted-2)]">IVA incluido</p>
                </div>
              </div>

              <div className="p-6">
                <CheckoutForm priceLabel={priceLabel} />
              </div>

              {/* Reassurance strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[var(--border)] bg-[#fafbfd] px-6 py-4 text-xs font-medium text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <LockIcon className="size-3.5 text-[var(--accent)]" /> Cifrado SSL
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldIcon className="size-3.5 text-[var(--accent)]" /> Pago seguro Wompi
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="size-3.5 text-[var(--accent)]" /> Entrega rápida
                </span>
              </div>
            </div>

            <p className="mt-4 px-1 text-center text-xs leading-relaxed text-[var(--muted-2)]">
              Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y
              Registro (SNR); facilitamos el trámite en tu nombre.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-6 text-center text-xs text-[var(--muted-2)]">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-medium text-[var(--muted)]">
            <a href="/preguntas-frecuentes" className="hover:text-[var(--brand)]">Preguntas frecuentes</a>
            <a href="/precio" className="hover:text-[var(--brand)]">¿Cuánto cuesta?</a>
            <a href="/como-leer-certificado" className="hover:text-[var(--brand)]">Cómo leer tu certificado</a>
          </nav>
          <p>Pago seguro procesado por Wompi · Entrega por correo y WhatsApp</p>
          <p>Servicio de gestión — no somos canal oficial de la SNR</p>
        </div>
      </footer>
    </div>
  );
}

/* — Inline icons (no external deps) — */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
