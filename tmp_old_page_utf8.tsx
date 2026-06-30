import CheckoutForm from '@/components/CheckoutForm';
import SiteFooter from '@/components/SiteFooter';
import { Seal } from '@/components/Brand';
import { PLANS, formatCOP } from '@/lib/config';

// Diseño Home (Claude Design · "Certitradicion Home"). Hero con sello animado + panel de checkout.
export default function Home() {
  // Precio "entrada" del home = plan Básico (literal en código → consistente con el modal, sin depender
  // de env stale ni del timing build/runtime). El modal permite subir a Express.
  const priceLabel = formatCOP(PLANS.basico.priceCop);

  const navLink = 'transition-colors hover:text-white';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* ===== HERO ===== */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(900px 440px at 80% -12%, #1B4E8F 0%, rgba(27,78,143,0) 60%), linear-gradient(158deg,#103A73 0%, #0B2C55 100%)',
        }}
      >
        <header
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '22px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Seal size={38} tone="onDark" />
            <p style={{ margin: 0, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#fff' }}>Certitradición</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 sm:flex">
            <a href="#como-funciona" className={navLink}>Cómo funciona</a>
            <a href="/precio" className={navLink}>Precio</a>
            <a href="/preguntas-frecuentes" className={navLink}>Preguntas</a>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-white"
              style={{ background: 'rgba(255,255,255,.12)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Pago seguro
            </span>
          </nav>
        </header>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            alignItems: 'center',
            padding: '36px 32px 116px',
          }}
        >
          {/* left copy */}
          <div style={{ flex: '1 1 440px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                width: 'fit-content',
                padding: '7px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,.1)',
                border: '1px solid rgba(255,255,255,.18)',
                fontWeight: 600,
                fontSize: 12.5,
                color: '#fff',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 999, background: '#34D399' }} /> Documento oficial · validez 30 días
            </span>

            <h1
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(38px,5vw,56px)',
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: '#fff',
              }}
            >
              El certificado de tu propiedad, oficial y al día.
            </h1>

            <p style={{ margin: 0, maxWidth: 440, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,.82)' }}>
              Tu Certificado de Tradición y Libertad, oficial y vigente. Lo recibes en PDF por correo o WhatsApp, en minutos.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, paddingTop: 6 }}>
              {[
                { v: priceLabel, l: 'Pago único · IVA incl.' },
                { v: 'Minutos', l: 'Entrega típica' },
                { v: '30 días', l: 'Vigencia legal' },
              ].map((s, i) => (
                <div key={s.l} style={{ display: 'flex', gap: 26 }}>
                  {i > 0 && <div style={{ width: 1, background: 'rgba(255,255,255,.18)' }} />}
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.v}</p>
                    <p style={{ margin: '2px 0 0', fontWeight: 500, fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: animated certificate */}
          <div style={{ flex: '1 1 340px', minWidth: 280, position: 'relative', height: 400 }}>
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 8,
                width: 300,
                height: 384,
                transform: 'rotate(-2deg)',
                borderRadius: 14,
                background: '#fff',
                boxShadow: '0 34px 64px -22px rgba(0,0,0,.5)',
                overflow: 'hidden',
                padding: '26px 24px',
                animation: 'cz-bob 6s ease-in-out infinite',
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
              {/* campos del documento (etiqueta + valor; propietario PROTEGIDO) */}
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
              {/* sección gravámenes — el análisis corre AQUÍ, sobre el documento */}
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
        </div>
      </div>

      {/* ===== CHECKOUT PANEL ===== */}
      <div id="como-funciona" style={{ maxWidth: 1200, margin: '-76px auto 0', position: 'relative', zIndex: 5, padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          {/* process + trust */}
          <div style={{ flex: '1 1 360px', minWidth: 280, paddingTop: 88, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#103A73' }}>En tres pasos</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { n: '1', t: 'Ingresa oficina y matrícula', d: 'El formulario más corto del mercado.' },
                  { n: '2', t: 'Verificamos y pagas seguro', d: 'Confirmamos tu inmueble antes de cobrarte. Pago con Wompi.' },
                  { n: '3', t: 'Recíbelo al instante', d: 'PDF oficial por correo y WhatsApp.', last: true },
                ].map((s) => (
                  <div key={s.n} style={{ display: 'flex', gap: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 999, background: s.last ? '#0F7A52' : '#103A73', color: '#fff', fontWeight: 700, fontSize: 15 }}>
                        {s.last ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        ) : s.n}
                      </span>
                      {!s.last && <span style={{ width: 2, flex: 1, background: '#CFD9E6', margin: '4px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: s.last ? 0 : 22 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15.5, color: '#0D1B2A' }}>{s.t}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#5B6B7E' }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { t: 'Cifrado SSL', icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
                { t: 'Pago seguro Wompi', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
                { t: 'Validez 30 días', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
              ].map((b) => (
                <span key={b.t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 999, background: '#fff', border: '1px solid #E3E9F1', fontWeight: 600, fontSize: 12, color: '#5B6B7E' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{b.icon}</svg>
                  {b.t}
                </span>
              ))}
            </div>

            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: '#8593A3', maxWidth: 380 }}>
              Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR); facilitamos el trámite en tu nombre.
            </p>
          </div>

          {/* checkout (teaser + modal real, cableado a Wompi) */}
          <CheckoutForm priceLabel={priceLabel} />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
