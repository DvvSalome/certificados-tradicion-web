'use client';

import { useState, useEffect } from 'react';

// Efecto "máquina de escribir": escribe una frase, la mantiene, la borra y pasa a la siguiente (cíclico).
// Se usa para la cola variable del titular del hero (la parte fija va antes en el <h1>).
export function RotatingTail({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0); // índice de la frase actual
  const [sub, setSub] = useState(''); // subcadena tipeada
  const [del, setDel] = useState(false); // ¿borrando?

  useEffect(() => {
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
  }, [sub, del, i, phrases]);

  return (
    <span>
      {sub}
      <span className="cz-cursor" aria-hidden="true">|</span>
    </span>
  );
}
