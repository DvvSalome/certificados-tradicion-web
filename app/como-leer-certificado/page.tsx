import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo leer un Certificado de Tradición y Libertad: guía 2026',
  description:
    'Guía didáctica para leer un Certificado de Tradición y Libertad en Colombia: qué significa la matrícula inmobiliaria, los propietarios y la tradición, y anotaciones como hipoteca, embargo, patrimonio de familia, afectación a vivienda familiar y falsa tradición.',
  alternates: { canonical: '/como-leer-certificado' },
};

const STEPS = [
  {
    n: '1',
    t: 'Verifica el encabezado y la matrícula',
    d: 'Confirma el número de matrícula inmobiliaria, la oficina de registro, la dirección y la descripción del inmueble.',
  },
  {
    n: '2',
    t: 'Identifica al propietario actual',
    d: 'Revisa la tradición para saber quién es el último dueño y cómo adquirió el predio.',
  },
  {
    n: '3',
    t: 'Lee las anotaciones de gravámenes y limitaciones',
    d: 'Busca hipotecas, embargos, patrimonio de familia u otras medidas vigentes o canceladas.',
  },
];

const SECTIONS = [
  {
    id: 'matricula-inmobiliaria',
    q: '¿Qué es la matrícula inmobiliaria?',
    a: 'La matrícula inmobiliaria es el número único que identifica a cada inmueble en el registro de la propiedad de Colombia. Aparece en el encabezado del certificado, junto a la oficina de registro y la descripción del predio. Funciona como la "cédula" del inmueble: ningún otro predio tiene la misma matrícula.',
  },
  {
    id: 'propietarios-tradicion',
    q: '¿Qué son los propietarios y la tradición?',
    a: 'La tradición es la cadena de transferencias de la propiedad a lo largo del tiempo: muestra quién le vendió a quién y mediante qué acto (escritura, sentencia, adjudicación). El propietario actual es el que figura en la última anotación de transferencia vigente. Leer la tradición permite confirmar que la cadena de dueños esté completa y sin saltos.',
  },
  {
    id: 'hipoteca',
    q: '¿Qué significa una hipoteca en el certificado?',
    a: 'Una hipoteca es una garantía que el dueño otorga sobre el inmueble, normalmente a favor de un banco, para respaldar un crédito. Mientras esté vigente, el predio responde por esa deuda y no puede venderse libremente sin gestionarla. En el certificado aparece como una anotación con el acreedor, el monto y la fecha de constitución.',
  },
  {
    id: 'embargo',
    q: '¿Qué significa un embargo?',
    a: 'Un embargo es una medida cautelar ordenada por un juez o una entidad que impide vender o transferir el inmueble mientras se resuelve una deuda o un proceso. Es una de las anotaciones más importantes de revisar: un predio embargado no puede negociarse libremente y comprarlo así implica un riesgo serio para el comprador.',
  },
  {
    id: 'patrimonio-de-familia',
    q: '¿Qué es el patrimonio de familia?',
    a: 'El patrimonio de familia es una figura que protege la vivienda al hacerla inembargable frente a deudas posteriores a su constitución, en beneficio de la familia. Cuando aparece en el certificado, indica que el inmueble tiene una protección legal especial y que cualquier acto de disposición debe respetar esa afectación mientras esté vigente.',
  },
  {
    id: 'afectacion-vivienda-familiar',
    q: '¿Qué es la afectación a vivienda familiar?',
    a: 'La afectación a vivienda familiar es una limitación que exige el consentimiento de ambos cónyuges o compañeros permanentes para vender, hipotecar o gravar el inmueble. Protege a la familia frente a actos unilaterales. Si el certificado la registra, el predio no puede transferirse ni hipotecarse sin la firma de las dos partes.',
  },
  {
    id: 'falsa-tradicion',
    q: '¿Qué es la falsa tradición?',
    a: 'La falsa tradición ocurre cuando alguien transfiere un derecho que en realidad no tiene de forma plena, por ejemplo la venta de "derechos y acciones" o de un predio sin título de propiedad completo. En el certificado se anota expresamente como falsa tradición y advierte que el vendedor no transfiere el dominio pleno, lo que exige mucha cautela.',
  },
  {
    id: 'cancelacion-de-hipoteca',
    q: '¿Qué es la cancelación de hipoteca?',
    a: 'La cancelación de hipoteca es la anotación que deja constancia de que una hipoteca anterior quedó extinguida, normalmente porque el crédito se pagó. Es una buena señal: indica que ese gravamen ya no afecta al inmueble. Conviene verificar que cada hipoteca registrada tenga su correspondiente anotación de cancelación si ya no debe estar vigente.',
  },
];

