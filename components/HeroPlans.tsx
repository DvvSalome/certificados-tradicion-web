'use client';

import { PLANS, formatCOP, type PlanId } from '@/lib/config';
import PlanTagline, { PlanFeature } from '@/components/PlanTagline';
import PlanIcon from '@/components/PlanIcon';
import { track } from '@/lib/track';

// Los 3 planes visibles DE UNA en el hero (antes solo se veía el Básico y los otros dos
// aparecían al final del checkout). Elegir uno preselecciona el plan en el formulario
// (evento cz-plan que CheckoutForm escucha) y baja a #comprar.
export default function HeroPlans() {
  const elegir = (pid: PlanId) => {
    track('plan_click', { plan: pid });
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
              className={`group relative flex h-full flex-col items-start rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
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
              <span className="flex items-center gap-2.5">
                <PlanIcon plan={pid} size={30} />
                <span className={`text-[11px] font-bold uppercase tracking-wide ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted-2)]'}`}>
                  {p.label}
                </span>
              </span>
              <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                {formatCOP(p.priceCop)}
              </p>
              <p className="mt-1 min-h-[36px] text-[12.5px] leading-snug text-[var(--muted)]"><PlanTagline text={p.tagline} /></p>

              {/* Qué incluye. El copy sale de PLANS[].features (lib/config.ts), que es la MISMA
                  lista que ve el checkout: si cambia el producto, cambia en un solo lugar.
                  Antes el hero solo mostraba el tagline y el visitante elegía plan sin saber
                  qué se llevaba. */}
              <ul className="mt-3 w-full space-y-1.5 border-t border-[var(--border)] pt-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11.5px] leading-[1.45] text-[var(--muted)]">
                    <svg
                      className={`mt-[3px] size-3 shrink-0 ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted-2)]'}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span><PlanFeature text={f} /></span>
                  </li>
                ))}
              </ul>

              {/* mt-auto: los planes tienen 3 y 5 items, así los tres botones quedan a la misma altura. */}
              <span className={`mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-bold ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted)]'} group-hover:text-[var(--brand)]`}>
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
