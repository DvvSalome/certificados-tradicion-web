'use client';

import { useEffect, useRef, useState } from 'react';
import { OFICINAS, oficinaCode } from '@/lib/oficinas';

// Selector de oficina BUSCABLE: escribe ciudad o código para filtrar; muestra el código (ej. 040 — BARRANQUILLA).
export default function OficinaSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (oficina: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = OFICINAS.filter(
    (o) => !q || o.toLowerCase().includes(q) || oficinaCode(o).toLowerCase().includes(q),
  ).slice(0, 80);

  const label = value ? `${oficinaCode(value)} — ${value}` : '';

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          type="text"
          value={open ? query : label}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => { setOpen(true); setQuery(''); }}
          disabled={disabled}
          placeholder="Escribe la ciudad o el código (ej. Barranquilla o 040)"
          autoComplete="off"
          className="w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 pr-10 text-[15px] text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--brand-ring)] focus:ring-4 focus:ring-[var(--brand-50)] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <svg className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-[var(--muted-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <ul className="ctl-fade-up absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-[var(--border)] bg-white py-1 shadow-[0_12px_40px_-12px_rgba(13,27,42,0.25)]">
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--muted-2)]">Sin resultados para “{query}”.</li>
          ) : (
            filtered.map((o) => {
              const selected = o === value;
              return (
                <li key={o}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); onChange(o); setOpen(false); setQuery(''); }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-[14px] transition-colors hover:bg-[var(--brand-50)] ${selected ? 'bg-[var(--brand-50)]' : ''}`}
                  >
                    <span className="grid min-w-[2.6rem] place-items-center rounded-md bg-[var(--background)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[var(--brand)]">
                      {oficinaCode(o)}
                    </span>
                    <span className="text-[var(--foreground)]">{o}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
