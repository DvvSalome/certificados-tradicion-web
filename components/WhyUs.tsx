// Sección "¿Por qué obtener tu certificado ... con nosotros?" — beneficios en tarjetas.
// Contenido rico y semántico (h2/h3 + texto por entidad) que ayuda al GEO/SEO: los
// motores de IA citan estos bloques auto-contenidos. Server component (estático).

import type { ReactNode } from 'react';

type Benefit = { t: string; d: string; icon: ReactNode };

const I = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    {paths}
  </svg>
);

const BENEFITS: Benefit[] = [
  {
    t: 'Rapidez',
    d: 'Te ayudamos a sacar tu certificado de libertad, en pocos minutos, entregado a tu correo.',
    icon: I(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  },
  {
    t: 'Certificado actualizado',
    d: 'Tu certificado de tradición y libertad con la información más reciente, directamente desde el supernotariado y registro.',
    icon: I(<><path d="M12 2 4 5v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V5l-8-3z" /><path d="m9 12 2 2 4-4" /></>),
  },
  {
    t: 'Análisis de anotaciones',
    d: 'Interpretación de anotaciones registradas sobre el certificado de tradición y libertad.',
    icon: I(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>),
  },
  {
    t: 'Análisis de gravámenes',
    d: 'Identificación de cargas, deudas o gravámenes que puedan afectar la propiedad.',
    icon: I(<><path d="M12 3v18M8 21h8M6 7h12" /><path d="M6 7l-3 6a3 3 0 0 0 6 0L6 7zM18 7l-3 6a3 3 0 0 0 6 0L18 7z" /></>),
  },
  {
    t: 'Histórico de transacciones',
    d: 'Registro detallado de todas las transferencias y movimientos legales del inmueble.',
    icon: I(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>),
  },
  {
    t: 'Resumen legal del inmueble',
    d: 'Síntesis clara y comprensible del estado jurídico actual de la propiedad.',
    icon: I(<><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /><path d="M9 13h6M9 17h4" /></>),
  },
];

export default function WhyUs() {
  return (
    <section id="por-que-nosotros" className="border-t border-[var(--border)] bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
            ¿Por qué obtener tu certificado de tradición y libertad con{' '}
            <span className="rounded-lg bg-[var(--brand)] px-2 py-0.5 text-white">nosotros</span>?
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
            Ofrecemos la forma más sencilla y segura de adquirir tu Certificado de Tradición directamente desde la oficina de supernotariado y registro.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.t}
              className="cz-reveal flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)] text-white">
                {b.icon}
              </span>
              <h3 className="text-lg font-bold text-[var(--foreground)]">{b.t}</h3>
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
