'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCOP } from '@/lib/config';
import OficinaSelect from '@/components/OficinaSelect';

interface BatchItem { matricula: string; oficina: string; status: string; costCents: number | null; error: string | null }
interface Batch {
  id: number; status: string; total: number; createdBy: string; createdAt: string;
  counts: { pending: number; running: number; ok: number; failed: number };
  items: BatchItem[];
}

const ST: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'En cola', cls: 'bg-[var(--background)] text-[var(--muted)]' },
  RUNNING: { label: 'Generando', cls: 'bg-[var(--brand-50)] text-[var(--brand)]' },
  OK: { label: 'OK', cls: 'bg-[var(--accent-50)] text-[var(--accent)]' },
  FAILED: { label: 'Falló', cls: 'bg-[#fdecec] text-[#b42318]' },
};

export default function BatchPanel() {
  const [oficina, setOficina] = useState('BARRANQUILLA');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState<Batch | null>(null);
  const [recent, setRecent] = useState<Batch[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matriculas = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const loadRecent = useCallback(async () => {
    const r = await fetch('/api/admin/batch').catch(() => null);
    if (r?.ok) setRecent((await r.json()).batches ?? []);
  }, []);

  useEffect(() => { loadRecent(); }, [loadRecent]);

  // Polling del lote activo hasta que termine.
  const poll = useCallback(async (id: number) => {
    const r = await fetch(`/api/admin/batch/${id}`).catch(() => null);
    if (r?.ok) {
      const b: Batch = await r.json();
      setActive(b);
      if (b.status !== 'DONE') timer.current = setTimeout(() => poll(id), 3000);
      else loadRecent();
    }
  }, [loadRecent]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function submit() {
    setError('');
    if (matriculas.length === 0) { setError('Pega al menos una matrícula'); return; }
    setSubmitting(true);
    try {
      const items = matriculas.map((m) => ({ matricula: m, oficina }));
      const r = await fetch('/api/admin/batch', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items }),
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error || 'No se pudo crear el lote'); setSubmitting(false); return; }
      setText('');
      if (!j.triggered) setError('Lote creado, pero el procesador (N8N_BATCH_URL) no está configurado: no se procesará aún.');
      poll(j.batchId);
    } catch {
      setError('Error de red');
    } finally {
      setSubmitting(false);
    }
  }

  const processed = active ? active.counts.ok + active.counts.failed : 0;
  const pct = active && active.total ? Math.round((processed / active.total) * 100) : 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Generación en lote</h2>
          <p className="text-[12px] text-[var(--muted-2)]">Se procesan de a una con pausa, para no bloquear la cuenta del SNR.</p>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        {/* Formulario */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[var(--muted)]">Oficina de registro</span>
            <OficinaSelect value={oficina} onChange={setOficina} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[var(--muted)]">Matrículas <span className="text-[var(--muted-2)]">(una por línea)</span></span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder={'95200\n168410\n50C-123456'}
              className="resize-y rounded-xl border border-[var(--border-strong)] bg-white px-3.5 py-2.5 font-mono text-[13px] outline-none focus:border-[var(--brand-ring)]"
            />
          </label>
          {error && <p className="rounded-lg bg-[#fdf6e8] px-3 py-2 text-[12px] font-medium text-[#8a6d3b]">{error}</p>}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[var(--muted-2)]">{matriculas.length} matrícula(s)</span>
            <button
              onClick={submit}
              disabled={submitting || matriculas.length === 0}
              className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)] disabled:opacity-50"
            >
              {submitting ? 'Lanzando…' : `Generar lote (${matriculas.length})`}
            </button>
          </div>
        </div>

        {/* Progreso en vivo */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          {!active ? (
            <div className="grid h-full place-items-center py-8 text-center text-[13px] text-[var(--muted-2)]">
              {recent.length > 0 ? (
                <button onClick={() => poll(recent[0].id)} className="text-[var(--brand)] underline">
                  Ver último lote (#{recent[0].id} · {recent[0].counts.ok}/{recent[0].total})
                </button>
              ) : 'El progreso del lote aparecerá aquí.'}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[var(--foreground)]">Lote #{active.id}</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active.status === 'DONE' ? 'bg-[var(--accent-50)] text-[var(--accent)]' : 'bg-[var(--brand-50)] text-[var(--brand)]'}`}>
                  {active.status === 'DONE' ? 'Terminado' : 'Procesando…'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                <div className="h-full rounded-full bg-[var(--brand)] transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-3 text-[12px] text-[var(--muted)]">
                <span className="text-[var(--accent)]">✓ {active.counts.ok}</span>
                <span className="text-[#b42318]">✕ {active.counts.failed}</span>
                <span>⟳ {active.counts.running}</span>
                <span>· {active.counts.pending} en cola</span>
                <span className="ml-auto font-semibold text-[var(--foreground)]">{processed}/{active.total}</span>
              </div>
              <ul className="max-h-44 divide-y divide-[var(--border)] overflow-y-auto rounded-lg border border-[var(--border)] bg-white">
                {active.items.map((it, i) => {
                  const s = ST[it.status] ?? ST.PENDING;
                  return (
                    <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-[12px]">
                      <span className="font-mono text-[var(--foreground)]">{it.matricula}</span>
                      <span className="flex items-center gap-2">
                        {it.costCents != null && <span className="text-[var(--muted-2)]">{formatCOP(it.costCents / 100)}</span>}
                        <span className={`rounded-full px-2 py-0.5 font-semibold ${s.cls}`}>{s.label}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