export default function ComoLeerCertificadoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-12 lg:py-16">
        <header className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
            Guía práctica
          </span>
          <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--foreground)]">
            Cómo leer un Certificado de Tradición y Libertad
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
            El Certificado de Tradición y Libertad (CTL) resume toda la historia jurídica de un
            inmueble mediante anotaciones numeradas. En esta guía te explicamos, en lenguaje claro,
            qué significa cada parte y las anotaciones más comunes que vas a encontrar.
          </p>
        </header>

        {/* HowTo quick steps */}
        <section className="rounded-2xl border border-[var(--border)] bg-white/60 p-6 sm:p-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
            Léelo en 3 pasos
          </p>
          <ol className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-[var(--brand-50)] text-sm font-bold text-[var(--brand)]">
                  {s.n}
                </span>
                <p className="text-[15px] font-semibold leading-snug text-[var(--foreground)]">
                  {s.t}
                </p>
                <p className="text-[13.5px] leading-snug text-[var(--muted)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Annotation glossary */}
        <section className="flex flex-col gap-7">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Las anotaciones más comunes, explicadas
          </h2>
          {SECTIONS.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-7"
            >
              <h2 className="text-[19px] font-semibold leading-snug tracking-tight text-[var(--foreground)]">
                {item.q}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--muted)]">{item.a}</p>
            </article>
          ))}
        </section>

        <p className="rounded-2xl border border-[var(--border)] bg-[var(--accent-50)] px-5 py-4 text-[14px] leading-relaxed text-[var(--muted)]">
          <strong className="text-[var(--accent)]">Consejo:</strong> ante anotaciones de embargo,
          falsa tradición o hipotecas vigentes, consulta con un abogado o un asesor inmobiliario
          antes de comprar. Esta guía es informativa y no constituye asesoría jurídica.
        </p>

        <CtaPanel
          title="¿Necesitas el certificado para revisarlo?"
          text="Solicítalo en línea con tu matrícula inmobiliaria y recíbelo en minutos por correo y WhatsApp."
        />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Shared layout (consistent with the rest of the site) ── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
        <a href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm"
          >
            <ShieldIcon className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
              Certificado de Tradición
            </p>
            <p className="text-[11px] font-medium text-[var(--muted-2)]">Gestión en línea · Colombia</p>
          </div>
        </a>
        <a
          href="/"
          className="hidden rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)] sm:inline-flex"
        >
          Solicitar certificado
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-1.5 px-5 py-7 text-center text-xs leading-relaxed text-[var(--muted-2)]">
        <p>Pago seguro procesado por Wompi · Entrega por correo y WhatsApp</p>
        <p className="max-w-xl">
          Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y
          Registro (SNR); facilitamos el trámite en tu nombre. Puedes consultar fuentes oficiales en{' '}
          <a
            href="https://www.supernotariado.gov.co"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-medium text-[var(--brand)] underline underline-offset-2"
          >
            supernotariado.gov.co
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

function CtaPanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--brand-50)] p-7 text-center shadow-sm sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">{text}</p>
      <a
        href="/"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)]"
      >
        Solicitar mi certificado
        <ArrowIcon className="size-4" />
      </a>
    </section>
  );
}

/* ── Inline icons (no external deps) ── */

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
