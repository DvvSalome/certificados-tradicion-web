'use client';

import { PLANS, formatCOP, type PlanId } from '@/lib/config';
import PlanTagline from '@/components/PlanTagline';

// Los 3 planes visibles DE UNA en el hero (antes solo se veía el Básico y los otros dos
// aparecían al final del checkout). Elegir uno preselecciona el plan en el formulario
// (evento cz-plan que CheckoutForm escucha) y baja a #comprar.
export default function HeroPlans() {
  const elegir = (pid: PlanId) => {
    window.dispatchEvent(new CustomEvent('cz-plan', { detail: pid }));
    document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section aria-label="Planes" className="mx-auto w-full max-w-6xl px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(['basico', 'express', 'avanzado'] as PlanId[]).map((pid) => {
          const p = PLANS[pid];
          return (
            <button
              key={pid}
              type="button"
              onClick={() => elegir(pid)}
              className={`group relative flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                p.recommended
                  ? 'border-[var(--brand)] bg-[var(--brand-50)] shadow-md'
                  : 'border-[var(--border)] bg-white shadow-sm hover:border-[var(--brand-ring)]'
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm">
                  RECOMENDADO
                </span>
              )}
              <p className={`text-[11px] font-bold uppercase tracking-wide ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted-2)]'}`}>
                Certi {p.label}
              </p>
              <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                {formatCOP(p.priceCop)}
              </p>
              <p className="mt-1 min-h-[36px] text-[12.5px] leading-snug text-[var(--muted)]"><PlanTagline text={p.tagline} /></p>
              <span className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted)]'} group-hover:text-[var(--brand)]`}>
                Elegir este plan
                <svg className="size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
