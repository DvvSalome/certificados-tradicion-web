'use client';

import type { CSSProperties, ReactNode } from 'react';

// Envoltorio clickeable: avisa al CheckoutForm que abra el modal (evento 'cz-open-checkout').
// Se usa sobre el certificado animado del hero — mucha gente ya hace clic ahí, así que ahora vende.
export function ClickToCheckout({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const open = () => window.dispatchEvent(new CustomEvent('cz-open-checkout'));
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Solicitar mi certificado"
      title="Solicitar mi certificado"
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
      style={style}
    >
      {children}
    </div>
  );
}
