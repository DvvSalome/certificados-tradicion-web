import { Seal } from '@/components/Brand';

export default function AnimatedCertificate() {
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
        <img src="/cert-sample.png" alt="Muestra" width={1660} height={1164} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.95 }} />
        
        {/* scan beam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 72,
            height: 40,
            background: 'linear-gradient(180deg, rgba(52,211,153,0) 0%, rgba(52,211,153,.32) 50%, rgba(52,211,153,0) 100%)',
            animation: 'cz-scan 7s cubic-bezier(.4,0,.2,1) infinite',
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
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#fff', boxShadow: '0 8px 22px -6px rgba(13,27,42,.28)', animation: 'cz-gray 7s ease-in-out infinite' }}>
            <span style={{ width: 15, height: 15, flexShrink: 0, borderRadius: 999, border: '2px solid #CFD9E6', borderTopColor: '#103A73', animation: 'cz-spin .7s linear infinite' }} />
            <span style={{ fontWeight: 600, fontSize: 11.5, color: '#5B6B7E' }}>Analizando gravámenes…</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#E8F5EF', boxShadow: '0 8px 22px -6px rgba(15,122,82,.3)', animation: 'cz-green 7s ease-in-out infinite' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, flexShrink: 0, borderRadius: 999, background: '#0F7A52', color: '#fff' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: 11.5, color: '#0F7A52' }}>Sin gravámenes vigentes</span>
          </div>
        </div>

        {/* validation stamp */}
        <div style={{ position: 'absolute', right: 18, bottom: 12, animation: 'cz-stamp 7s ease-in-out infinite', transformOrigin: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 54, height: 54, borderRadius: 999, border: '2px solid #0F7A52', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.82)' }}>
            <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed rgba(15,122,82,.55)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <span style={{ fontWeight: 800, fontSize: 6, letterSpacing: '.14em', color: '#0F7A52' }}>VÁLIDO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
