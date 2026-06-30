export default function AnimatedCertificate() {
  return (
    <div style={{ position: 'relative', height: 400, width: '100%', maxWidth: 340, margin: '0 auto' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'rotate(-2deg)',
          borderRadius: 14,
          background: '#fff',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '26px 24px',
          animation: 'cz-bob 6s ease-in-out infinite',
          border: '1px solid var(--border)'
        }}
      >
        {/* scan beam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 64,
            height: 34,
            background: 'linear-gradient(180deg, rgba(52,211,153,0) 0%, rgba(52,211,153,.30) 50%, rgba(52,211,153,0) 100%)',
            animation: 'cz-scan 7s cubic-bezier(.4,0,.2,1) infinite',
            pointerEvents: 'none',
          }}
        />
        {/* header tipo documento oficial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingBottom: 10, borderBottom: '1.5px solid #103A73' }}>
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="29" fill="#103A73" />
            <path d="M42 24.5 A 12 12 0 1 0 42 39.5" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M37.6 32 l 2.4 2.4 l 5.4 -6.3" stroke="#34D399" strokeWidth="3.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 6, letterSpacing: '.09em', color: '#8593A3', whiteSpace: 'nowrap' }}>REPÚBLICA DE COLOMBIA · DOCUMENTO PÚBLICO</p>
            <p style={{ margin: '2px 0 0', fontWeight: 800, fontSize: 11.5, letterSpacing: '-.01em', color: '#0D1B2A' }}>Certificado de Tradición y Libertad</p>
          </div>
        </div>
        {/* matrícula / folio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 11, fontFamily: 'ui-monospace,monospace', fontSize: 8, letterSpacing: '.02em', color: '#8593A3' }}>
          <span>MATRÍCULA <b style={{ color: '#0D1B2A' }}>040-168410</b></span>
          <span>FOLIO 1/1</span>
        </div>
        {/* campos del documento */}
        <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: 'Dirección del inmueble', v: 'CRA 53 # 80-120 · BARRANQUILLA' },
            { l: 'Propietario inscrito', protegido: true },
            { l: 'Modo de adquisición', v: 'Compraventa — Anotación N.° 6' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 6.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#A9B4C2' }}>{f.l}</span>
              {f.protegido ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ height: 9, flex: 1, borderRadius: 3, background: 'repeating-linear-gradient(90deg,#C7D2E0 0 9px,#E7EDF5 9px 15px)' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 800, fontSize: 6, letterSpacing: '.04em', color: '#0F7A52', whiteSpace: 'nowrap' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    PROTEGIDO
                  </span>
                </div>
              ) : (
                <span style={{ fontWeight: 600, fontSize: 9, color: '#33445A' }}>{f.v}</span>
              )}
            </div>
          ))}
        </div>
        {/* sección gravámenes */}
        <div style={{ marginTop: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 6.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#A9B4C2' }}>Gravámenes y limitaciones</span>
          <div style={{ position: 'relative', marginTop: 5, height: 40 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 12px', borderRadius: 9, background: '#F4F6FB', animation: 'cz-gray 7s ease-in-out infinite' }}>
              <span style={{ width: 14, height: 14, flexShrink: 0, borderRadius: 999, border: '2px solid #CFD9E6', borderTopColor: '#103A73', animation: 'cz-spin .7s linear infinite' }} />
              <span style={{ fontWeight: 600, fontSize: 11, color: '#5B6B7E' }}>Analizando gravámenes…</span>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 12px', borderRadius: 9, background: '#E8F5EF', animation: 'cz-green 7s ease-in-out infinite' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 19, height: 19, flexShrink: 0, borderRadius: 999, background: '#0F7A52', color: '#fff' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <span style={{ fontWeight: 700, fontSize: 11, color: '#0F7A52' }}>Sin gravámenes vigentes</span>
            </div>
          </div>
        </div>
        <p style={{ margin: '13px 0 0', textAlign: 'center', fontWeight: 600, fontSize: 7.5, fontFamily: 'ui-monospace,monospace', letterSpacing: '.12em', color: '#A9B4C2' }}>
          EXPEDIDO POR LA SUPERINTENDENCIA DE NOTARIADO Y REGISTRO
        </p>
        {/* validation stamp */}
        <div style={{ position: 'absolute', right: 18, bottom: 50, animation: 'cz-stamp 7s ease-in-out infinite', transformOrigin: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 58, height: 58, borderRadius: 999, border: '2px solid #0F7A52', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.7)' }}>
            <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed rgba(15,122,82,.55)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <span style={{ fontWeight: 800, fontSize: 6, letterSpacing: '.14em', color: '#0F7A52' }}>VÁLIDO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
