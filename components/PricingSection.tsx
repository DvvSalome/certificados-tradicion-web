import { PLANS, formatCOP, type PlanId } from '@/lib/config';
import { COMPARISON } from '@/lib/site-content';

// Sección de planes + comparativa vs portal oficial. Compartida por la home (ancla #precio)
// y la página /precio (sitelink real). Un solo lugar para tocar precios/beneficios.
export default function PricingSection() {
  return (
    <section id="precio" className="scroll-mt-24 bg-[var(--background)] py-16 lg:py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-6 flex flex-col gap-10 items-center text-center">
        <div className="flex flex-col gap-4 items-center">
          <span className="inline-flex items-center rounded-full border border-[var(--brand-ring)] bg-[var(--brand-50)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">
            Precios 2026
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            ¿Qué plan necesitas?
          </h2>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
            Elige el nivel de servicio que mejor se adapte a ti. Todos nuestros planes incluyen la gestión, expedición y entrega del documento oficial.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl text-left">
          {(['basico', 'express', 'avanzado'] as PlanId[]).map((pid) => {
            const p = PLANS[pid];
            return (
              <div key={pid} className={`relative flex flex-col items-start rounded-3xl border-2 p-6 sm:p-7 transition-all ${
                p.recommended
                  ? 'border-[var(--brand)] bg-[var(--brand-50)] shadow-md'
                  : pid === 'avanzado'
                    ? 'border-[var(--brand)]/35 bg-white shadow-sm'
                    : 'border-[var(--border)] bg-white'
              }`}>
                {p.recommended ? (
                  <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-4 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-sm">
                    RECOMENDADO
                  </span>
                ) : pid === 'avanzado' ? (
                  <span className="absolute -top-3 right-6 rounded-full bg-[var(--brand)] px-4 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-sm">
                    MÁS COMPLETO
                  </span>
                ) : null}

                <p className={`text-xs font-bold uppercase tracking-wide ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted-2)]'}`}>
                  Plan {p.label}
                </p>
                <p className="mt-2 text-[15px] font-medium text-[var(--muted)] min-h-[44px]">
                  {p.tagline}
                </p>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                  {formatCOP(p.priceCop)}
                </p>

                <div className="mt-6 flex flex-col gap-3 w-full border-t border-black/5 pt-6">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <svg className={`mt-0.5 size-4 shrink-0 ${p.recommended ? 'text-[var(--brand)]' : 'text-[var(--muted-2)]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      <span className="text-[14px] leading-snug text-[var(--muted)]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full mt-4 text-left overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full border-collapse text-[14.5px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                <th className="px-4 py-3.5 font-semibold text-[var(--foreground)]">Característica</th>
                <th className="px-4 py-3.5 font-semibold text-[var(--muted)] hidden sm:table-cell">Portal oficial</th>
                <th className="px-4 py-3.5 font-semibold text-[var(--brand)]">Nuestro servicio</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 1 ? 'bg-gray-50' : undefined}>
                  <td className="px-4 py-3.5 font-medium text-[var(--foreground)]">{row.feature}</td>
                  <td className="px-4 py-3.5 text-[var(--muted)] hidden sm:table-cell">{row.official}</td>
                  <td className="px-4 py-3.5 text-[var(--foreground)] font-medium">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
