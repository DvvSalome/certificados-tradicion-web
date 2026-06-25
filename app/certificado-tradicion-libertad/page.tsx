import type { Metadata } from 'next';
import { CIUDADES } from '@/lib/ciudades';

export const metadata: Metadata = {
  title: 'Certificado de Tradición y Libertad por ciudad en Colombia',
  description:
    'Genera el Certificado de Tradición y Libertad de tu inmueble en línea, en cualquier ciudad de Colombia. Bogotá, Medellín, Cali, Barranquilla y más. A tu correo en minutos.',
  alternates: { canonical: '/certificado-tradicion-libertad' },
};

export default function CiudadesIndex() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certificado de Tradición</span>
          </a>
          <a href="/" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar</a>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 lg:py-14">
        <div className="flex flex-col gap-3">
          <h1 className="text-[clamp(1.8rem,6vw,2.4rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
            Certificado de Tradición y Libertad por ciudad
          </h1>
          <p className="text-[16px] leading-relaxed text-[var(--muted)]">
            Generamos el Certificado de Tradición y Libertad de inmuebles en toda Colombia, en línea y a tu correo en
            minutos. Encuentra tu ciudad:
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {CIUDADES.map((c) => (
            <li key={c.slug}>
              <a
                href={`/certificado-tradicion-libertad/${c.slug}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/60 px-4 py-3.5 transition-colors hover:border-[var(--brand-ring)] hover:bg-[var(--brand-50)]"
              >
                <span>
                  <span className="block text-[15px] font-semibold text-[var(--foreground)]">{c.ciudad}</span>
                  <span className="block text-xs text-[var(--muted-2)]">{c.departamento}</span>
                </span>
                <svg className="size-4 shrink-0 text-[var(--muted-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-center text-xs text-[var(--muted-2)]">
          ¿No ves tu ciudad? Igual generamos tu certificado: <a href="/" className="font-semibold text-[var(--brand)]">solicítalo aquí</a> con tu matrícula.
          <br />Servicio de gestión privado — no somos canal oficial de la SNR.
        </p>
      </main>
    </div>
  );
}
