import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo encontrar tu matrícula inmobiliaria',
  description:
    'Guía para encontrar tu matrícula inmobiliaria: qué es, dónde aparece (escritura, recibo del predial, certificados anteriores) y cómo usarla para generar tu Certificado de Tradición y Libertad.',
  alternates: { canonical: '/verificar' },
};

const FUENTES = [
  { t: 'Escritura pública', d: 'En la escritura de compraventa del inmueble aparece el número de matrícula inmobiliaria, normalmente en la primera página o junto a la descripción del predio.' },
  { t: 'Recibo del impuesto predial', d: 'La factura o recibo del predial suele incluir la matrícula inmobiliaria además del número predial o catastral.' },
  { t: 'Un certificado anterior', d: 'Si ya tienes un Certificado de Tradición y Libertad previo, la matrícula está en el encabezado del documento.' },
  { t: 'La oficina de registro', d: 'Cada inmueble está registrado en una Oficina de Registro de Instrumentos Públicos. Necesitas conocer la oficina correspondiente a la ciudad o municipio del predio.' },
];

export default function MatriculaGuiaPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certificado de Tradición</span>
          </a>
          <a href="/" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">
            Solicitar
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10 lg:py-14">
        <div className="flex flex-col gap-3">
          <h1 className="text-[clamp(1.8rem,6vw,2.4rem)] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
            Cómo encontrar tu matrícula inmobiliaria
          </h1>
          <p className="text-[16px] leading-relaxed text-[var(--muted)]">
            La <strong>matrícula inmobiliaria</strong> es el número único que identifica tu inmueble en el folio de
            registro (por ejemplo, <span className="font-mono">050C-95200</span>). Con ella y la oficina de registro
            puedes generar el Certificado de Tradición y Libertad. Aquí te explicamos dónde encontrarla.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">¿Dónde aparece tu matrícula?</h2>
          <ul className="flex flex-col gap-3">
            {FUENTES.map((f) => (
              <li key={f.t} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[var(--brand-50)] text-[var(--brand)]">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--foreground)]">{f.t}</p>
                  <p className="text-sm leading-snug text-[var(--muted)]">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-white/60 p-5">
          <h2 className="mb-2 text-base font-semibold text-[var(--foreground)]">¿Y si no la encuentro?</h2>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            La matrícula es distinta del número catastral o predial. Si solo tienes la dirección del inmueble, puedes
            consultarla con la cédula del propietario en la ventanilla única de registro de la Superintendencia de
            Notariado y Registro. Una vez la tengas, solicitar tu certificado toma menos de un minuto.
          </p>
        </section>

        <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-50)] p-6 text-center">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">¿Ya tienes tu matrícula?</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Genera tu Certificado de Tradición y Libertad en minutos.</p>
          <a href="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">
            Solicitar mi certificado
            <span className="grid size-5 place-items-center rounded-full bg-white/20"><svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </a>
        </div>

        <p className="text-center text-xs text-[var(--muted-2)]">
          Servicio de gestión — no somos canal oficial de la SNR · Contenido informativo
        </p>
      </main>
    </div>
  );
}
