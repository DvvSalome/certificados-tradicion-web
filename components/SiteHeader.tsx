import { Seal } from '@/components/Brand';

// Header compartido de las sub-páginas (precio, FAQ, guías, etc.): logo nuevo + botón claro "Volver al inicio".
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-5 py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            aria-label="Volver al inicio"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] shadow-sm transition-colors hover:text-[var(--foreground)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Volver al inicio</span>
            <span className="sm:hidden">Inicio</span>
          </a>
          <a href="/" className="flex items-center gap-2">
            <Seal size={30} tone="onLight" />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certitradición</span>
          </a>
        </div>
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
