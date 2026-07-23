'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Botón "Actualizar" del saldo prepago: le pide al robot que ENTRE al portal del SNR y
// lea el saldo real ahora mismo. Antes el número solo se refrescaba después de una venta,
// así que sin ventas el panel mostraba un saldo de semanas atrás.
export default function SaldoRefresh() {
  const router = useRouter();
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'error'>('idle');
  const [msg, setMsg] = useState<string | null>(null);

  const actualizar = async () => {
    setEstado('cargando');
    setMsg(null);
    try {
      const r = await fetch('/api/admin/saldo/refresh', { method: 'POST' });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || !d.ok) throw new Error(d.error || 'No se pudo leer el saldo');
      setEstado('idle');
      router.refresh(); // el KPI se repinta con el saldo recién guardado
    } catch (e) {
      setEstado('error');
      setMsg(e instanceof Error ? e.message : 'Error');
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={actualizar}
        disabled={estado === 'cargando'}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--brand-ring)] hover:text-[var(--brand)] disabled:opacity-60"
        title="Consulta el saldo real en el portal del SNR"
      >
        <svg
          className={`size-3 ${estado === 'cargando' ? 'animate-spin' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" />
        </svg>
        {estado === 'cargando' ? 'Consultando al SNR…' : 'Actualizar'}
      </button>
      {msg && <span className="text-[10.5px] font-medium text-[#b42318]">{msg}</span>}
    </span>
  );
}
