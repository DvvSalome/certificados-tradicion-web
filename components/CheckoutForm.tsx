'use client';

import { useState, type FormEvent } from 'react';
import { OFICINAS } from '@/lib/oficinas';

export default function CheckoutForm({ priceLabel }: { priceLabel: string }) {
  const [matricula, setMatricula] = useState('');
  const [oficina, setOficina] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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
        setLoading(false);
        return;
      }
      window.location.href = j.checkoutUrl;
    } catch {
      setError('Error de conexión, intenta de nuevo');
      setLoading(false);
    }
  }

  const input =
    'w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--brand-ring)] focus:ring-4 focus:ring-[var(--brand-50)] disabled:cursor-not-allowed disabled:opacity-60';
  const labelText = 'text-sm font-semibold text-[var(--foreground)]';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1.5">
        <span className={labelText}>Oficina de Registro</span>
        <select
          required
          value={oficina}
          onChange={(e) => setOficina(e.target.value)}
          disabled={loading}
          className={`${input} ${oficina ? '' : 'text-[var(--muted-2)]'} pr-11`}
        >
          <option value="">Selecciona la oficina…</option>
          {OFICINAS.map((o) => (
            <option key={o} value={o} className="text-[var(--foreground)]">
              {o}
            </option>
          ))}
        </select>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          disabled={loading}
          autoComplete="email"
          className={input}
        />
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
        Te enviamos el certificado por correo y/o WhatsApp. Ingresa al menos uno.
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
  );
}
