'use client';

import { useState, useEffect } from 'react';
import OficinaSelect from './OficinaSelect';
import { Seal } from './Brand';
import { PLANS, formatCOP, type PlanId } from '@/lib/config';

const VERIFY_STEPS = ['Conectando con el registro…', 'Buscando tu matrícula…', 'Confirmando la información…'];

type Step = 'form' | 'review' | 'paying';
type VResult = { disponible: boolean | null; estado: string | null; direccion: string | null; circulo: string | null; mocked?: boolean; error?: string };

// Diseño Home (Claude Design): tarjeta "teaser" que abre un modal fullscreen con el formulario real.
// La lógica (validar ANTES de pagar + redirección a Wompi) es la del backend real, no el mock del diseño.
export default function CheckoutForm({ priceLabel }: { priceLabel: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [plan, setPlan] = useState<PlanId>('express'); // Express por defecto = mayor conversión
  const [matricula, setMatricula] = useState('');
  const [oficina, setOficina] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [vStep, setVStep] = useState(0);
  const [vResult, setVResult] = useState<VResult | null>(null);

  // bloquear scroll + Esc para cerrar mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loading]);

  // Avisa al hero (typewriter) para que PAUSE su animación mientras el modal está abierto.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('cz-modal', { detail: open }));
  }, [open]);

  // mensajes de progreso mientras valida (para no preocupar al cliente)
  useEffect(() => {
    if (!validating) { setVStep(0); return; }
    const iv = setInterval(() => setVStep((s) => Math.min(s + 1, VERIFY_STEPS.length - 1)), 2800);
    return () => clearInterval(iv);
  }, [validating]);

  function openModal() {
    setOpen(true); setStep('form'); setError(null); setVResult(null);
  }
  function closeModal() {
    if (loading) return;
    setOpen(false);
  }

  // Paso 1: validar campos → ir a "revisar" y CONSULTAR la matrícula (muestra dirección real).
  function submit() {
    setError(null);
    if (!oficina) { setError('Selecciona la oficina de registro'); return; }
    if (!matricula.trim()) { setError('Ingresa tu matrícula inmobiliaria'); return; }
    if (!email.trim()) { setError('Ingresa tu correo electrónico'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Revisa tu correo, parece inválido'); return; }
    setStep('review'); setVResult(null); setValidating(true);
    fetch('/api/validar', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ oficina, matricula: matricula.trim() }),
    })
      .then((r) => r.json())
      .then((j: VResult) => setVResult(j))
      .catch(() => setVResult({ disponible: null, estado: null, direccion: null, circulo: null, error: 'red' }))
      .finally(() => setValidating(false));
  }

  // bloquear pago solo si la validación es CONCLUYENTE (no mock/error) y dice que no existe.
  const blocked = !!vResult && !vResult.mocked && !vResult.error && vResult.disponible === false;

  // Paso 2: crear orden y redirigir a Wompi.
  async function confirmAndPay() {
    if (blocked || validating) return;
    setError(null); setLoading(true); setStep('paying');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ matricula, oficina, email, phone, plan }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || 'Ocurrió un error'); setStep('form'); setLoading(false); return; }
      window.location.href = j.checkoutUrl;
    } catch {
      setError('Error de conexión, intenta de nuevo'); setStep('form'); setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--brand-ring)] focus:ring-4 focus:ring-[var(--brand-50)]';

  const planPrice = formatCOP(PLANS[plan].priceCop); // precio del plan elegido (botón, total, chip)

  return (
    <>
      {/* ===== TEASER (click → modal) ===== */}
      <div
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } }}
        className="group transition hover:-translate-y-1"
        style={{
          flex: '1 1 440px', minWidth: 300, borderRadius: 20, border: '1px solid #E3E9F1', background: '#fff',
          overflow: 'hidden', boxShadow: '0 26px 60px -22px rgba(13,27,42,.3)', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '20px 28px', borderBottom: '1px solid #E3E9F1', background: '#EEF3FB' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1B2A3A' }}>Solicita tu certificado</p>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: '#5B6B7E' }}>Por correo y WhatsApp, en minutos.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 26, color: '#0D1B2A', fontVariantNumeric: 'tabular-nums' }}>{priceLabel}</p>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 11, color: '#8593A3' }}>IVA incluido</p>
          </div>
        </div>
        <div style={{ padding: '22px 28px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { t: 'Oficina de Registro', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></> },
            { t: 'Matrícula inmobiliaria', icon: <><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></> },
            { t: 'Correo electrónico', icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></> },
          ].map((f) => (
            <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, border: '1px solid #CFD9E6', background: '#fff', padding: '13px 15px' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8593A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
              <span style={{ fontSize: 14.5, color: '#8593A3' }}>{f.t}</span>
            </div>
          ))}
          <div className="transition group-hover:brightness-110" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 4, borderRadius: 12, background: '#1B2A3A', padding: 16, fontWeight: 600, fontSize: 16, color: '#fff', boxShadow: '0 8px 20px -6px rgba(16,58,115,.5)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Solicitar mi certificado
          </div>
          <p style={{ margin: '2px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontWeight: 600, fontSize: 12.5, color: '#8593A3' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            Toca para ampliar y completar
          </p>
        </div>
      </div>

      {/* ===== MODAL FULLSCREEN ===== */}
      {open && (
        <div
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflow: 'auto', background: 'rgba(7,15,28,.64)', backdropFilter: 'blur(9px)', animation: 'cz-fade .25s ease both' }}
        >
          <div style={{ width: '100%', maxWidth: 980, margin: 'auto' }}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', borderRadius: 24, overflow: 'hidden', boxShadow: '0 50px 120px -30px rgba(0,0,0,.65)', animation: 'cz-modalin .42s cubic-bezier(.22,1,.36,1) both' }}
            >
              {/* LEFT — marca */}
              <div style={{ flex: '1 1 320px', minWidth: 260, position: 'relative', padding: '34px 38px', background: 'radial-gradient(720px 380px at 22% -10%, #2C3E50 0%, rgba(27,78,143,0) 60%), linear-gradient(160deg,#1B2A3A,#13202C)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Seal size={34} tone="onDark" />
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#fff' }}>Certitradición</p>
                  </div>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, lineHeight: 1.12, letterSpacing: '-0.025em', color: '#fff' }}>
                    Tu certificado, oficial y al día — en minutos.
                  </h2>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: 0, padding: 0, listStyle: 'none' }}>
                    {['Entrega por correo y WhatsApp, en PDF.', 'Verificamos tu inmueble antes de cobrarte.', 'Pago protegido por Wompi · validez 30 días.'].map((b) => (
                      <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                        <span style={{ marginTop: 1, display: 'grid', placeItems: 'center', width: 22, height: 22, flexShrink: 0, borderRadius: 999, background: 'rgba(52,211,153,.18)', color: '#34D399' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                        <span style={{ fontWeight: 500, fontSize: 14.5, lineHeight: 1.45, color: 'rgba(255,255,255,.86)' }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: 'fit-content', padding: '10px 16px', borderRadius: 12, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)' }}>
                    <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{planPrice}</span>
                    <span style={{ fontWeight: 500, fontSize: 12.5, color: 'rgba(255,255,255,.66)' }}>{PLANS[plan].label} · pago único · IVA incl.</span>
                  </div>
                </div>
              </div>

              {/* RIGHT — formulario */}
              <div style={{ flex: '1 1 380px', minWidth: 300, background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '22px 28px', borderBottom: '1px solid #E3E9F1' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1B2A3A' }}>Completa tu solicitud</p>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#5B6B7E' }}>Toma menos de un minuto.</p>
                  </div>
                  <button type="button" onClick={closeModal} aria-label="Cerrar" className="transition hover:bg-[var(--background)]" style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, flexShrink: 0, border: '1px solid #E3E9F1', borderRadius: 10, background: '#fff', cursor: 'pointer', color: '#5B6B7E' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                <div style={{ padding: '16px 28px 22px' }}>
                  {/* FORM */}
                  {step === 'form' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                      {/* SELECTOR DE PLAN */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0D1B2A' }}>Elige tu plan</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {(['basico', 'express'] as PlanId[]).map((pid) => {
                            const p = PLANS[pid];
                            const sel = plan === pid;
                            return (
                              <button
                                type="button"
                                key={pid}
                                onClick={() => setPlan(pid)}
                                aria-pressed={sel}
                                className="transition"
                                style={{
                                  position: 'relative', flex: '1 1 150px', textAlign: 'left', cursor: 'pointer',
                                  borderRadius: 13, padding: '10px 12px',
                                  border: sel ? '2px solid #1B2A3A' : '1px solid #CFD9E6',
                                  background: sel ? '#EEF3FB' : '#fff',
                                  boxShadow: sel ? '0 8px 20px -10px rgba(16,58,115,.4)' : 'none',
                                }}
                              >
                                {p.recommended && (
                                  <span style={{ position: 'absolute', top: -9, right: 12, padding: '2px 8px', borderRadius: 999, background: '#0F7A52', color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: '.06em' }}>MÁS ELEGIDO</span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ display: 'inline-block', width: 16, height: 16, flexShrink: 0, borderRadius: 999, border: sel ? '5px solid #1B2A3A' : '2px solid #CFD9E6', background: '#fff' }} />
                                  <span style={{ fontWeight: 800, fontSize: 15, color: '#0D1B2A' }}>{p.label}</span>
                                </div>
                                <p style={{ margin: '7px 0 0', fontWeight: 800, fontSize: 15, color: '#1B2A3A', fontVariantNumeric: 'tabular-nums' }}>{formatCOP(p.priceCop)}</p>
                                <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {p.features.slice(0, pid === 'express' ? 4 : 2).map((f) => (
                                    <li key={f} style={{ display: 'flex', gap: 5, fontSize: 10.5, lineHeight: 1.28, color: '#5B6B7E' }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F7A52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>
                                      <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0D1B2A' }}>Oficina de Registro</span>
                        <OficinaSelect value={oficina} onChange={setOficina} />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0D1B2A' }}>Matrícula Inmobiliaria</span>
                        <input value={matricula} onChange={(e) => { setMatricula(e.target.value.replace(/\D/g, '')); setError(null); }} inputMode="numeric" placeholder="Ej: 168410" className={`${inputCls} font-mono tracking-wide`} />
                        <span style={{ fontSize: 12.5, color: '#5B6B7E' }}>Solo números, como aparece en tu escritura o predial.</span>
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        <label style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                          <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0D1B2A' }}>Correo</span>
                          <input value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" className={inputCls} />
                        </label>
                        <label style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                          <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0D1B2A' }}>WhatsApp <span style={{ fontWeight: 400, color: '#8593A3' }}>(opc.)</span></span>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="+57 300…" className={inputCls} />
                        </label>
                      </div>
                      {error && (
                        <p className="ctl-fade-up" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: 0, padding: '11px 14px', borderRadius: 11, border: '1px solid #f3c2bd', background: '#fdecec', fontWeight: 500, fontSize: 13.5, color: '#b42318' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
                          {error}
                        </p>
                      )}
                      <button type="button" onClick={submit} className="transition hover:brightness-110 active:scale-[0.99]" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 2, border: 'none', cursor: 'pointer', borderRadius: 12, background: '#1B2A3A', padding: 16, fontWeight: 600, fontSize: 16, color: '#fff', boxShadow: '0 8px 20px -6px rgba(16,58,115,.5)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                        Validar y continuar
                      </button>
                      <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#8593A3' }}>Validamos tu matrícula antes de cobrarte · el pago es en el siguiente paso.</p>
                    </div>
                  )}

                  {/* REVIEW */}
                  {step === 'review' && (
                    <div className="ctl-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1B2A3A' }}>Revisa antes de pagar</p>

                      {validating ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px', borderRadius: 12, background: '#EEF3FB', fontWeight: 600, fontSize: 14, color: '#0D1B2A' }}>
                            <span style={{ width: 17, height: 17, flexShrink: 0, borderRadius: 999, border: '2px solid #CFD9E6', borderTopColor: '#1B2A3A', animation: 'cz-spin .7s linear infinite' }} />
                            <span key={vStep} className="ctl-fade-up">{VERIFY_STEPS[vStep]}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {VERIFY_STEPS.map((_, i) => (
                              <span key={i} style={{ height: 4, flex: 1, borderRadius: 999, background: i <= vStep ? '#1B2A3A' : '#E3E9F1', transition: 'background .5s' }} />
                            ))}
                          </div>
                        </div>
                      ) : blocked ? (
                        <div style={{ borderRadius: 12, border: '1px solid #f3c2bd', background: '#fdecec', padding: '13px 15px', fontSize: 13.5, color: '#b42318' }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>No encontramos la matrícula {matricula}</p>
                          <p style={{ margin: '2px 0 0' }}>en la oficina {oficina}. Revisa el número y la oficina antes de pagar.</p>
                        </div>
                      ) : vResult && vResult.disponible ? (
                        <div style={{ borderRadius: 12, border: '1px solid rgba(15,122,82,.3)', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 15px', background: '#E8F5EF' }}>
                            <span style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 999, background: '#0F7A52', color: '#fff' }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </span>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0F7A52' }}>Encontramos tu inmueble</p>
                          </div>
                          {(() => {
                            // El SNR a veces devuelve "SIN DIRECCION" (predios sin dirección registrada) → no lo mostramos crudo.
                            const dir = vResult.direccion && !/sin\s*direcci/i.test(vResult.direccion) ? vResult.direccion : null;
                            const text = dir
                              ? `${dir}${vResult.circulo ? ' · ' + vResult.circulo : ''}`
                              : vResult.circulo ? `Inmueble registrado en ${vResult.circulo}` : null;
                            return text ? (
                              <p style={{ margin: 0, padding: '10px 15px', borderTop: '1px solid rgba(15,122,82,.18)', fontSize: 13, color: '#5B6B7E' }}>{text}</p>
                            ) : null;
                          })()}
                        </div>
                      ) : null}

                      <dl style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14 }}>
                          <dt style={{ color: '#5B6B7E' }}>Oficina</dt>
                          <dd style={{ margin: 0, fontWeight: 600, color: '#0D1B2A' }}>{oficina}</dd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14 }}>
                          <dt style={{ color: '#5B6B7E' }}>Matrícula</dt>
                          <dd style={{ margin: 0, fontWeight: 600, fontFamily: 'ui-monospace,monospace', color: '#0D1B2A' }}>{matricula}</dd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 11, borderTop: '1px solid #E3E9F1' }}>
                          <dt style={{ fontWeight: 600, fontSize: 15, color: '#0D1B2A' }}>Total · {PLANS[plan].label}</dt>
                          <dd style={{ margin: 0, fontWeight: 800, fontSize: 19, color: '#0D1B2A', fontVariantNumeric: 'tabular-nums' }}>{planPrice}</dd>
                        </div>
                      </dl>

                      {!blocked && !validating && (
                        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: 0, padding: '11px 14px', borderRadius: 11, background: '#E8F5EF', fontSize: 12.5, lineHeight: 1.5, color: '#0F7A52' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                          {vResult && vResult.disponible ? 'Verificada. Te llega por correo y/o WhatsApp en minutos.' : 'Si la matrícula no existe, te devolvemos el pago automáticamente.'}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 11 }}>
                        <button type="button" onClick={() => setStep('form')} className="transition hover:text-[var(--foreground)]" style={{ flex: 1, borderRadius: 12, border: '1px solid #CFD9E6', background: '#fff', padding: 13, cursor: 'pointer', fontWeight: 600, fontSize: 15, color: '#5B6B7E' }}>
                          {blocked ? 'Corregir matrícula' : 'Corregir'}
                        </button>
                        {!blocked && (
                          <button type="button" onClick={confirmAndPay} disabled={validating} className="transition hover:brightness-110 disabled:opacity-60" style={{ flex: 1.4, border: 'none', borderRadius: 12, background: '#1B2A3A', padding: 13, cursor: 'pointer', fontWeight: 600, fontSize: 15, color: '#fff' }}>
                            {validating ? 'Verificando…' : 'Confirmar y pagar'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PAYING */}
                  {step === 'paying' && (
                    <div className="ctl-fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 10px', textAlign: 'center' }}>
                      <span style={{ width: 34, height: 34, borderRadius: 999, border: '3px solid #E3E9F1', borderTopColor: '#1B2A3A', animation: 'cz-spin .7s linear infinite' }} />
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#0D1B2A' }}>Redirigiendo a la pasarela segura de Wompi…</p>
                      <p style={{ margin: 0, fontSize: 13, color: '#8593A3' }}>No cierres esta ventana.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
