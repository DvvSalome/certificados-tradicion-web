// Identidad Certitradición — "sello registral": anillo punteado + "C" (arco abierto) + check verde.
// Logo final (Claude Design · "Certitradicion Logo Final"). Reutilizable en todo el sitio.
//  - tone="onLight": disco azul marino (para fondos claros)
//  - tone="onDark":  anillo blanco, sin disco (para fondos oscuros)

export function Seal({ size = 38, tone = 'onDark' }: { size?: number; tone?: 'onLight' | 'onDark' }) {
  // Logo: documento firmado (documento + líneas + firma + pluma). Mono, tone-aware.
  const c = tone === 'onDark' ? '#fff' : '#1B2A3A';
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M34 9 H57 a7 7 0 0 1 7 7 V80 a7 7 0 0 1 -7 7 H23 a7 7 0 0 1 -7 -7 V26 Z" />
      <path d="M16 26 H29 a5 5 0 0 0 5 -5 V9" />
      <path d="M25 34 H53" />
      <path d="M25 43 H49" />
      <path d="M25 52 H53" />
      <path d="M25 61 H46" />
      <path d="M25 75 c 4 -7 8 -5 9 1 c 1 5 5 5 7 -1 c 1 -4 5 -3 6 1 c 1 3 4 4 8 -1" strokeWidth="4" />
      <path d="M25 84 H50" />
      <path d="M75.5 13.4 A 5.8 5.8 0 0 1 86 18.2 L 67.6 59.8 L 55 75.5 L 57 55.2 Z" fill={c} stroke="none" />
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
