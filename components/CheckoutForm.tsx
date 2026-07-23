'use client';

import { useState, useEffect, useRef } from 'react';
import OficinaSelect from './OficinaSelect';
import { oficinaCode } from '@/lib/oficinas';
import { PLANS, formatCOP, type PlanId } from '@/lib/config';

type VResult = { disponible: boolean | null; estado: string | null; direccion: string | null; circulo: string | null; mocked?: boolean; error?: string };

const ID_TYPES = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PAS', label: 'Pasaporte' }
];

export default function CheckoutForm() {
  const [plan, setPlan] = useState<PlanId>('basico');

  // Los planes del hero (HeroPlans) preseleccionan aquí vía evento: el visitante toca
  // "Certi Express" arriba y el formulario ya viene con ese plan elegido.
  useEffect(() => {
    const onPlan = (e: Event) => {
      const p = (e as CustomEvent).detail;
      if (p === 'basico' || p === 'express' || p === 'avanzado') setPlan(p);
    };
    window.addEventListener('cz-plan', onPlan as EventListener);
    return () => window.removeEventListener('cz-plan', onPlan as EventListener);
  }, []);
  
  // Propiedad
  const [oficina, setOficina] = useState('');
  const [matricula, setMatricula] = useState('');
  
  // Comprador
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoId, setTipoId] = useState('CC');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phone, setPhone] = useState('');

  // Checks
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  // Plan Avanzado: consulta antecedentes del propietario → se exige declarar autorización.
  const [consentAntecedentes, setConsentAntecedentes] = useState(false);
  const needsConsent = !!PLANS[plan].requiresConsent;
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form'|'paying'>('form');
  // Resalta las casillas obligatorias cuando el usuario intenta pagar sin marcarlas.
  const [flagChecks, setFlagChecks] = useState(false);
  
  // Validation State
  const [validating, setValidating] = useState(false);
  const [vResult, setVResult] = useState<VResult | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Load saved data
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('crt_email');
      const savedPhone = localStorage.getItem('crt_phone');
      const savedCedula = localStorage.getItem('crt_cedula');
      const savedNombres = localStorage.getItem('crt_nombres');
      const savedApellidos = localStorage.getItem('crt_apellidos');
      if (savedEmail) { setEmail(savedEmail); setEmailConfirm(savedEmail); }
      if (savedPhone) setPhone(savedPhone);
      if (savedCedula) setCedula(savedCedula);
      if (savedNombres) setNombres(savedNombres);
      if (savedApellidos) setApellidos(savedApellidos);
    } catch (e) {}
  }, []);

  const inFlight = useRef(false);
  async function validarMatricula(silent = false) {
    if (!oficina || !matricula.trim()) {
      if (!silent) setError('Por favor selecciona la oficina de registro e ingresa la matrícula inmobiliaria primero.');
      return;
    }
    // Guard: no lanzar validaciones duplicadas simultáneas (el debounce + onBlur podían disparar varias).
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setValidating(true);
    setVResult(null);

    try {
      const r = await fetch('/api/validar', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ oficina, matricula: matricula.trim() }),
      });
      const j = await r.json();
      setVResult(j);
    } catch {
      setVResult({ disponible: null, estado: null, direccion: null, circulo: null, error: 'Error de red al consultar' });
    } finally {
      inFlight.current = false;
      setValidating(false);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (oficina && matricula.trim().length >= 2 && !vResult && !validating) {
        validarMatricula(true);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [oficina, matricula, vResult, validating]);

  const isVerified = vResult?.disponible === true;
  // "No encontrada" GENUINO (el SNR dijo claramente que no existe). Un error/timeout NO es rechazo.
  const isRejected = vResult?.disponible === false && !vResult?.error;
  // No se pudo verificar (portal del SNR caído/lento/en mantenimiento). NO dejamos pagar: si no podemos
  // verificar, tampoco vamos a poder generar → mejor "intenta más tarde" que cobrar y devolver.
  const isUnverified = !!vResult && !isVerified && !isRejected;
  const canProceed = isVerified;

  const isFormComplete =
    canProceed &&
    nombres.trim().length > 0 &&
    apellidos.trim().length > 0 &&
    cedula.trim().length > 0 &&
    email.trim().length > 0 &&
    email === emailConfirm &&
    phone.trim().length > 7 &&
    termsAccepted &&
    privacyAccepted &&
    (!needsConsent || consentAntecedentes);

  async function confirmAndPay() {
    if (!isFormComplete || loading || validating) {
      if (!canProceed) setError(isRejected ? 'No encontramos esa matrícula en esa oficina. Verifica los datos.' : isUnverified ? 'El portal oficial del SNR no está disponible en este momento. Intenta más tarde.' : 'Ingresa la oficina y la matrícula inmobiliaria primero.');
      else if (!nombres.trim() || !apellidos.trim()) setError('Debes ingresar nombres y apellidos.');
      else if (!cedula.trim()) setError('Ingresa tu número de identificación.');
      else if (!email.trim() || email !== emailConfirm) setError('Revisa que los correos coincidan.');
      else if (phone.trim().length < 8) setError('Ingresa un teléfono válido.');
      else if (!termsAccepted || !privacyAccepted) {
        setError('Te falta marcar las casillas de términos y privacidad (son obligatorias).');
        setFlagChecks(true);
        document.getElementById('aceptaciones')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else if (needsConsent && !consentAntecedentes) {
        setError(`Para el plan ${PLANS[plan].label} debes confirmar que cuentas con la autorización del propietario para verificar sus antecedentes.`);
        document.getElementById('consent-antecedentes')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setError(null);
    setLoading(true);
    setStep('paying');

    // Meta: inicio de checkout (el Purchase se marca en /estado al confirmarse el pago).
    (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.('track', 'InitiateCheckout', {
      value: PLANS[plan].priceCop,
      currency: 'COP',
    });

    try {
      localStorage.setItem('crt_email', email.trim());
      localStorage.setItem('crt_phone', phone.trim());
      localStorage.setItem('crt_cedula', cedula.trim());
      localStorage.setItem('crt_nombres', nombres.trim());
      localStorage.setItem('crt_apellidos', apellidos.trim());
    } catch (e) {}

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          matricula: matricula.trim(),
          oficina,
          email: email.trim(),
          phone: phone.trim(),
          plan,
          cedula: cedula.trim(),
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          tipoId,
          termsAccepted,
          privacyAccepted,
          consentAntecedentes: needsConsent ? consentAntecedentes : undefined
        }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || 'Ocurrió un error al procesar el pago'); setLoading(false); setStep('form'); return; }
      window.location.href = j.checkoutUrl;
    } catch {
      setError('Error de conexión, intenta de nuevo');
      setLoading(false);
      setStep('form');
    }
  }

  const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14.5px] text-[var(--foreground)] outline-none transition focus:border-[var(--brand-ring)] focus:ring-4 focus:ring-[var(--brand-50)] placeholder:text-gray-400";
  const labelCls = "mb-1.5 block text-[13px] font-semibold text-[var(--foreground)]";
  const sectionTitleCls = "text-[13px] sm:text-sm font-extrabold uppercase tracking-widest text-[#84cc16] mb-6 mt-10 border-b border-[#d9f99d] pb-2";

  return (
    <div className="w-full relative pb-40 sm:pb-0">
      <div className="rounded-[24px] sm:rounded-[28px] border border-[var(--border)] bg-[#fafafa] p-5 sm:p-8 shadow-sm">
        
        <h2 className="text-center text-2xl sm:text-[28px] font-extrabold uppercase leading-tight tracking-tight text-[#84cc16] mb-2">
          Compra tu Certificado de Tradición y Libertad
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-500 mb-2">
          Completa el formulario y obtén tu certificado de tradición en ¡segundos!
        </p>

        {error && (
          <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 flex items-start gap-3">
            <svg className="size-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}


        {/* SECTION 1: PROPIEDAD */}
        <h3 className="text-[13px] sm:text-sm font-extrabold uppercase tracking-widest text-[#84cc16] mb-6 mt-6 border-b border-[#d9f99d] pb-2">
          Información de la propiedad
        </h3>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Oficina de registro <span className="text-red-500">*</span></span>
            <OficinaSelect value={oficina} onChange={(v) => { setOficina(v); setVResult(null); setError(null); }} />
          </label>
          <label>
            <span className={labelCls}>Matrícula inmobiliaria <span className="text-red-500">*</span></span>
            <input
              value={matricula}
              onChange={(e) => { setMatricula(e.target.value.replace(/\D/g, '')); setVResult(null); setError(null); }}
              onBlur={() => validarMatricula(true)}
              inputMode="numeric"
              placeholder="Ej: 12345 (sin la oficina)"
              className={`${inputCls} font-mono`}
            />
          </label>
        </div>

        {/* Validation Bar */}
        <div className="mt-4">
          
          {validating && (
             <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="font-mono font-bold text-gray-700">Matrícula: <span className="text-purple-600">{oficinaCode(oficina) || '—'} - {matricula}</span></div>
                </div>
                <button disabled className="rounded-xl bg-[#a47cf6] opacity-80 px-6 py-2.5 text-sm font-bold text-white flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Consultando...
                </button>
             </div>
          )}

          {isVerified && !validating && (
             <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-gray-800">
                      Matrícula: <span className="text-green-700">{oficinaCode(oficina) || '—'} - {matricula}</span>
                    </div>
                    {vResult?.direccion && (
                      <div className="text-xs text-green-700 mt-0.5">{vResult.direccion}</div>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => validarMatricula(false)} className="text-xs font-bold text-green-700 underline hover:text-green-800">
                  Volver a consultar
                </button>
             </div>
          )}

          {isRejected && !validating && (
             <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-red-500 text-white">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-red-800">
                      No encontrada: {oficinaCode(oficina) || '—'} - {matricula}
                    </div>
                    <div className="text-xs text-red-600 mt-0.5">Verifica los datos e intenta de nuevo.</div>
                  </div>
                </div>
                <button type="button" onClick={() => validarMatricula(false)} className="text-xs font-bold text-red-700 underline hover:text-red-800">
                  Reintentar
                </button>
             </div>
          )}

          {isUnverified && !validating && (
             <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white mt-0.5">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                  </div>
                  <div>
                    <div className="font-bold text-amber-800 text-[13.5px]">El portal oficial del SNR no está disponible</div>
                    <div className="text-xs text-amber-700 mt-0.5 max-w-md">El portal de la Superintendencia de Notariado y Registro puede estar en mantenimiento o caído. <b>No podemos procesar el pago hasta poder verificar tu matrícula.</b> Por favor, intenta de nuevo en unos minutos.</div>
                  </div>
                </div>
                <button type="button" onClick={() => validarMatricula(false)} className="text-xs font-bold text-amber-700 underline hover:text-amber-800 shrink-0">
                  Reintentar
                </button>
             </div>
          )}
        </div>

        {/* SECTION 2: COMPRADOR */}
        <h3 className={sectionTitleCls}>Información del comprador</h3>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-5">
          <label>
            <span className={labelCls}>Nombres <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <input value={nombres} onChange={(e) => { setNombres(e.target.value); setError(null); }} placeholder="Nombres" className={`${inputCls} pl-10`} />
            </div>
          </label>
          <label>
            <span className={labelCls}>Apellidos <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <input value={apellidos} onChange={(e) => { setApellidos(e.target.value); setError(null); }} placeholder="Apellidos" className={`${inputCls} pl-10`} />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-5">
          <label>
            <span className={labelCls}>Tipo de identificación <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
              </div>
              <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} className={`${inputCls} pl-10 appearance-none`}>
                {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </label>
          <label>
            <span className={labelCls}>Número de identificación <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
              </div>
              <input value={cedula} onChange={(e) => { setCedula(e.target.value.replace(/\D/g, '')); setError(null); }} inputMode="numeric" placeholder="Número del documento" className={`${inputCls} pl-10`} />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-5">
          <label>
            <span className={labelCls}>Correo electrónico <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <input value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} type="email" placeholder="ejemplo@correo.com" className={`${inputCls} pl-10`} />
            </div>
          </label>
          <label>
            <span className={labelCls}>Confirma tu correo <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <input value={emailConfirm} onChange={(e) => { setEmailConfirm(e.target.value); setError(null); }} type="email" placeholder="Repite tu correo" className={`${inputCls} pl-10`} />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
           <label>
            <span className={labelCls}>Teléfono / WhatsApp <span className="text-red-500">*</span></span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <input value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^\d+\s]/g, '')); setError(null); }} inputMode="tel" placeholder="+57 300 000 0000" className={`${inputCls} pl-10`} />
            </div>
          </label>
        </div>

        {/* SECTION 3: CHECKBOXES AND PLAN. flagChecks: si intentó pagar sin marcarlas,
            la sección se enmarca en rojo y recibe el scroll (antes el botón muerto no decía nada). */}
        <div id="aceptaciones" className={`flex flex-col gap-4 mb-10 pt-4 border-t border-gray-100 transition-all ${flagChecks ? 'rounded-xl ring-2 ring-red-400 bg-red-50 p-4' : ''}`}>
          {flagChecks && (
            <p className="text-[12.5px] font-bold text-red-600">Marca estas dos casillas para poder pagar:</p>
          )}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => { setTermsAccepted(e.target.checked); setFlagChecks(false); setError(null); }}
              className="mt-0.5 size-5 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
            />
            <span className="text-[14.5px] text-[var(--foreground)]">
              Acepto los <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="underline font-semibold hover:text-[#0066ff]">términos y condiciones</button> <span className="text-red-500">*</span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => { setPrivacyAccepted(e.target.checked); setFlagChecks(false); setError(null); }}
              className="mt-0.5 size-5 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
            />
            <span className="text-[14.5px] text-[var(--foreground)]">
              Acepto la <button type="button" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }} className="underline font-semibold hover:text-[#0066ff]">política de privacidad de datos</button> y autorizo recibir comunicaciones por WhatsApp. <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* SELECCIONA TU PLAN — al FINAL, justo antes de pagar. Filas a ancho completo (no columnas):
            cada beneficio entra en una línea sin partirse y se compara de un vistazo. */}
        <h3 className="text-[13px] sm:text-sm font-extrabold uppercase tracking-widest text-[#84cc16] mb-4">
          Selecciona tu plan
        </h3>

        <div className="flex flex-col gap-4">
          {(['basico', 'express', 'avanzado'] as PlanId[]).map((pid) => {
            const p = PLANS[pid];
            const sel = plan === pid;
            const badge = p.recommended ? 'RECOMENDADO' : pid === 'avanzado' ? 'MÁS COMPLETO' : null;
            return (
              <label
                key={pid}
                className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 text-left transition-all sm:p-5 ${
                  sel
                    ? 'border-[#84cc16] bg-[#f7fee7] shadow-md ring-1 ring-[#84cc16]'
                    : 'border-gray-200 bg-white hover:border-[#bde875] hover:shadow-sm'
                }`}
              >
                <input type="radio" name="plan" className="sr-only" checked={sel} onChange={() => setPlan(pid)} />
                {badge && (
                  <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-[9.5px] font-bold tracking-wider text-white shadow-sm ${p.recommended ? 'bg-[#84cc16]' : 'bg-[#774B78]'}`}>
                    {badge}
                  </span>
                )}

                {/* Cabecera: nombre + para quién es · precio y selector a la derecha */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[15px] font-extrabold text-[var(--foreground)] sm:text-base">{p.label}</div>
                    <div className="mt-0.5 text-[12px] leading-snug text-gray-500">{p.tagline}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-[21px] font-black leading-none tracking-tight text-[#15803d] sm:text-[23px]">{formatCOP(p.priceCop)}</div>
                      <div className="mt-1 text-[10px] text-gray-500">IVA incluido</div>
                    </div>
                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${sel ? 'border-[#15803d] bg-[#15803d]' : 'border-gray-300'}`}>
                      {sel && <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 grid gap-2 border-t border-gray-100 pt-3 text-[12.5px] leading-snug text-gray-600 sm:grid-cols-2 sm:gap-x-5">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="mt-0.5 size-3.5 shrink-0 text-[#84cc16]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </label>
            );
          })}
        </div>

        {/* Consentimiento obligatorio para planes que consultan antecedentes de terceros (Express y Avanzado) */}
        {needsConsent && (
          <div id="consent-antecedentes" className={`mt-4 overflow-hidden rounded-xl border-2 transition-colors ${consentAntecedentes ? 'border-[#84cc16]' : 'border-amber-300'}`}>
            <div className={`flex items-center gap-2 px-4 py-2 ${consentAntecedentes ? 'bg-[#ecfccb]' : 'bg-amber-50'}`}>
              <svg className={`size-4 shrink-0 ${consentAntecedentes ? 'text-[#4d7c0f]' : 'text-amber-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              <span className={`text-[11px] font-bold uppercase tracking-wide ${consentAntecedentes ? 'text-[#4d7c0f]' : 'text-amber-700'}`}>Autorización del propietario requerida</span>
            </div>
            <label className="flex cursor-pointer items-start gap-3 bg-white p-4">
              <input type="checkbox" className="mt-0.5 size-[18px] shrink-0 accent-[#65a30d]" checked={consentAntecedentes} onChange={(e) => setConsentAntecedentes(e.target.checked)} />
              <span className="text-[12.5px] leading-relaxed text-gray-700">
                Confirmo que <strong>cuento con la autorización del propietario</strong> del inmueble para consultar sus antecedentes judiciales (o que la consulta responde a una finalidad legítima conforme a la ley). Entiendo que <strong>Certitradición actúa únicamente como intermediario</strong> de esta verificación y que soy responsable de contar con dicha autorización.
                <span className="mt-1.5 block text-[11px] text-gray-500">Exigido por la Ley 1581 de 2012 (Habeas Data) para el tratamiento de datos de terceros.</span>
              </span>
            </label>
          </div>
        )}

        {/* FOOTER "Total a pagar": barra que SIGUE EL SCROLL (como LegalCheck).
            Móvil = fija abajo (fixed). Desktop = STICKY: flota sobre el formulario y baja con el scroll
            hasta su posición final al pie de la tarjeta. */}
        <div className="fixed inset-x-0 bottom-0 z-40 sm:sticky sm:inset-x-auto sm:bottom-4 sm:z-30 sm:mt-8">
          <div className="w-full rounded-t-3xl border-t border-gray-200 bg-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:rounded-2xl sm:border sm:p-4 sm:shadow-[0_16px_40px_-12px_rgba(13,27,42,0.28)]">
          <div className="flex flex-col gap-4">
            
            <div className="hidden sm:flex items-center gap-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Plan Seleccionado</div>
                <div className="text-lg font-black text-[#15803d]">{PLANS[plan].label}</div>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total a pagar</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-black">{formatCOP(PLANS[plan].priceCop)}</span>
                  <span className="text-[10px] text-gray-500">IVA incluido</span>
                </div>
              </div>
            </div>

            <div className="flex sm:hidden items-center justify-between px-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{PLANS[plan].label}</div>
                <div className="text-xl font-black text-black">{formatCOP(PLANS[plan].priceCop)}</div>
              </div>
              <div className="text-[10px] text-gray-500">IVA incluido</div>
            </div>

            <div className="flex flex-col w-full">
              {/* SIEMPRE clickeable (salvo pagando/validando): un botón disabled se traga el clic
                  y el visitante nunca se entera de QUÉ le falta. Al clic incompleto, confirmAndPay
                  pinta el error aquí abajo y hace scroll a lo que falte. */}
              <button
                type="button"
                onClick={confirmAndPay}
                disabled={loading || validating}
                className="w-full rounded-xl bg-[#e0f8b8] px-6 py-4 text-center font-bold text-[#3f6212] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-[#d4f39e]"
              >
                {loading || step === 'paying' ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-[#3f6212]/30 border-t-[#3f6212]" />
                    Conectando...
                  </span>
                ) : (
                  <>
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Comprar ahora
                  </>
                )}
              </button>
              {/* El error también se muestra AQUÍ (la barra sigue el scroll): el banner de arriba
                  del formulario queda fuera de pantalla justo cuando el usuario está en el botón. */}
              {error ? (
                <p className="mt-2 text-center text-[12px] font-bold text-red-600">{error}</p>
              ) : (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                   <svg className="size-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                   Compra 100% segura y en pocos minutos
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
      </div>

      {/* MODALS */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold">Términos y Condiciones</h3>
              <button type="button" onClick={() => setShowTerms(false)} className="rounded-full p-1.5 hover:bg-gray-100">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4 text-sm text-gray-600">
              <p className="mb-4">Al utilizar este servicio, el usuario acepta que Certitradición actúa como un intermediario tecnológico para la gestión y obtención del Certificado de Tradición y Libertad emitido por la Superintendencia de Notariado y Registro (SNR).</p>
              <p className="mb-4">1. <strong>Tiempos de entrega:</strong> El tiempo estimado depende de la disponibilidad del sistema de la SNR. No nos hacemos responsables por caídas en la plataforma oficial que retrasen la entrega.</p>
              <p className="mb-4">2. <strong>Exactitud de datos:</strong> Es responsabilidad del usuario proporcionar el número de matrícula y la oficina de registro correctos. No hay devoluciones por errores de digitación por parte del usuario.</p>
              <p className="mb-4">3. <strong>Validez:</strong> El certificado entregado es el documento oficial en formato PDF expedido directamente por la SNR, con toda su validez legal y PIN de verificación.</p>
              <p>4. <strong>Reembolsos:</strong> Solo se procesarán reembolsos si, por motivos de fuerza mayor, no logramos expedir el documento en un plazo máximo de 48 horas hábiles tras el pago.</p>
            </div>
            <div className="border-t p-4">
              <button type="button" onClick={() => setShowTerms(false)} className="w-full rounded-xl bg-[var(--brand)] py-3 font-bold text-white hover:bg-[var(--brand-600)]">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold">Tratamiento de Datos Personales</h3>
              <button type="button" onClick={() => setShowPrivacy(false)} className="rounded-full p-1.5 hover:bg-gray-100">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4 text-sm text-gray-600">
              <p className="mb-4">En cumplimiento de la Ley 1581 de 2012 (Ley de Protección de Datos Personales de Colombia), le informamos lo siguiente:</p>
              <p className="mb-4">1. <strong>Recolección:</strong> Recolectamos su correo electrónico, teléfono/WhatsApp, número de identificación y nombres exclusivamente para la expedición y envío del certificado solicitado.</p>
              <p className="mb-4">2. <strong>Uso de datos:</strong> Sus datos no serán vendidos ni compartidos con terceros para fines publicitarios. Solo se usarán para comunicación transaccional relacionada con su solicitud.</p>
              <p className="mb-4">3. <strong>Encargados:</strong> Intervienen Wompi (pago), Meta/WhatsApp y correo (entrega). En el <strong>plan Express</strong>, el texto del certificado se procesa con inteligencia artificial (vía OpenRouter/Google) solo para generar el Estudio de Títulos; esto implica una transferencia internacional de datos que usted autoriza al solicitarlo.</p>
              <p className="mb-4">4. <strong>Seguridad y conservación:</strong> Usamos pasarelas de pago reguladas (Wompi) y nunca almacenamos los datos de sus tarjetas. El PDF del certificado se conserva de forma temporal (~48 h) solo para reenviárselo, y luego se elimina.</p>
              <p>5. <strong>Derechos del Titular:</strong> Puede solicitar conocer, actualizar, rectificar o eliminar sus datos, o revocar la autorización, escribiendo a certificados@certitradicion.com. Consulte la <a href="/privacidad" target="_blank" className="underline font-semibold">política completa</a>.</p>
            </div>
            <div className="border-t p-4">
              <button type="button" onClick={() => setShowPrivacy(false)} className="w-full rounded-xl bg-[var(--brand)] py-3 font-bold text-white hover:bg-[var(--brand-600)]">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
