'use client';

import { useState, useEffect } from 'react';
import OficinaSelect from './OficinaSelect';
import { Seal } from './Brand';
import { PLANS, formatCOP, type PlanId } from '@/lib/config';

const VERIFY_STEPS = ['Conectando con el registro…', 'Buscando tu matrícula…', 'Confirmando la información…'];

type Step = 'form' | 'review' | 'paying';
type VResult = { disponible: boolean | null; estado: string | null; direccion: string | null; circulo: string | null; mocked?: boolean; error?: string };

export default function CheckoutForm() {
  const [step, setStep] = useState<Step>('form');
  const [plan, setPlan] = useState<PlanId>('express'); // Express por defecto = mayor conversión
  const [matricula, setMatricula] = useState('');
  const [oficina, setOficina] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [vStep, setVStep] = useState(0);
  const [vResult, setVResult] = useState<VResult | null>(null);

  // Mensajes de progreso mientras valida
  useEffect(() => {
    if (!validating) { setVStep(0); return; }
    const iv = setInterval(() => setVStep((s) => Math.min(s + 1, VERIFY_STEPS.length - 1)), 2800);
    return () => clearInterval(iv);
  }, [validating]);

  function submit() {
    setError(null);
    if (!oficina) { setError('Selecciona la oficina de registro'); return; }
    if (!matricula.trim()) { setError('Ingresa tu matrícula inmobiliaria'); return; }
    if (!cedula.trim()) { setError('Ingresa tu número de cédula o NIT'); return; }
    if (!email.trim()) { setError('Ingresa tu correo electrónico'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Revisa tu correo, parece inválido'); return; }
    if (email !== emailConfirm) { setError('Los correos electrónicos no coinciden'); return; }
    
    // WhatsApp obligatorio
    let waD = phone.replace(/\D/g, '');
    if (waD.startsWith('00')) waD = waD.slice(2);
    if (waD.length === 10 && waD.startsWith('3')) waD = '57' + waD;
    if (waD.length < 8 || waD.length > 15) {
      setError('Ingresa tu teléfono / WhatsApp válido (ej: +57 300…)'); return;
    }

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

  const blocked = !!vResult && !vResult.mocked && !vResult.error && vResult.disponible === false;

  async function confirmAndPay() {
    if (blocked || validating) return;
    setError(null); setLoading(true); setStep('paying');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ matricula, oficina, email, phone, plan, cedula }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || 'Ocurrió un error'); setStep('form'); setLoading(false); return; }
      window.location.href = j.checkoutUrl;
    } catch {
      setError('Error de conexión, intenta de nuevo'); setStep('form'); setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-2xl border border-[var(--border-strong)] bg-[#f9fafb] px-4 py-3 text-[14.5px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--brand-ring)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-50)]';
  const labelCls = 'mb-1.5 block text-[13.5px] font-semibold text-[var(--foreground)]';

  const planPrice = formatCOP(PLANS[plan].priceCop);

  return (
    <div className="w-full rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-xl sm:rounded-[28px] sm:p-8">
      {/* FORM */}
      {step === 'form' && (
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="border-b border-[var(--border)] pb-4 sm:pb-5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">Solicita tu certificado</h2>
            <p className="mt-1 text-sm sm:text-[14.5px] text-[var(--muted)]">Llena estos datos para generar tu documento.</p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            
            {/* PLAN SELECTION */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className={labelCls}>Elige la velocidad de entrega</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['basico', 'express'] as PlanId[]).map((pid) => {
                  const p = PLANS[pid];
                  const sel = plan === pid;
                  return (
                    <button
                      type="button"
                      key={pid}
                      onClick={() => setPlan(pid)}
                      aria-pressed={sel}
                      className={`relative flex flex-col items-start rounded-2xl border-2 p-3.5 sm:p-4 text-left transition-all ${
                        sel 
                          ? 'border-[var(--brand)] bg-[var(--brand-50)] shadow-sm' 
                          : 'border-[var(--border)] bg-white hover:border-[var(--brand-ring)]'
                      }`}
                    >
                      {p.recommended && (
                        <span className="absolute -top-3 right-3 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm">
                          RECOMENDADO
                        </span>
                      )}
                      <div className="flex w-full items-center justify-between">
                        <span className="text-[15px] font-bold text-[var(--foreground)]">{p.label}</span>
                        <div className={`flex size-5 items-center justify-center rounded-full border-2 ${sel ? 'border-[var(--brand)]' : 'border-[var(--border-strong)]'}`}>
                          {sel && <div className="size-2.5 rounded-full bg-[var(--brand)]" />}
                        </div>
                      </div>
                      <span className="mt-1 text-lg font-black text-[var(--brand)]">{formatCOP(p.priceCop)}</span>
                      <ul className="mt-2 flex flex-col gap-1 text-[11px] text-[var(--muted)]">
                        {p.features.slice(0, 2).map((f) => (
                          <li key={f} className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
              <label>
                <span className={labelCls}>Oficina de Registro</span>
                <OficinaSelect value={oficina} onChange={setOficina} />
              </label>
              <label>
                <span className={labelCls}>Matrícula Inmobiliaria</span>
                <input value={matricula} onChange={(e) => { setMatricula(e.target.value.replace(/\D/g, '')); setError(null); }} inputMode="numeric" placeholder="Ej: 168410" className={`${inputCls} font-mono`} />
              </label>
            </div>

            <label>
              <span className={labelCls}>Número de Cédula o NIT</span>
              <input value={cedula} onChange={(e) => { setCedula(e.target.value.replace(/\D/g, '')); setError(null); }} inputMode="numeric" placeholder="Ej: 1020304050" className={inputCls} />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
              <label>
                <span className={labelCls}>Correo Electrónico</span>
                <input value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" className={inputCls} />
              </label>
              <label>
                <span className={labelCls}>Confirmar Correo</span>
                <input value={emailConfirm} onChange={(e) => { setEmailConfirm(e.target.value); setError(null); }} type="email" autoComplete="email" placeholder="Repite tu correo" className={inputCls} />
              </label>
            </div>

            <label>
              <span className={labelCls}>Teléfono / WhatsApp</span>
              <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(null); }} inputMode="tel" autoComplete="tel" placeholder="+57 300 000 0000" className={inputCls} />
            </label>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="terms" className="size-4 rounded border-gray-300 text-[var(--brand)] focus:ring-[var(--brand)]" defaultChecked />
              <label htmlFor="terms" className="text-xs text-[var(--muted-2)]">
                Acepto los <a href="#" className="underline">Términos y Condiciones</a> y autorizo el tratamiento de mis datos personales.
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
                {error}
              </div>
            )}

            {/* Botón Sticky en Móvil */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-2 border-t border-[var(--border)] bg-white p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:z-auto mt-2">
              <button type="button" onClick={submit} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] py-4 text-[17px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(119,75,120,0.5)] transition hover:bg-[var(--brand-600)] active:scale-[0.99]">
                Validar y continuar
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <p className="text-center text-[11px] text-[var(--muted-2)] sm:text-xs">Validamos tu matrícula antes de cobrarte.</p>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === 'review' && (
        <div className="flex flex-col gap-5">
          <div className="border-b border-[var(--border)] pb-4">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Revisa tu solicitud</h2>
            <p className="mt-1 text-[13.5px] text-[var(--muted)]">Confirma los datos antes de proceder al pago.</p>
          </div>

          {validating ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[var(--brand-50)] p-4 font-semibold text-[var(--foreground)]">
                <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--brand)]" />
                <span key={vStep} className="animate-pulse">{VERIFY_STEPS[vStep]}</span>
              </div>
            </div>
          ) : blocked ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-bold">No encontramos la matrícula {matricula}</p>
              <p className="mt-1">En la oficina {oficina}. Por favor corrige los datos.</p>
            </div>
          ) : vResult && vResult.disponible ? (
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-green-50">
              <div className="flex items-center gap-2.5 bg-green-100/50 p-4">
                <div className="flex size-6 items-center justify-center rounded-full bg-green-600 text-white">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <p className="font-bold text-green-800">¡Inmueble verificado!</p>
              </div>
              {vResult.direccion && !/sin\s*direcci/i.test(vResult.direccion) && (
                <p className="p-4 text-sm text-green-700">{vResult.direccion} {vResult.circulo && `· ${vResult.circulo}`}</p>
              )}
            </div>
          ) : null}

          {!blocked && !validating && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-green-50 p-4 text-[13.5px] text-green-800">
              <svg className="mt-0.5 size-5 shrink-0 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              <p>
                {vResult && vResult.disponible 
                  ? 'Verificada. Te llega por correo y/o WhatsApp en minutos.' 
                  : 'Si la matrícula no existe, te devolvemos el pago automáticamente.'}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] p-5 text-[14.5px]">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Oficina</span>
              <span className="font-semibold text-[var(--foreground)]">{oficina}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Matrícula</span>
              <span className="font-mono font-bold text-[var(--foreground)]">{matricula}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-4 text-lg">
              <span className="font-bold text-[var(--foreground)]">Total ({PLANS[plan].label})</span>
              <span className="font-black text-[var(--brand)]">{planPrice}</span>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-[var(--border)] bg-white p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] sm:static sm:flex-row sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:z-auto">
            <button type="button" onClick={() => setStep('form')} className="order-2 w-full rounded-2xl border border-[var(--border-strong)] bg-white py-3.5 text-[15px] font-bold text-[var(--muted)] hover:bg-gray-50 transition sm:order-1 sm:w-1/3">
              Volver
            </button>
            {!blocked && (
              <button type="button" onClick={confirmAndPay} disabled={validating} className="order-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] py-3.5 text-[16px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(119,75,120,0.5)] transition hover:bg-[var(--brand-600)] disabled:opacity-50 sm:order-2 sm:w-2/3">
                {validating ? 'Verificando...' : 'Confirmar y Pagar'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PAYING */}
      {step === 'paying' && (
        <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
          <span className="size-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--brand)]" />
          <div>
            <p className="text-lg font-bold text-[var(--foreground)]">Conectando con pasarela segura...</p>
            <p className="text-sm text-[var(--muted)]">Serás redirigido a Wompi en unos segundos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
