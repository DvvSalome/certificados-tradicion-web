'use client';

import { useState } from 'react';
import OficinaSelect from '@/components/OficinaSelect';

type Row = { oficina: string; matricula: string; email: string; phone: string; plan: 'basico' | 'express' | 'avanzado' };
type Resultado = { matricula: string; email: string; plan: string; reference?: string; ok: boolean; error?: string };

const emptyRow = (base: Partial<Row> = {}): Row => ({ oficina: base.oficina ?? 'BARRANQUILLA', matricula: '', email: '', phone: '', plan: base.plan ?? 'express' });

export default function AdminGenerar() {
  const [defOficina, setDefOficina] = useState('BARRANQUILLA');
  const [defPlan, setDefPlan] = useState<Row['plan']>('express');
  const [rows, setRows] = useState<Row[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resultados, setResultados] = useState<Resultado[] | null>(null);

  const set = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, emptyRow({ oficina: defOficina, plan: defPlan })]);
  const delRow = (i: number) => setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  const validas = rows.filter((r) => r.matricula.trim() && r.email.trim());

  async function submit() {
    if (validas.length === 0) { setError('Agrega al menos una fila con matrícula y correo'); return; }
    if (!confirm(`Vas a GENERAR ${validas.length} pedido(s) sin pago (gasta saldo del SNR). ¿Continuar?`)) return;
    setError(''); setResultados(null); setSubmitting(true);
    try {
      const items = validas.map((r) => ({ matricula: r.matricula.trim(), oficina: r.oficina, email: r.email.trim(), phone: r.phone.trim() || undefined, plan: r.plan }));
      const res = await fetch('/api/admin/generar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error || 'Error al generar'); return; }
      setResultados(j.resultados || []);
    } catch { setError('Error de red'); } finally { setSubmitting(false); }
  }

  const inp = 'w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[var(--brand-ring)]';

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-5 py-3.5">
        <div>
          <h2 className="text-sm font-bold text-[var(--foreground)]">Generar para clientes · sin pago</h2>
          <p className="text-xs text-[var(--muted)]">Despacho manual (superadmin). Genera CTL + estudio/antecedentes y lo entrega por correo. Gasta saldo del SNR.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--muted-2)]">Plan por defecto</span>
          <select value={defPlan} onChange={(e) => setDefPlan(e.target.value as Row['plan'])} className="rounded-lg border border-[var(--border)] bg-white px-2 py-1">
            <option value="basico">Básico</option><option value="express">Express</option><option value="avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-wide text-[var(--muted-2)]">
                <th className="pb-2 pr-2" style={{ minWidth: 150 }}>Oficina</th>
                <th className="pb-2 pr-2">Matrícula</th>
                <th className="pb-2 pr-2">Correo</th>
                <th className="pb-2 pr-2">WhatsApp (opc.)</th>
                <th className="pb-2 pr-2">Plan</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="py-1 pr-2"><OficinaSelect value={r.oficina} onChange={(v) => set(i, { oficina: v })} /></td>
                  <td className="py-1 pr-2"><input className={inp} inputMode="numeric" placeholder="12345" value={r.matricula} onChange={(e) => set(i, { matricula: e.target.value })} /></td>
                  <td className="py-1 pr-2"><input className={inp} type="email" placeholder="cliente@correo.com" value={r.email} onChange={(e) => set(i, { email: e.target.value })} /></td>
                  <td className="py-1 pr-2"><input className={inp} placeholder="+57 300…" value={r.phone} onChange={(e) => set(i, { phone: e.target.value })} /></td>
                  <td className="py-1 pr-2">
                    <select value={r.plan} onChange={(e) => set(i, { plan: e.target.value as Row['plan'] })} className={inp}>
                      <option value="basico">Básico</option><option value="express">Express</option><option value="avanzado">Avanzado</option>
                    </select>
                  </td>
                  <td className="py-1 text-right"><button onClick={() => delRow(i)} className="px-2 text-[var(--muted-2)] hover:text-red-600" title="Quitar fila">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={addRow} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand-50)]">+ Agregar fila</button>
          <button onClick={submit} disabled={submitting || validas.length === 0}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-600)] disabled:opacity-50">
            {submitting ? 'Generando…' : `Generar ${validas.length || ''} pedido(s)`}
          </button>
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
        </div>

        {resultados && (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-2)]">Resultado ({resultados.filter((r) => r.ok).length}/{resultados.length} disparados)</p>
            <ul className="flex flex-col gap-1.5 text-sm">
              {resultados.map((r, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <span className={r.ok ? 'text-[var(--accent)]' : 'text-red-600'}>{r.ok ? '✓' : '✕'}</span>
                  <span className="font-mono text-xs">{r.matricula}</span>
                  <span className="text-[var(--muted-2)]">·</span>
                  <span className="text-xs text-[var(--muted)]">{r.email}</span>
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand)]">{r.plan}</span>
                  {r.ok ? <span className="font-mono text-[11px] text-[var(--muted-2)]">{r.reference}</span> : <span className="text-xs text-red-600">{r.error}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-[var(--muted-2)]">Los pedidos quedan en generación; se entregan por correo (y WhatsApp si diste número) en minutos. Míralos en la lista de pedidos abajo.</p>
          </div>
        )}
      </div>
    </section>
  );
}
