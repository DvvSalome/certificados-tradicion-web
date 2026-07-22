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
    desc: 'Revísalo en tu correo. Si no lo ves, mira la carpeta de Spam / No deseados y márcalo como “No es spam” — así te llega siempre a tu bandeja.',
    variant: 'success',
  },
  FAILED: {
    title: 'El pago no se completó',
    desc: 'No se realizó ningún cobro o fue rechazado. Puedes intentar de nuevo.',
    variant: 'error',
  },
  REFUND_PENDING: {
    title: 'Estamos devolviendo tu pago',
    desc: 'Esa matrícula no estaba disponible para generar, así que te devolvemos el pago. Puede tardar unos días en reflejarse según tu banco.',
    variant: 'wait',
  },
  REFUNDED: {
    title: 'Te devolvimos el pago',
    desc: 'Esa matrícula no estaba disponible, así que no te cobramos. El reembolso puede tardar unos días en reflejarse. Revisa la matrícula e inténtalo de nuevo.',
    variant: 'wait',
  },
};

const FINAL_NO_CERT = ['FAILED', 'REFUND_PENDING', 'REFUNDED'];

// Estados (post-pago) donde ofrecemos recibir el cert por WhatsApp. El número es público.
const SHOW_WA = ['PAID', 'GENERATING', 'DELIVERED'];
const WA_NUMBER = '573245092914';

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
  const dlToken = sp.get('t'); // token de descarga firmado (viene en la redirección tras el pago)
  const [status, setStatus] = useState<string | null>(null);
  const [info, setInfo] = useState<{ matricula?: string; oficina?: string; amountCop?: number }>({});

  useEffect(() => {
    if (!ref) return;
    let active = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/order/${ref}`);
        if (!r.ok || !active) return;
        const j = await r.json();
        setStatus(j.status);
        setInfo({ matricula: j.matricula, oficina: j.oficina, amountCop: j.amountCop });
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

  // Conversión: se reporta UNA sola vez por pedido cuando el pago queda confirmado.
  // GA4 y Google Ads la escuchan vía el evento `purchase` del dataLayer (GTM). Meta va
  // directo por fbq (el pixel se instala en layout.tsx, no en GTM).
  useEffect(() => {
    if (!ref || (status !== 'PAID' && status !== 'DELIVERED')) return;
    const key = `crt_conv_${ref}`;
    if (localStorage.getItem(key)) return; // ya reportada
    localStorage.setItem(key, '1');

    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'purchase',
      transaction_id: ref,
      value: info.amountCop || undefined,
      currency: 'COP',
    });

    // Meta: Purchase con eventID = referencia del pedido, para que la CAPI server-side
    // (cuando se encienda) deduplique contra este mismo evento del navegador.
    w.fbq?.('track', 'Purchase', { value: info.amountCop || 0, currency: 'COP' }, { eventID: ref });

    // Ruta directa por gtag (sin GTM). OJO: si además configuras la conversión dentro de GTM,
    // Google Ads la cuenta DOBLE. Usa una de las dos, no ambas.
    const gadsId = process.env.NEXT_PUBLIC_GADS_ID;
    const label = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;
    if (gadsId && label) {
      w.gtag?.('event', 'conversion', {
        send_to: `${gadsId}/${label}`,
        value: info.amountCop || undefined,
        currency: 'COP',
        transaction_id: ref,
      });
    }
  }, [status, ref, info.amountCop]);

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
  const showTimeline = !FINAL_NO_CERT.includes(status ?? '');

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

      {FINAL_NO_CERT.includes(status ?? '') && (
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(16,58,115,0.5)] transition hover:bg-[var(--brand-600)] active:scale-[0.99]"
        >
          {status === 'FAILED' ? 'Intentar de nuevo' : 'Intentar con otra matrícula'}
        </a>
      )}

      {status === 'DELIVERED' && (
        <a
          href={`/api/order/${ref}/download${dlToken ? `?t=${encodeURIComponent(dlToken)}` : ''}`}
          download
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-center shadow-sm transition hover:bg-[var(--brand-50)] active:scale-[0.99]"
        >
          <span className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(119,75,120,0.5)]">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Descargar Certificado PDF
          </span>
          <span className="text-xs text-[var(--muted)]">
            Descarga tu documento oficial al instante.
          </span>
        </a>
      )}

      {/* Recibir por WhatsApp (post-pago). Abre el chat con nuestro número; al escribir desde el número
          registrado, el bot responde el PDF (phone-auth). */}
      {SHOW_WA.includes(status ?? '') && (
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, quiero mi certificado ' + ref)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#bfe9cf] bg-[#f0fbf4] px-5 py-4 text-center shadow-sm transition hover:brightness-[0.99] active:scale-[0.99]"
        >
          <span className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(37,211,102,0.5)]">
            <WhatsappMini />
            {status === 'DELIVERED' ? 'Recíbelo también por WhatsApp' : 'Recíbelo por WhatsApp'}
          </span>
          <span className="text-xs text-[var(--muted)]">
            Escríbenos desde el mismo número que registraste y te lo enviamos al chat.
          </span>
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
function WhatsappMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}
