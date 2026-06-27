'use client';

import { useState, useEffect } from 'react';

// Efecto "máquina de escribir": escribe una frase, la mantiene, la borra y pasa a la siguiente (cíclico).
// Se PAUSA cuando hay un modal abierto (escucha el evento 'cz-modal') para no distraer al llenar datos.
export function RotatingTail({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0); // índice de la frase actual
  const [sub, setSub] = useState(''); // subcadena tipeada
  const [del, setDel] = useState(false); // ¿borrando?
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onModal = (e: Event) => setPaused(!!(e as CustomEvent).detail);
    window.addEventListener('cz-modal', onModal as EventListener);
    return () => window.removeEventListener('cz-modal', onModal as EventListener);
  }, []);

  useEffect(() => {
    if (paused) return; // modal abierto → no animar
    const full = phrases[i % phrases.length];
    if (!del && sub === full) {
      const t = setTimeout(() => setDel(true), 1900); // mantener la frase completa
      return () => clearTimeout(t);
    }
    if (del && sub === '') {
      setDel(false);
      setI((p) => (p + 1) % phrases.length); // siguiente frase
      return;
    }
    const t = setTimeout(
      () => setSub(del ? full.slice(0, sub.length - 1) : full.slice(0, sub.length + 1)),
      del ? 34 : 62,
    );
    return () => clearTimeout(t);
  }, [sub, del, i, phrases, paused]);

  return (
    <span>
      {sub}
      <span className="cz-cursor" aria-hidden="true">|</span>
    </span>
  );
}
