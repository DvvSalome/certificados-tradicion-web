'use client';

import { useEffect, useRef, useState } from 'react';

// Contador "vivo" de prueba social: crece con el tiempo y sube un poco en CADA visita
// del navegador (persistido en localStorage). Es un MOCK de marketing — NO son datos
// reales del backend. ponytail: si algún día queremos cifras reales, esto se reemplaza
// por un fetch a un endpoint; la UI (count-up) no cambia.

const STORE_KEY = 'crt_stats_v2'; // v2: re-siembra (v1 quedó inflado por recargas de prueba)
const EPOCH = Date.UTC(2026, 5, 1); // ancla temporal: 1 jun 2026 (mes 5 = junio)

type Stats = { reportes: number; alertas: number; visits: number };

// Semilla por tiempo: un visitante nuevo no ve siempre el mismo número; crece ~0.8/hora.
function seed(): Stats {
  const hours = Math.max(0, (Date.now() - EPOCH) / 3.6e6);
  const reportes = 1800 + Math.floor(hours * 0.35);
  return { reportes, alertas: Math.floor(reportes * 1.8), visits: 0 };
}

// Siguiente estado: parte de lo guardado (o semilla) y suma un bump por visita.
function nextStats(): Stats {
  let s: Stats;
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    s = raw && typeof raw.reportes === 'number' ? raw : seed();
  } catch {
    s = seed();
  }
  const bumpR = 1 + Math.floor(Math.random() * 3); // +1..3 reportes por visita (suave)
  s = {
    reportes: s.reportes + bumpR,
    alertas: s.alertas + 1 + Math.floor(Math.random() * 3), // +1..3 alertas (ya no "un montón")
    visits: s.visits + 1,
  };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
  return s;
}

// Cuenta ascendente (easeOutCubic) hasta `target` cuando `run` es true.
function useCountUp(target: number, run: boolean, ms = 1500): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run || !target) return;
    const from = Math.max(0, target - Math.min(target, 400)); // arranca cerca del final
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return val;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setStats(nextStats()); }, []);

  // Dispara el conteo cuando la barra entra en vista.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    // Salvavidas: si el observer no dispara (jank, casos raros), mostrar igual a los 3.5s
    // para que los números nunca queden atascados en 0.
    const fallback = setTimeout(() => setSeen(true), 3500);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  const reportes = useCountUp(stats?.reportes ?? 0, seen && !!stats);
  const alertas = useCountUp(stats?.alertas ?? 0, seen && !!stats);
  const fmt = (n: number) => n.toLocaleString('es-CO');

  return (
    <section ref={ref} className="bg-[var(--background)] px-4 py-8 sm:py-10" aria-label="Reportes analizados y alertas encontradas">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-white px-6 py-8 shadow-sm sm:py-10">
        <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span className="text-4xl font-extrabold tracking-tight tabular-nums text-[var(--foreground)] sm:text-6xl">{fmt(reportes)}</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-2)] sm:text-xs">Reportes analizados</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span className="text-4xl font-extrabold tracking-tight tabular-nums text-[var(--foreground)] sm:text-6xl">{fmt(alertas)}</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-2)] sm:text-xs">Alertas encontradas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
