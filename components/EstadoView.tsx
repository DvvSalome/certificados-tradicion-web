'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type Variant = 'wait' | 'progress' | 'success' | 'error';

const LABELS: Record<string, { title: string; desc: string; variant: Variant }> = {
  PENDING_PAYMENT: {
    title: 'Esperando confirmación del pago',
    desc: 'Si ya pagaste, esto se actualiza en unos segundos.',
    variant: 'wait',
  },
  PAID: {
    title: 'Pago recibido',
    desc: 'Preparando la generación de tu certificado…',
    variant: 'progress',
  },
  GENERATING: {
    title: 'Generando tu certificado…',
    desc: 'Estamos emitiendo tu CTL ante la SNR. No cierres esta página.',
    variant: 'progress',
  },
  DELIVERED: {
    title: '¡Tu certificado fue enviado!',
    desc: 'Revisa tu correo y/o WhatsApp.',
    variant: 'success',
  },
  FAILED: {
    title: 'El pago no se completó',
    desc: 'No se realizó ningún cobro o fue rechazado. Puedes intentar de nuevo.',
    variant: 'error',
  },
};

// Order of the happy-path timeline.
const FLOW = ['PENDING_PAYMENT', 'PAID', 'GENERATING', 'DELIVERED'] as const;
const STEP_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pago',
  PAID: 'Confirmado',
  GENERATING: 'Generando',
  DELIVERED: 'Enviado',
};

const VARIANT_STYLES: Record<Variant, { card: string; chip: string; icon: ReactNode }> = {
  wait: {
    card: 'border-amber-200 bg-amber-50',
    chip: 'bg-amber-100 text-amber-800',
    icon: <SpinnerIcon className="text-amber-600" />,
  },
  progress: {
    card: 'border-[var(--brand-50)] bg-[var(--brand-50)]',
    chip: 'bg-white text-[var(--brand)]',
    icon: <SpinnerIcon className="text-[var(--brand)]" />,
  },
  success: {
    card: 'border-green-200 bg-green-50',
    chip: 'bg-green-100 text-green-800',
    icon: <CheckBadge className="text-green-600" />,
  },
  error: {
    card: 'border-red-200 bg-red-50',
    chip: 'bg-red-100 text-red-800',
    icon: <AlertIcon className="text-red-600" />,
  },
};

export default function EstadoView() {
  const sp = useSearchParams();
  const ref = sp.get('ref');
  const [status, setStatus] = useState<string | null>(null);
  const [info, setInfo] = useState<{ matricula?: string; oficina?: string }>({});

  useEffect(() => {
    if (!ref) return;
    let active = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/order/${ref}`);
        if (!r.ok || !active) return;
        const j = await r.json();
        setStatus(j.status);
        setInfo({ matricula: j.matricula, oficina: j.oficina });
      } catch {
        /* reintenta en el siguiente tick */
      }
    };
    tick();
    const iv = setInterval(tick, 4000);
    return () => {
      active = false;
      clearInterval(iv);
    };
  }, [ref]);

  if (!ref) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-6 py-10 text-center shadow-sm">
        <AlertIcon className="size-7 text-[var(--muted-2)]" />
        <p className="font-semibold text-[var(--foreground)]">Falta la referencia del pedido</p>
        <p className="max-w-xs text-sm text-[var(--muted)]">
          Abre el enlace que recibiste tras el pago, o vuelve a iniciar tu solicitud.
        </p>
        <a
          href="/"
          className="mt-1 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-600)]"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  const s = status ? LABELS[status] : null;
  const loading = !status;
  const v = s ? VARIANT_STYLES[s.variant] : null;
  const activeIdx = status ? FLOW.indexOf(status as (typeof FLOW)[number]) : -1;
  const showTimeline = status !== 'FAILED';

  return (
    <div className="flex flex-col gap-5">
      {/* Order meta */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
        <span className="font-medium text-[var(--foreground)]">Pedido</span>
        <span className="rounded-md bg-[var(--background)] px-2 py-0.5 font-mono text-xs text-[var(--foreground)]">
          {ref}
        </span>
        {info.oficina && (
          <span className="text-[var(--muted-2)]">
            · {info.oficina} · matrícula <span className="font-mono">{info.matricula}</span>
          </span>
        )}
      </div>

      {/* Status card */}
      {loading ? (
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white px-5 py-6 shadow-sm">
          <SpinnerIcon className="text-[var(--brand)]" />
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">Consultando estado…</p>
            <p className="text-sm text-[var(--muted)]">Buscando tu pedido.</p>
          </div>
        </div>
      ) : s && v ? (
        <div
          key={status}
          className={`ctl-fade-up flex items-start gap-4 rounded-2xl border px-5 py-6 shadow-sm ${v.card}`}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/70 shadow-sm">
            {v.icon}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-semibold leading-tight text-[var(--foreground)]">{s.title}</p>
            <p className="text-sm text-[var(--muted)]">{s.desc}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-white px-5 py-6 shadow-sm">
          <p className="text-lg font-semibold text-[var(--foreground)]">Estado: {status}</p>
        </div>
      )}

      {/* Timeline (happy path) */}
      {showTimeline && (
        <ol className="flex items-center justify-between gap-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-5 shadow-sm">
          {FLOW.map((step, i) => {
            const done = activeIdx > i;
            const current = activeIdx === i;
            return (
              <li key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 rounded ${i === 0 ? 'opacity-0' : done || current ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}`} />
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition ${
                      done
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                        : current
                          ? 'border-[var(--brand)] bg-white text-[var(--brand)]'
                          : 'border-[var(--border-strong)] bg-white text-[var(--muted-2)]'
                    }`}
                  >
                    {done ? <CheckMini /> : current ? <span className="size-2 rounded-full bg-[var(--brand)]" style={{ animation: 'ctl-pulse-dot 1.2s ease-in-out infinite' }} /> : i + 1}
                  </span>
                  <span className={`h-0.5 flex-1 rounded ${i === FLOW.length - 1 ? 'opacity-0' : done ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}`} />
                </div>
                <span className={`text-[11px] font-medium leading-tight ${done || current ? 'text-[var(--foreground)]' : 'text-[var(--muted-2)]'}`}>
                  {STEP_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {status === 'FAILED' && (
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(16,58,115,0.5)] transition hover:bg-[var(--brand-600)] active:scale-[0.99]"
        >
          Intentar de nuevo
        </a>
      )}

      {/* Trust reminder */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--muted-2)]">
        <span className="inline-flex items-center gap-1.5">
          <ShieldMini /> Pago seguro Wompi
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MailMini /> Entrega por correo y WhatsApp
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClockMini /> Validez 30 días
        </span>
      </div>
    </div>
  );
}

/* — Icons — */
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block size-6 rounded-full border-[3px] border-current/25 border-t-current ${className ?? ''}`}
      style={{ animation: 'ctl-spin 0.7s linear infinite' }}
    />
  );
}
function CheckBadge({ className }: { className?: string }) {
  return (
    <svg className={`size-6 ${className ?? ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={`size-6 ${className ?? ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
function CheckMini() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function ShieldMini() {
  return (
    <svg className="size-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function MailMini() {
  return (
    <svg className="size-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function ClockMini() {
  return (
    <svg className="size-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
