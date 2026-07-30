import { Seal } from './Brand';

// Footer compartido (estética del diseño Home) con disclaimer de intermediario (protección legal)
// + enlaces legales. El descargo deja claro que somos privados, no el Gobierno.
export default function SiteFooter() {
  return (
    <footer className="bg-[var(--brand-950)]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Seal size={32} tone="onDark" />
            <div className="leading-tight">
              <p className="text-[15px] font-bold text-white">Certitradición</p>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-white/55">CERTIFICADOS DE TRADICIÓN · COLOMBIA</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] font-medium text-white/70">
            <a href="/certificado-tradicion-libertad" className="transition-colors hover:text-white">Qué es el certificado</a>
            <a href="/verificar" className="transition-colors hover:text-white">Tu matrícula</a>
            <a href="/#preguntas-frecuentes" className="transition-colors hover:text-white">Preguntas frecuentes</a>
            <a href="/precio" className="transition-colors hover:text-white">¿Cuánto cuesta?</a>
            <a href="/como-leer-certificado" className="transition-colors hover:text-white">Cómo leer tu certificado</a>
            <a href="/nosotros" className="transition-colors hover:text-white">Nosotros</a>
          </nav>
        </div>

        <div className="my-7 h-px bg-white/10" />

        <div className="flex flex-col items-center text-center">
          <nav className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-white/55">
            <a href="/privacidad" className="transition-colors hover:text-white">Política de Privacidad</a>
            <a href="/terminos" className="transition-colors hover:text-white">Términos y Condiciones</a>
            <a href="/reembolsos" className="transition-colors hover:text-white">Política de Reembolsos</a>
            <a href="/contacto" className="transition-colors hover:text-white">Contacto</a>
          </nav>

          <p className="max-w-2xl text-xs leading-relaxed text-white/55">
            Servicio privado de gestión documental. No formamos parte del Gobierno de Colombia ni de GOV.CO;
            actuamos como intermediarios para facilitar tu solicitud ante la autoridad competente.
          </p>
          <p className="mt-3 text-xs text-white/55">
            Calle 80 B #42 D, Barranquilla ·{' '}
            <a
              href="https://wa.me/573212258245"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 transition-colors hover:text-white"
            >
              WhatsApp 321 225 8245
            </a>
          </p>
          <p className="mt-3 text-xs text-white/40">© 2026 Certitradición · Pago seguro procesado por Wompi</p>
        </div>
      </div>
    </footer>
  );
}
