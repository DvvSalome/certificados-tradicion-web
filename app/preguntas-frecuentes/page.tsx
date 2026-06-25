import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre el Certificado de Tradición y Libertad',
  description:
    'Resolvemos las dudas más comunes sobre el Certificado de Tradición y Libertad (CTL): qué es, para qué sirve, vigencia de 30 días, quién puede pedirlo, cuánto tarda la entrega y cómo validar su autenticidad.',
  alternates: { canonical: '/preguntas-frecuentes' },
};

const FAQS = [
  {
    q: '¿Qué es el Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad (CTL) es el documento oficial que resume la historia jurídica de un inmueble en Colombia. Lo expide la Superintendencia de Notariado y Registro (SNR) a partir del folio de matrícula inmobiliaria y muestra propietarios, hipotecas, embargos y demás anotaciones registradas.',
    extra: [
      'En la práctica funciona como la "hoja de vida" del predio: cada acto jurídico que afecta la propiedad (compraventas, gravámenes, medidas cautelares) queda registrado en él de forma cronológica mediante anotaciones numeradas.',
    ],
  },
  {
    q: '¿Para qué sirve el Certificado de Tradición y Libertad?',
    a: 'Sirve para conocer quién es el dueño real de un inmueble y si tiene cargas que limiten su venta o uso. Es indispensable antes de comprar, vender, hipotecar o arrendar, y suele exigirse en trámites bancarios, notariales, sucesiones y procesos judiciales para verificar la situación jurídica del predio.',
    extra: [
      'Cualquier comprador prudente lo revisa para confirmar que el inmueble esté libre de hipotecas, embargos o limitaciones antes de firmar una promesa de compraventa o entregar dinero.',
    ],
  },
  {
    q: '¿Cuál es la vigencia del Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad tiene una vigencia de 30 días calendario contados desde su fecha de expedición, según los términos de la Superintendencia de Notariado y Registro. Pasado ese plazo, bancos y notarías suelen exigir uno actualizado, porque la situación del inmueble puede cambiar con nuevas anotaciones.',
    extra: [
      'Si tu trámite se extiende más de un mes, lo recomendable es solicitar un certificado nuevo para reflejar el estado más reciente del folio.',
    ],
  },
  {
    q: '¿Quién puede solicitar el Certificado de Tradición y Libertad?',
    a: 'Cualquier persona puede solicitarlo: es un documento público y no se requiere ser el propietario del inmueble ni demostrar interés legítimo. Basta con conocer el folio de matrícula inmobiliaria, o la oficina de registro y los datos del predio, para pedirlo y obtenerlo de forma legal.',
    extra: [
      'Esto permite que compradores, arrendatarios, abogados, inmobiliarias y bancos consulten la situación de un predio antes de hacer cualquier negocio sobre él.',
    ],
  },
  {
    q: '¿Cómo lo pido si no conozco la matrícula inmobiliaria?',
    a: 'Si no tienes la matrícula, puedes ubicarla con la dirección del inmueble o el número predial en la oficina de registro correspondiente a la ciudad o municipio donde está ubicado. En nuestro formulario seleccionas la oficina de registro y, si lo necesitas, te ayudamos a identificar el folio antes de continuar.',
    extra: [
      'La matrícula inmobiliaria suele aparecer en escrituras anteriores, en el recibo del impuesto predial o en certificados previos del mismo predio.',
    ],
  },
  {
    q: '¿Cuánto tarda la entrega del certificado?',
    a: 'La entrega es en minutos. Una vez confirmado el pago, gestionamos la expedición electrónica y te enviamos el Certificado de Tradición y Libertad en formato PDF, normalmente en pocos minutos. Los tiempos pueden variar según la disponibilidad de la plataforma de registro, pero el proceso está pensado para ser inmediato.',
    extra: [
      'Puedes seguir el avance de tu solicitud en la página de estado, que se actualiza automáticamente desde el momento del pago hasta la entrega.',
    ],
  },
  {
    q: '¿Cómo se entrega el Certificado de Tradición y Libertad?',
    a: 'El certificado se entrega en formato PDF por correo electrónico y por WhatsApp, listo para descargar, guardar o imprimir. No tienes que hacer filas ni desplazarte: recibes el documento directamente en tu teléfono o computador apenas se completa la gestión.',
    extra: [
      'El PDF conserva el código de verificación de la Superintendencia de Notariado y Registro, lo que permite validar su autenticidad en cualquier momento.',
    ],
  },
  {
    q: '¿Cómo validar la autenticidad del certificado?',
    a: 'Cada Certificado de Tradición y Libertad incluye un código de verificación expedido por la Superintendencia de Notariado y Registro. Con ese código puedes confirmar la autenticidad del documento directamente en el portal oficial de la SNR (supernotariado.gov.co), comparando que los datos coincidan con el PDF que recibiste.',
    extra: [
      'La validación la realiza la SNR como entidad oficial; nosotros somos un gestor privado que facilita la expedición, no la autoridad que emite ni verifica el documento.',
    ],
  },
  {
    q: '¿Cuánto cuesta el certificado a través de este servicio?',
    a: 'El valor cubre la tarifa del certificado más nuestro servicio de gestión, que incluye entrega en minutos por correo y WhatsApp, soporte y pago 100% seguro con Wompi. El precio total y único aparece siempre antes de pagar, sin suscripciones ni cobros ocultos. Puedes ver el detalle en nuestra página de precio.',
    extra: [
      'La tarifa oficial del certificado electrónico la fija la Superintendencia de Notariado y Registro; sobre ella aplicamos un cargo por la gestión, la inmediatez y el soporte que ofrecemos.',
    ],
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-12 lg:py-16">
        <header className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
            Centro de ayuda
          </span>
          <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--foreground)]">
            Preguntas frecuentes sobre el Certificado de Tradición y Libertad
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
            Aquí resolvemos las dudas más comunes sobre el Certificado de Tradición y Libertad
            (CTL): qué es, para qué sirve, su vigencia, quién puede pedirlo y cómo se entrega.
          </p>
        </header>

        <div className="flex flex-col gap-7">
          {FAQS.map((item, i) => (
            <article
              key={item.q}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-7"
            >
              <h2 className="flex gap-3 text-[19px] font-semibold leading-snug tracking-tight text-[var(--foreground)]">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--brand-50)] text-[13px] font-bold text-[var(--brand)]">
                  {i + 1}
                </span>
                {item.q}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--muted)]">{item.a}</p>
              {item.extra?.map((p) => (
                <p key={p} className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>

        <CtaPanel
          title="¿Listo para obtener tu certificado?"
          text="Solicítalo en línea con tu matrícula inmobiliaria y recíbelo por correo o WhatsApp en minutos."
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
          Registro (SNR); facilitamos el trámite en tu nombre. Puedes validar la autenticidad de tu
          certificado en{' '}
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
