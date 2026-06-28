import { Suspense } from 'react';
import EstadoView from '@/components/EstadoView';
import { SiteHeader } from '@/components/SiteHeader';

export default function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

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
