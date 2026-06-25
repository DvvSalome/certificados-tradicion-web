import { Suspense } from 'react';
import EstadoView from '@/components/EstadoView';

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5 px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
              Certificado de Tradición
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-7 px-5 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Estado de tu solicitud
          </h1>
          <p className="text-[15px] text-[var(--muted)]">
            Esta página se actualiza automáticamente. Puedes mantenerla abierta.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-5 py-6 text-[var(--muted)] shadow-sm">
              <span
                aria-hidden="true"
                className="size-5 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--brand)]"
                style={{ animation: 'ctl-spin 0.7s linear infinite' }}
              />
              Cargando…
            </div>
          }
        >
          <EstadoView />
        </Suspense>

        <p className="text-center text-xs text-[var(--muted-2)]">
          Servicio de gestión — no somos canal oficial de la SNR · Pago seguro Wompi
        </p>
      </main>
    </div>
  );
}
