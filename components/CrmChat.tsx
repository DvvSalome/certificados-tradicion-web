'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Chat del CRM de FourG (sustituye al botón directo de wa.me): mismo botón flotante
// abajo-derecha, pero abre el webchat con bot IA conectado al inbox del CRM. Cada
// conversación cae como lead en crm.fourgsolutions.com; el CTA de WhatsApp sigue
// existiendo, ahora DENTRO del chat (configurado en el widget del CRM).
//
// En móvil el botón se sube (bottom-44) para no tapar la barra de compra fija, y el
// panel abre a pantalla casi completa; en escritorio es el panel clásico 380x600.
const CHAT_URL = 'https://crm.fourgsolutions.com/chat/wc_certitradicion_main';

export default function CrmChat() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false); // el iframe se monta al primer clic y no se desmonta (conserva la conversación)
  const [showBubble, setShowBubble] = useState(false);
  const [src, setSrc] = useState(CHAT_URL);
  const pathname = usePathname();

  // El gate de dominio del widget valida la URL del sitio padre; se le pasan URL,
  // referrer y UTMs igual que el snippet oficial del CRM (atribución del lead).
  useEffect(() => {
    const utm: Record<string, string> = {};
    try {
      const p = new URLSearchParams(window.location.search);
      for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
        const v = p.get(k);
        if (v) utm[k] = v;
      }
    } catch {}
    const qs =
      `u=${encodeURIComponent(window.location.href.slice(0, 512))}` +
      `&ref=${encodeURIComponent(document.referrer.slice(0, 512))}` +
      `&utm=${encodeURIComponent(JSON.stringify(utm))}`;
    setSrc(`${CHAT_URL}?${qs}`);
    const t = setTimeout(() => setShowBubble(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // El panel interno no lleva el chat (es para visitantes, no para el operador).
  if (pathname?.startsWith('/admin')) return null;

  const toggle = () => {
    setOpen((o) => !o);
    setLoaded(true);
    setShowBubble(false);
  };

  return (
    <>
      {loaded && (
        <iframe
          src={src}
          title="Chat Certitradición"
          allow="microphone" // sin esto el navegador bloquea el micrófono dentro del iframe (nota de voz del chat)
          className={`fixed z-[59] rounded-2xl border-none bg-white shadow-[0_16px_60px_-12px_rgba(13,27,42,0.55)] transition-opacity print:hidden ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          } left-2 top-14 h-[calc(100dvh-64px)] w-[calc(100vw-16px)] sm:left-auto sm:top-auto sm:right-5 sm:bottom-24 sm:h-[min(600px,calc(100vh-120px))] sm:w-[380px]`}
        />
      )}

      <div
        className={`fixed z-[60] flex flex-col items-end gap-3 print:hidden ${
          open ? 'top-16 right-4 sm:top-auto sm:bottom-6 sm:right-5' : 'bottom-44 right-4 sm:bottom-6 sm:right-5'
        }`}
      >
        {showBubble && !open && (
          <div className="ctl-fade-up relative w-[250px] rounded-2xl border border-black/5 bg-white px-4 py-3.5 shadow-[0_16px_44px_-10px_rgba(13,27,42,0.4)]">
            <button
              type="button"
              onClick={() => setShowBubble(false)}
              aria-label="Cerrar"
              className="absolute -right-2.5 -top-2.5 grid size-6 place-items-center rounded-full bg-white text-[var(--muted-2)] shadow-md ring-1 ring-black/5 transition hover:text-[var(--foreground)]"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <button type="button" onClick={toggle} className="block text-left">
              <p className="text-[13.5px] leading-snug text-[var(--foreground)]">
                ¿Dudas con tu certificado? Te ayudamos en minutos.
              </p>
            </button>
            <span className="absolute -bottom-1.5 right-7 size-3 rotate-45 border-b border-r border-black/5 bg-white" />
          </div>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={open ? 'Cerrar el chat' : 'Abrir el chat'}
          className={`group relative grid place-items-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_30px_-6px_rgba(119,75,120,0.75)] transition hover:scale-105 hover:bg-[var(--brand-600)] ${
            open ? 'size-10 sm:size-14' : 'size-14'
          }`}
        >
          {!open && <span className="absolute inset-0 rounded-full bg-[var(--brand)] opacity-50 animate-ping" style={{ animationDuration: '2.6s' }} />}
          {open ? (
            <svg viewBox="0 0 24 24" className="relative size-5 sm:size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="relative size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01M12 10h.01M16 10h.01" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
