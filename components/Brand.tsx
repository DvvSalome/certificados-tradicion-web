// Identidad Certitradición — "sello registral": anillo punteado + "C" (arco abierto) + check verde.
// Logo final (Claude Design · "Certitradicion Logo Final"). Reutilizable en todo el sitio.
//  - tone="onLight": disco azul marino (para fondos claros)
//  - tone="onDark":  anillo blanco, sin disco (para fondos oscuros)

export function Seal({ size = 38, tone = 'onDark' }: { size?: number; tone?: 'onLight' | 'onDark' }) {
  if (tone === 'onLight') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="29.5" stroke="#103A73" strokeWidth="2.2" strokeDasharray="1.5 3.7" strokeLinecap="round" />
        <circle cx="32" cy="32" r="25" fill="#103A73" />
        <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.2" />
        <path d="M42 24.5 A 12 12 0 1 0 42 39.5" stroke="#fff" strokeWidth="5.4" fill="none" strokeLinecap="round" />
        <path d="M37.6 32 l 2.4 2.4 l 5.4 -6.3" stroke="#34D399" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="29.5" stroke="#fff" strokeWidth="2.4" strokeDasharray="1.6 3.8" strokeLinecap="round" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.1" />
      <path d="M42 24.5 A 12 12 0 1 0 42 39.5" stroke="#fff" strokeWidth="5.6" fill="none" strokeLinecap="round" />
      <path d="M37.6 32 l 2.4 2.4 l 5.4 -6.3" stroke="#34D399" strokeWidth="3.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Lockup horizontal: sello + wordmark + tagline. tone controla el color del texto.
export function BrandLockup({ size = 38, tone = 'onDark' }: { size?: number; tone?: 'onLight' | 'onDark' }) {
  const ink = tone === 'onDark' ? '#fff' : '#0D1B2A';
  const sub = tone === 'onDark' ? 'rgba(255,255,255,.6)' : '#8593A3';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Seal size={size} tone={tone} />
      <div style={{ lineHeight: 1 }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: ink }}>Certitradición</p>
        <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.18em', color: sub }}>
          CERTIFICADOS DE TRADICIÓN · COLOMBIA
        </p>
      </div>
    </div>
  );
}
