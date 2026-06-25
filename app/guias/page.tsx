import type { Metadata } from 'next';
import { GUIAS } from '@/lib/guias';

export const metadata: Metadata = {
  title: 'Guías del Certificado de Tradición y Libertad',
  description:
    'Aprende a leer tu Certificado de Tradición y Libertad: embargos, hipotecas, falsa tradición, patrimonio de familia y más. Guías claras para comprar o vender seguro en Colombia.',
  alternates: { canonical: '/guias' },
};

export default function GuiasIndex() {
  return (
    <div className="min-h-screen">
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
        <div className="flex flex-col gap-3">
          <h1 className="text-[clamp(1.8rem,6vw,2.4rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
            Guías del Certificado de Tradición y Libertad
          </h1>
          <p className="text-[16px] leading-relaxed text-[var(--muted)]">
            Entender tu certificado es clave para comprar o vender seguro. Aquí explicamos cada anotación y concepto, en
            términos claros.
          </p>
        </div>

        <a href="/como-leer-certificado" className="rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-50)] p-5 transition-colors hover:border-[var(--brand-ring)]">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">Empieza aquí</span>
          <p className="mt-1 text-[16px] font-semibold text-[var(--foreground)]">Cómo leer un Certificado de Tradición y Libertad →</p>
          <p className="text-sm text-[var(--muted)]">La guía completa, sección por sección.</p>
        </a>

        <ul className="flex flex-col gap-3">
          {GUIAS.map((g) => (
            <li key={g.slug}>
              <a href={`/guias/${g.slug}`} className="block rounded-2xl border border-[var(--border)] bg-white/60 p-4 transition-colors hover:border-[var(--brand-ring)] hover:bg-[var(--brand-50)]">
                <p className="text-[15px] font-semibold text-[var(--foreground)]">{g.tema}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-[var(--muted)]">{g.metaDescription}</p>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-center text-xs text-[var(--muted-2)]">Servicio de gestión privado — no somos canal oficial de la SNR · Contenido informativo</p>
      </main>
    </div>
  );
}
