// Footer compartido con disclaimer de intermediario (protección legal) + enlaces legales.
// Reutilizable en todas las páginas. El descargo deja claro que somos privados, no el Gobierno.
export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-8 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-[var(--muted)]">
          <a href="/verificar" className="hover:text-[var(--brand)]">Tu matrícula</a>
          <a href="/precio" className="hover:text-[var(--brand)]">Precio</a>
          <a href="/guias" className="hover:text-[var(--brand)]">Guías</a>
          <a href="/certificado-tradicion-libertad" className="hover:text-[var(--brand)]">Ciudades</a>
          <a href="/preguntas-frecuentes" className="hover:text-[var(--brand)]">Preguntas frecuentes</a>
        </nav>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-[var(--muted-2)]">
          <a href="/privacidad" className="hover:text-[var(--brand)]">Política de Privacidad</a>
          <a href="/terminos" className="hover:text-[var(--brand)]">Términos y Condiciones</a>
          <a href="/reembolsos" className="hover:text-[var(--brand)]">Política de Reembolsos</a>
          <a href="/contacto" className="hover:text-[var(--brand)]">Contacto</a>
        </nav>
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--muted-2)]">
          Servicio privado de gestión documental. No formamos parte del Gobierno de Colombia ni de GOV.CO;
          actuamos como intermediarios para facilitar tu solicitud ante la autoridad competente.
        </p>
        <p className="text-xs text-[var(--muted-2)]">© 2026 Certitradición · Pago seguro procesado por Wompi</p>
      </div>
    </footer>
  );
}
