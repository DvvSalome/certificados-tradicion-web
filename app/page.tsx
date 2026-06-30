import CheckoutForm from '@/components/CheckoutForm';
import SiteFooter from '@/components/SiteFooter';
import { Seal, WompiLogo } from '@/components/Brand';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="relative z-10 w-full bg-[var(--brand)] shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Seal size={38} tone="onDark" />
            <p className="text-xl font-extrabold tracking-tight text-white">Certitradición</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 sm:flex">
            <a href="#como-funciona" className="transition-colors hover:text-white">Cómo funciona</a>
            <a href="/precio" className="transition-colors hover:text-white">Precio</a>
            <a href="/preguntas-frecuentes" className="transition-colors hover:text-white">Preguntas</a>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Pago seguro
            </span>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:gap-10 lg:px-6 lg:py-10">
        
        {/* Columna Izquierda: Formulario y Copia */}
        <div className="flex w-full flex-col gap-5 lg:w-7/12 lg:gap-5 lg:pr-8">
          <div className="flex flex-col gap-3 lg:gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-ring)] bg-[var(--brand-50)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">
              <span className="size-2 rounded-full bg-[var(--accent)]" /> 
              Documento oficial · validez 30 días
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Tu Certificado de Tradición y Libertad, <span className="text-[var(--brand)]">listo en minutos.</span>
            </h1>
            <p className="max-w-lg text-base sm:text-[17px] leading-relaxed text-[var(--muted)]">
              Obtén el documento oficial de tu inmueble sin filas ni trámites. Te lo enviamos directamente a tu correo y WhatsApp.
            </p>
          </div>
          
          <div className="w-full">
            <CheckoutForm />
          </div>

          {/* Trust badges */}
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

        {/* Columna Derecha: Video Caso de Vida Real */}
        <div className="flex w-full flex-col lg:sticky lg:top-8 lg:w-5/12">
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-[var(--brand-700)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[6px] border-white ring-1 ring-[var(--border)]">
            <video
              src="/certificado-demo.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Gradiente sutil encima del video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
          <p className="mt-6 text-center text-sm leading-relaxed text-[var(--muted-2)] px-4">
            Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR); facilitamos el trámite en tu nombre.
          </p>
        </div>

      </main>
      
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
