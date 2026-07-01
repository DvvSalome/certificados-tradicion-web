'use client';

import { useEffect, useState } from 'react';
import { Seal } from './Brand';

// Widget flotante de WhatsApp (estilo "Adiós Vellos"): botón redondo abajo-derecha con nuestra
// marca + globo de mensaje; enlaza a wa.me con un texto predeterminado. El globo se puede cerrar
// y recuerda la preferencia (localStorage).
//
// En móvil se sube (bottom-40) para no tapar la barra de compra FIJA de abajo.
// Mensaje predeterminado SIN emoji (evita el "�" que salía en WhatsApp) y orientado a servicios.
const WA_URL = `https://wa.me/573212258245?text=${encodeURIComponent(
  'Hola, quiero conocer más sobre sus servicios.',
)}`;

export default function WhatsAppWidget() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    let closed = false;
    try { closed = localStorage.getItem('crt_wa_closed') === '1'; } catch {}
    if (closed) return;
    const t = setTimeout(() => setShowBubble(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShowBubble(false);
    try { localStorage.setItem('crt_wa_closed', '1'); } catch {}
  };

  return (
    <div className="fixed bottom-44 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-5 print:hidden">
      {showBubble && (
        <div className="ctl-fade-up relative w-[250px] rounded-2xl border border-black/5 bg-white px-4 py-3.5 shadow-[0_16px_44px_-10px_rgba(13,27,42,0.4)]">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="absolute -right-2.5 -top-2.5 grid size-6 place-items-center rounded-full bg-white text-[var(--muted-2)] shadow-md ring-1 ring-black/5 transition hover:text-[var(--foreground)]"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => setShowBubble(false)} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0"><Seal size={22} tone="onLight" /></span>
            <p className="text-[13.5px] leading-snug text-[var(--foreground)]">
              ¡Hola! <span aria-hidden="true">💜</span> ¿Quieres conocer todos nuestros servicios? Escríbenos por WhatsApp y te asesoramos.
            </p>
          </a>
          {/* Colita del globo apuntando al botón (speech-bubble tail) */}
          <span className="absolute -bottom-1.5 right-7 size-3 rotate-45 border-b border-r border-black/5 bg-white" />
        </div>
      )}

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowBubble(false)}
        aria-label="Escríbenos por WhatsApp"
        className="group relative grid size-14 place-items-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_30px_-6px_rgba(119,75,120,0.75)] transition hover:scale-105 hover:bg-[var(--brand-600)]"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--brand)] opacity-50 animate-ping" style={{ animationDuration: '2.6s' }} />
        <svg viewBox="0 0 24 24" className="relative size-7" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.72 14.03c-.24.68-1.42 1.31-1.95 1.34-.5.03-1.13.24-3.65-.77-3.09-1.24-5.05-4.39-5.2-4.6-.15-.2-1.23-1.64-1.23-3.12 0-1.49.78-2.22 1.06-2.53.28-.31.6-.38.8-.38l.58.01c.19.01.44-.07.68.52.24.6.82 2.06.89 2.21.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.15.26.1 1.67.79 1.96.93.29.15.48.22.55.34.07.13.07.71-.17 1.39z" />
        </svg>
      </a>
    </div>
  );
}
