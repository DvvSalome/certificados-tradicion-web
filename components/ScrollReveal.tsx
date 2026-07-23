'use client';

import { useEffect } from 'react';

// Entrada al hacer scroll de todo lo que tenga .cz-reveal (tarjetas, pasos, planes…).
// Clave: solo oculta lo que YA está fuera de pantalla. Lo visible al cargar no se toca,
// así no hay parpadeo, y si el JS muriera después nada queda invisible (ocultar y
// observar pasan en el mismo tick). Sin librerías.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('cz-in');
          io.unobserve(e.target); // una sola vez: al volver a subir no se re-oculta
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );

    for (const el of document.querySelectorAll<HTMLElement>('.cz-reveal')) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue; // ya se ve: déjalo quieto
      el.classList.add('cz-hidden');
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return null;
}
