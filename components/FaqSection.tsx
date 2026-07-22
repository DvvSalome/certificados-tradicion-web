import { FAQS } from '@/lib/site-content';

// Preguntas frecuentes. Compartida por la home (ancla #preguntas-frecuentes) y la página
// /preguntas-frecuentes (sitelink real). Los textos viven en lib/site-content.ts.
export default function FaqSection() {
  return (
    <section id="preguntas-frecuentes" className="scroll-mt-24 bg-white py-16 lg:py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-3xl px-6 flex flex-col gap-10">
        <div className="text-center flex flex-col items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
            Centro de ayuda
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {FAQS.map((item, i) => (
            <article key={item.q} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-7">
              <h3 className="flex gap-3 text-[18px] font-semibold leading-snug tracking-tight text-[var(--foreground)]">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--brand-50)] text-[13px] font-bold text-[var(--brand)]">
                  {i + 1}
                </span>
                {item.q}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
