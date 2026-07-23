import { Seal } from '@/components/Brand';

/* La tarjeta del certificado con escáner + chips flotantes (la animación CSS original
   del hero, v3). Vive en "¿Cómo funciona?" desde que el hero pasó a la animación
   grande del estudio. Sus keyframes cz-* están en globals.css. */
export default function CertScanCard() {
  return (
    <div style={{ position: 'relative', height: 420, width: '100%', maxWidth: 340, margin: '0 auto' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'rotate(-2deg)',
          borderRadius: 14,
          background: '#fff',
          boxShadow: '0 34px 64px -22px rgba(0,0,0,.5)',
          overflow: 'hidden',
          animation: 'cz-bob 6s ease-in-out infinite',
          border: '1px solid var(--border)'
        }}
      >
        <img src="/cert-sample.webp" alt="Muestra" width={1000} height={701} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.95 }} />

        {/* scan beam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 72,
            height: 40,
            background: 'linear-gradient(180deg, rgba(52,211,153,0) 0%, rgba(52,211,153,.32) 50%, rgba(52,211,153,0) 100%)',
            animation: 'cz-scan 9s cubic-bezier(.4,0,.2,1) infinite',
            pointerEvents: 'none',
          }}
        />

        {/* fade inferior: el documento se funde para resaltar el estado del análisis */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 152, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 36%, rgba(255,255,255,.97) 78%)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, zIndex: 10 }}>
          <Seal size={24} tone="onLight" />
          <span style={{ fontWeight: 800, fontSize: 10, color: '#0D1B2A', letterSpacing: '-0.02em' }}>Certitradición</span>
        </div>
        {/* estado del análisis — corre SOBRE el documento */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 52, height: 42 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#fff', boxShadow: '0 8px 22px -6px rgba(13,27,42,.28)', animation: 'cz-gray 9s ease-in-out infinite' }}>
            <span style={{ width: 15, height: 15, flexShrink: 0, borderRadius: 999, border: '2px solid #CFD9E6', borderTopColor: '#103A73', animation: 'cz-spin .7s linear infinite' }} />
            <span style={{ fontWeight: 600, fontSize: 11.5, color: '#5B6B7E' }}>Analizando gravámenes…</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#E8F5EF', boxShadow: '0 8px 22px -6px rgba(15,122,82,.3)', animation: 'cz-green 9s ease-in-out infinite' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, flexShrink: 0, borderRadius: 999, background: '#0F7A52', color: '#fff' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: 11.5, color: '#0F7A52' }}>Sin gravámenes vigentes</span>
          </div>
        </div>

        {/* validation stamp */}
        <div style={{ position: 'absolute', right: 18, bottom: 12, animation: 'cz-stamp 9s ease-in-out infinite', transformOrigin: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 54, height: 54, borderRadius: 999, border: '2px solid #0F7A52', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.82)' }}>
            <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed rgba(15,122,82,.55)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <span style={{ fontWeight: 800, fontSize: 6, letterSpacing: '.14em', color: '#0F7A52' }}>VÁLIDO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anotaciones del estudio: flotan FUERA del documento (el card tiene overflow
          hidden), cada una a la altura donde el escáner va leyendo, con su punto
          conector pulsando hacia el doc. Pop tipo sello sincronizado con cz-scan. */}
      {[
        ['Folio localizado', 'cz-p1', 62],
        ['Propietarios verificados', 'cz-p2', 118],
        ['Hipotecas: ninguna', 'cz-p3', 174],
        ['Embargos: ninguno', 'cz-p4', 230],
      ].map(([texto, anim, top]) => (
        <div key={anim as string} style={{ position: 'absolute', left: -14, top: top as number, display: 'flex', alignItems: 'center', gap: 7, zIndex: 12, pointerEvents: 'none', animation: `${anim} 9s ease-in-out infinite`, transformOrigin: 'left center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: '#fff', border: '1px solid rgba(15,122,82,.22)', boxShadow: '0 8px 22px -8px rgba(13,27,42,.35)' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 15, height: 15, borderRadius: 999, background: '#0F7A52', color: '#fff', flexShrink: 0 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: 10.5, color: '#0D1B2A', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{texto}</span>
          </div>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#0F7A52', animation: 'cz-dot 2.2s ease-out infinite', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
