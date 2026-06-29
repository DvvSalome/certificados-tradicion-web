import CheckoutForm from '@/components/CheckoutForm';
import SiteFooter from '@/components/SiteFooter';
import { Seal } from '@/components/Brand';
import { PLANS, formatCOP } from '@/lib/config';
import { RotatingTail } from '@/components/RotatingTail';
import { ClickToCheckout } from '@/components/ClickToCheckout';

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
            'radial-gradient(900px 440px at 80% -12%, #2C3E50 0%, rgba(27,78,143,0) 60%), linear-gradient(158deg,#1B2A3A 0%, #13202C 100%)',
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
              El certificado de tu propiedad,{' '}
              <RotatingTail phrases={['oficial y al día.', 'listo en minutos.', 'sin filas ni trámites.', 'verificado y seguro.']} />
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
            <ClickToCheckout
              style={{
                position: 'absolute',
                right: 0,
                top: 8,
                width: 312,
                height: 384,
                transform: 'rotate(-2deg)',
                borderRadius: 14,
                background: '#fff',
                boxShadow: '0 34px 64px -22px rgba(0,0,0,.5)',
                overflow: 'hidden',
                animation: 'cz-bob 6s ease-in-out infinite',
                cursor: 'pointer',
              }}
            >
              {/* documento real (muestra) — formato SNR con datos 100% de muestra */}
              <img src="/cert-sample.png" alt="Certificado de Tradición y Libertad (documento de muestra)" style={{ display: 'block', width: '100%', height: 'auto' }} />
              {/* scan beam sobre el documento */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 72, height: 40, background: 'linear-gradient(180deg, rgba(52,211,153,0) 0%, rgba(52,211,153,.32) 50%, rgba(52,211,153,0) 100%)', animation: 'cz-scan 7s cubic-bezier(.4,0,.2,1) infinite', pointerEvents: 'none' }} />
              {/* fade inferior: el documento se funde para resaltar el estado del análisis */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 152, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 36%, rgba(255,255,255,.97) 78%)', pointerEvents: 'none' }} />
              {/* estado del análisis — corre SOBRE el documento */}
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 52, height: 42 }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#fff', boxShadow: '0 8px 22px -6px rgba(13,27,42,.28)', animation: 'cz-gray 7s ease-in-out infinite' }}>
                  <span style={{ width: 15, height: 15, flexShrink: 0, borderRadius: 999, border: '2px solid #CFD9E6', borderTopColor: '#1B2A3A', animation: 'cz-spin .7s linear infinite' }} />
                  <span style={{ fontWeight: 600, fontSize: 11.5, color: '#5B6B7E' }}>Analizando gravámenes…</span>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', borderRadius: 11, background: '#E8F5EF', boxShadow: '0 8px 22px -6px rgba(15,122,82,.3)', animation: 'cz-green 7s ease-in-out infinite' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, flexShrink: 0, borderRadius: 999, background: '#0F7A52', color: '#fff' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 11.5, color: '#0F7A52' }}>Sin gravámenes vigentes</span>
                </div>
              </div>
              {/* sello VÁLIDO */}
              <div style={{ position: 'absolute', right: 16, bottom: 10, animation: 'cz-stamp 7s ease-in-out infinite', transformOrigin: 'center', pointerEvents: 'none' }}>
                <div style={{ position: 'relative', width: 54, height: 54, borderRadius: 999, border: '2px solid #0F7A52', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.82)' }}>
                  <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed rgba(15,122,82,.55)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    <span style={{ fontWeight: 800, fontSize: 6, letterSpacing: '.14em', color: '#0F7A52' }}>VÁLIDO</span>
                  </div>
                </div>
              </div>
            </ClickToCheckout>
          </div>
        </div>
      </div>

      {/* ===== CHECKOUT PANEL ===== */}
      <div id="como-funciona" style={{ maxWidth: 1200, margin: '-76px auto 0', position: 'relative', zIndex: 5, padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          {/* process + trust */}
          <div style={{ flex: '1 1 360px', minWidth: 280, paddingTop: 88, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1B2A3A' }}>En tres pasos</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { n: '1', t: 'Ingresa oficina y matrícula', d: 'El formulario más corto del mercado.' },
                  { n: '2', t: 'Verificamos y pagas seguro', d: 'Confirmamos tu inmueble antes de cobrarte. Pago con Wompi.' },
                  { n: '3', t: 'Recíbelo al instante', d: 'PDF oficial por correo y WhatsApp.', last: true },
                ].map((s) => (
                  <div key={s.n} style={{ display: 'flex', gap: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 999, background: s.last ? '#0F7A52' : '#1B2A3A', color: '#fff', fontWeight: 700, fontSize: 15 }}>
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
