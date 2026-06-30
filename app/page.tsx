import CheckoutForm from '@/components/CheckoutForm';
import SiteFooter from '@/components/SiteFooter';
import { Seal, WompiLogo } from '@/components/Brand';
import VideoPlayer from '@/components/VideoPlayer';
import AnimatedCertificate from '@/components/AnimatedCertificate';
import { RotatingTail } from '@/components/RotatingTail';
import { PLANS, formatCOP, type PlanId } from '@/lib/config';

const COMPARISON = [
  { feature: 'Entrega', official: 'Según disponibilidad del portal', us: 'En minutos, garantizada' },
  { feature: 'Canales de envío', official: 'Descarga en el portal', us: 'Correo electrónico y WhatsApp' },
  { feature: 'Soporte y acompañamiento', official: 'Autogestión, sin asesoría', us: 'Soporte humano durante el trámite' },
  { feature: 'Pago', official: 'Pasarela oficial', us: 'Pago seguro con Wompi (tarjeta/PSE)' },
  { feature: 'Ayuda si no conoces la matrícula', official: 'No incluida', us: 'Te ayudamos a ubicarla' },
];

const FAQS = [
  {
    q: '¿Qué es el Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad (CTL) es el documento oficial que resume la historia jurídica de un inmueble en Colombia. Lo expide la Superintendencia de Notariado y Registro (SNR) a partir del folio de matrícula inmobiliaria y muestra propietarios, hipotecas, embargos y demás anotaciones registradas.',
    extra: ['En la práctica funciona como la "hoja de vida" del predio: cada acto jurídico que afecta la propiedad (compraventas, gravámenes, medidas cautelares) queda registrado en él de forma cronológica mediante anotaciones numeradas.'],
  },
  {
    q: '¿Para qué sirve el Certificado de Tradición y Libertad?',
    a: 'Sirve para conocer quién es el dueño real de un inmueble y si tiene cargas que limiten su venta o uso. Es indispensable antes de comprar, vender, hipotecar o arrendar, y suele exigirse en trámites bancarios, notariales, sucesiones y procesos judiciales para verificar la situación jurídica del predio.',
    extra: ['Cualquier comprador prudente lo revisa para confirmar que el inmueble esté libre de hipotecas, embargos o limitaciones antes de firmar una promesa de compraventa o entregar dinero.'],
  },
  {
    q: '¿Cuál es la vigencia del Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad tiene una vigencia de 30 días calendario contados desde su fecha de expedición, según los términos de la Superintendencia de Notariado y Registro. Pasado ese plazo, bancos y notarías suelen exigir uno actualizado, porque la situación del inmueble puede cambiar con nuevas anotaciones.',
  },
  {
    q: '¿Quién puede solicitar el Certificado de Tradición y Libertad?',
    a: 'Cualquier persona puede solicitarlo: es un documento público y no se requiere ser el propietario del inmueble ni demostrar interés legítimo. Basta con conocer el folio de matrícula inmobiliaria, o la oficina de registro y los datos del predio, para pedirlo y obtenerlo de forma legal.',
  },
  {
    q: '¿Cómo lo pido si no conozco la matrícula inmobiliaria?',
    a: 'Si no tienes la matrícula, puedes ubicarla con la dirección del inmueble o el número predial en la oficina de registro correspondiente a la ciudad o municipio donde está ubicado. En nuestro formulario seleccionas la oficina de registro y, si lo necesitas, te ayudamos a identificar el folio antes de continuar.',
  },
  {
    q: '¿Cuánto tarda la entrega del certificado?',
    a: 'La entrega es en minutos. Una vez confirmado el pago, gestionamos la expedición electrónica y te enviamos el Certificado de Tradición y Libertad en formato PDF, normalmente en pocos minutos.',
  },
  {
    q: '¿Cómo se entrega el Certificado de Tradición y Libertad?',
    a: 'El certificado se entrega en formato PDF por correo electrónico y por WhatsApp, listo para descargar, guardar o imprimir.',
  },
  {
    q: '¿Cómo validar la autenticidad del certificado?',
    a: 'Cada Certificado de Tradición y Libertad incluye un código de verificación expedido por la Superintendencia de Notariado y Registro. Con ese código puedes confirmar la autenticidad del documento directamente en el portal oficial de la SNR (supernotariado.gov.co).',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col scroll-smooth">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 w-full bg-[var(--brand)] shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Seal size={38} tone="onDark" />
            <p className="text-xl font-extrabold tracking-tight text-white">Certitradición</p>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 sm:flex">
            <a href="#como-funciona" className="transition-colors hover:text-white">Cómo funciona</a>
            <a href="#precio" className="transition-colors hover:text-white">Precio</a>
            <a href="#preguntas-frecuentes" className="transition-colors hover:text-white">Preguntas</a>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Pago seguro
            </span>
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:gap-10 lg:px-6 lg:py-10">
        <div className="flex w-full flex-col gap-5 lg:w-7/12 lg:gap-5 lg:pr-8">
          <div className="flex flex-col gap-3 lg:gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-ring)] bg-[var(--brand-50)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">
              <span className="size-2 rounded-full bg-[var(--accent)]" /> 
              Documento oficial · validez 30 días
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Tu Certificado de Tradición y Libertad, <span className="text-[var(--brand)]"><RotatingTail phrases={['listo en minutos.', '100% oficial y al día.', 'directo a tu WhatsApp.', 'sin hacer filas.']} /></span>
            </h1>
            <p className="max-w-lg text-base sm:text-[17px] leading-relaxed text-[var(--muted)]">
              Obtén el documento oficial de tu inmueble sin filas ni trámites. Te lo enviamos directamente a tu correo y WhatsApp.
            </p>
          </div>
          
          <div className="w-full">
            <CheckoutForm />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--muted-2)]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3 py-2 shadow-sm">
              <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Cifrado SSL
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 shadow-sm">
              <span className="font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Pago seguro</span>
              <WompiLogo className="text-[14.5px] text-[#1B2A3A]" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3 py-2 shadow-sm">
              <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              Validez 30 días
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col lg:sticky lg:top-24 lg:w-5/12">
          <div className="flex flex-col gap-2">
            <VideoPlayer />
            <p className="mt-4 text-center text-sm leading-relaxed text-[var(--muted-2)] px-4">
              Haz clic en el video para escuchar
            </p>
          </div>
        </div>
      </main>
      
      <div className="h-10"></div>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="bg-white py-16 lg:py-24 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <p className="font-bold text-[12px] tracking-widest uppercase text-[var(--brand)]">En tres pasos</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">¿Cómo funciona?</h2>
            </div>
            
            <div className="flex flex-col gap-8 mt-4">
              {[
                { n: '1', t: 'Ingresa oficina y matrícula', d: 'El formulario más corto del mercado.' },
                { n: '2', t: 'Verificamos y pagas seguro', d: 'Confirmamos tu inmueble antes de cobrarte. Pago rápido con Wompi.' },
                { n: '3', t: 'Recíbelo al instante', d: 'PDF oficial directo a tu correo y WhatsApp.', last: true },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`grid place-items-center w-9 h-9 rounded-full text-white font-bold text-sm ${s.last ? 'bg-[var(--accent)]' : 'bg-[var(--brand)]'}`}>
                      {s.last ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      ) : s.n}
                    </span>
                    {!s.last && <span className="w-0.5 h-full bg-gray-200 mt-2" />}
                  </div>
                  <div className={s.last ? "" : "pb-4"}>
                    <p className="font-semibold text-lg text-[var(--foreground)]">{s.t}</p>
                    <p className="mt-1 text-[15px] text-[var(--muted)]">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="scale-90 sm:scale-100 origin-center w-full max-w-[340px]">
              <AnimatedCertificate />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRECIO ===== */}
      <section id="precio" className="bg-[var(--background)] py-16 lg:py-24 border-t border-[var(--border)]">
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
          
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl text-left">
            {(['basico', 'express'] as PlanId[]).map((pid) => {
              const p = PLANS[pid];
              return (
                <div key={pid} className={`relative flex flex-col items-start rounded-3xl border-2 p-6 sm:p-8 transition-all ${
                  p.recommended 
                    ? 'border-[var(--brand)] bg-[var(--brand-50)] shadow-md' 
                    : 'border-[var(--border)] bg-white'
                }`}>
                  {p.recommended && (
                    <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-4 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-sm">
                      RECOMENDADO
                    </span>
                  )}
                  
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

      {/* ===== PREGUNTAS FRECUENTES ===== */}
      <section id="preguntas-frecuentes" className="bg-white py-16 lg:py-24 border-t border-[var(--border)]">
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
      
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
