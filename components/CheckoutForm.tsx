'use client';

import { useState, useEffect, type FormEvent } from 'react';
import OficinaSelect from './OficinaSelect';

const VERIFY_STEPS = ['Conectando con el registro…', 'Buscando tu matrícula…', 'Confirmando la información…'];

export default function CheckoutForm({ priceLabel }: { priceLabel: string }) {
  const [matricula, setMatricula] = useState('');
  const [oficina, setOficina] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  // Validación de la matrícula ANTES de pagar
  const [validating, setValidating] = useState(false);
  const [vStep, setVStep] = useState(0);
  const [vResult, setVResult] = useState<{ disponible: boolean | null; estado: string | null; direccion: string | null; circulo: string | null; mocked?: boolean; error?: string } | null>(null);

  // mensajes de progreso que avanzan mientras valida (para no preocupar al cliente)
  useEffect(() => {
    if (!validating) { setVStep(0); return; }
    const iv = setInterval(() => setVStep((s) => Math.min(s + 1, VERIFY_STEPS.length - 1)), 2800);
    return () => clearInterval(iv);
  }, [validating]);

  // Paso 1: validar campos, abrir el modal y CONSULTAR la matrícula (muestra la dirección real).
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!oficina) { setError('Selecciona la oficina de registro'); return; }
    if (!matricula.trim()) { setError('Ingresa tu matrícula inmobiliaria'); return; }
    if (!email.trim()) { setError('Ingresa tu correo electrónico (ahí te enviamos el certificado)'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Revisa tu correo electrónico, parece inválido'); return; }
    setConfirm(true);
    setVResult(null);
    setValidating(true);
    fetch('/api/validar', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ oficina, matricula: matricula.trim() }),
    })
      .then((r) => r.json())
      .then((j) => setVResult(j))
      .catch(() => setVResult({ disponible: null, estado: null, direccion: null, circulo: null, error: 'red' }))
      .finally(() => setValidating(false));
  }

  // ¿se puede pagar? sí salvo que la validación sea CONCLUYENTE (no mock/error) y diga que no existe.
  const blocked = !!vResult && !vResult.mocked && !vResult.error && vResult.disponible === false;

  // Paso 2: el cliente confirmó → crear orden y redirigir a Wompi.
  async function confirmAndPay() {
    if (blocked || validating) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ matricula, oficina, email, phone }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || 'Ocurrió un error');
        setConfirm(false);
        setLoading(false);
        return;
      }
      window.location.href = j.checkoutUrl;
    } catch {
      setError('Error de conexión, intenta de nuevo');
      setConfirm(false);
      setLoading(false);
    }
  }

  const input =
    'w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--brand-ring)] focus:ring-4 focus:ring-[var(--brand-50)] disabled:cursor-not-allowed disabled:opacity-60';
  const labelText = 'text-sm font-semibold text-[var(--foreground)]';

  return (
    <>
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1.5">
        <span className={labelText}>Oficina de Registro</span>
        <OficinaSelect value={oficina} onChange={setOficina} disabled={loading} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelText}>Matrícula Inmobiliaria</span>
        <input
          required
          inputMode="numeric"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ''))}
          placeholder="Ej: 168410"
          disabled={loading}
          className={`${input} font-mono tracking-wide`}
        />
        <span className="text-xs text-[var(--muted)]">Solo números, como aparece en tu escritura o recibo predial.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelText}>Correo electrónico</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          disabled={loading}
          autoComplete="email"
          className={input}
        />
        <span className="text-xs text-[var(--muted)]">Aquí te enviamos tu certificado en PDF.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelText}>
          WhatsApp <span className="font-normal text-[var(--muted-2)]">(opcional)</span>
        </span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+57 300 000 0000"
          disabled={loading}
          inputMode="tel"
          autoComplete="tel"
          className={input}
        />
      </label>

      <p className="flex items-start gap-2 rounded-lg bg-[var(--brand-50)] px-3 py-2.5 text-xs leading-snug text-[var(--brand-700)]">
        <svg className="mt-px size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Te enviamos el certificado a tu correo. El WhatsApp es opcional, como respaldo.
      </p>

      {error && (
        <p
          role="alert"
          className="ctl-fade-up flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <svg className="mt-px size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-4 text-base font-semibold text-white shadow-[0_8px_20px_-6px_rgba(16,58,115,0.5)] transition hover:bg-[var(--brand-600)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 rounded-full border-2 border-white/40 border-t-white"
              style={{ animation: 'ctl-spin 0.7s linear infinite' }}
            />
            Redirigiendo a pago seguro…
          </>
        ) : (
          <>
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pagar {priceLabel}
          </>
        )}
      </button>

      <p className="text-center text-xs text-[var(--muted-2)]">
        Al continuar serás redirigido a la pasarela segura de Wompi.
      </p>
    </form>

    {confirm && (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(13,27,42,0.5)] p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        onClick={() => !loading && setConfirm(false)}
      >
        <div
          className="ctl-fade-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[var(--border)] bg-[var(--brand-50)] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">Revisa antes de pagar</p>
            <p className="text-sm text-[var(--muted)]">Verificamos tu matrícula antes de cobrarte.</p>
          </div>

          {validating ? (
            <div className="flex flex-col gap-2.5 px-5 pt-4">
              <div className="flex items-center gap-3 text-[14px] font-semibold text-[var(--foreground)]">
                <span aria-hidden className="size-4 shrink-0 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--brand)]" style={{ animation: 'ctl-spin 0.7s linear infinite' }} />
                <span key={vStep} className="ctl-fade-up">{VERIFY_STEPS[vStep]}</span>
              </div>
              <p className="text-[12px] leading-snug text-[var(--muted-2)]">Consultamos el registro oficial <strong>en vivo</strong> — puede tomar unos segundos. No cierres esta ventana.</p>
              <div className="mt-0.5 flex gap-1.5">
                {VERIFY_STEPS.map((_, i) => (
                  <span key={i} className="h-1 flex-1 rounded-full transition-colors duration-500" style={{ background: i <= vStep ? 'var(--brand)' : 'var(--border)' }} />
                ))}
              </div>
            </div>
          ) : blocked ? (
            <div className="mx-5 mt-4 rounded-xl border border-[#f3c2bd] bg-[#fdecec] px-4 py-3 text-[13px] text-[#b42318]">
              <p className="font-semibold">No encontramos la matrícula {matricula}</p>
              <p className="mt-0.5">en la oficina {oficina}. Revisa el número y la oficina antes de pagar.</p>
            </div>
          ) : vResult && vResult.disponible ? (
            <div className="mx-5 mt-4 overflow-hidden rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-50)]">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-[var(--accent)] text-white"><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <p className="text-[14px] font-semibold text-[var(--accent)]">Encontramos tu inmueble</p>
              </div>
              {(vResult.direccion || vResult.circulo) && (
                <p className="border-t border-[var(--accent)]/20 bg-white px-4 py-2 text-[13px] text-[var(--muted)]">
                  {vResult.direccion}{vResult.direccion && vResult.circulo ? ' · ' : ''}{vResult.circulo}
                </p>
              )}
            </div>
          ) : null}

          <dl className="flex flex-col gap-3 px-5 py-4 text-[14px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">Oficina</dt>
              <dd className="font-semibold text-[var(--foreground)]">{oficina}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">Matrícula</dt>
              <dd className="font-mono font-semibold text-[var(--foreground)]">{matricula}</dd>
            </div>
            {email.trim() && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">Correo</dt>
                <dd className="truncate font-medium text-[var(--foreground)]">{email}</dd>
              </div>
            )}
            {phone.trim() && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">WhatsApp</dt>
                <dd className="font-medium text-[var(--foreground)]">{phone}</dd>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
              <dt className="font-semibold text-[var(--foreground)]">Total</dt>
              <dd className="text-lg font-bold text-[var(--foreground)]">{priceLabel}</dd>
            </div>
          </dl>

          {!blocked && !validating && (
            <p className="mx-5 mb-4 flex items-start gap-2 rounded-lg bg-[var(--accent-50)] px-3 py-2.5 text-xs leading-snug text-[var(--accent)]">
              <svg className="mt-px size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
              </svg>
              {vResult && vResult.disponible
                ? 'Verificada. Te llega por correo y/o WhatsApp en minutos.'
                : 'Si la matrícula no existe, te devolvemos el pago automáticamente.'}
            </p>
          )}

          <div className="flex gap-3 border-t border-[var(--border)] px-5 py-4">
            <button
              type="button"
              onClick={() => setConfirm(false)}
              disabled={loading}
              className={`${blocked ? 'flex-1' : 'flex-1'} rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[15px] font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:opacity-60`}
            >
              {blocked ? 'Corregir matrícula' : 'Corregir'}
            </button>
            {!blocked && (
              <button
                type="button"
                onClick={confirmAndPay}
                disabled={loading || validating}
                className="flex-[1.4] inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[var(--brand-600)] disabled:opacity-60"
              >
                {loading ? (
                  <><span aria-hidden className="size-4 rounded-full border-2 border-white/40 border-t-white" style={{ animation: 'ctl-spin 0.7s linear infinite' }} /> Redirigiendo…</>
                ) : validating ? 'Verificando…' : 'Confirmar y pagar'}
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
