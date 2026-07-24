'use client';

import { useState } from 'react';
import OficinaSelect from '@/components/OficinaSelect';

type Estado = 'sin_verificar' | 'verificando' | 'ok' | 'no_existe' | 'no_concluyente';
type Row = {
  oficina: string; matricula: string; email: string; phone: string;
  plan: 'basico' | 'express' | 'avanzado';
  estado: Estado; direccion?: string | null; detalle?: string | null;
};
type Resultado = { matricula: string; email: string; plan: string; reference?: string; ok: boolean; error?: string };

const emptyRow = (base: Partial<Row> = {}): Row => ({
  oficina: base.oficina ?? 'BARRANQUILLA', matricula: '', email: '', phone: '',
  plan: base.plan ?? 'express', estado: 'sin_verificar',
});

export default function AdminGenerar() {
  const [defPlan, setDefPlan] = useState<Row['plan']>('express');
  const [defOficina] = useState('BARRANQUILLA');
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resultados, setResultados] = useState<Resultado[] | null>(null);

  const set = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, emptyRow({ oficina: rs[rs.length - 1]?.oficina ?? defOficina, plan: defPlan })]);
  const delRow = (i: number) => setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  const completas = rows.filter((r) => r.matricula.trim() && r.email.trim());
  const sinVerificar = completas.filter((r) => r.estado === 'sin_verificar' || r.estado === 'verificando');
  const inexistentes = completas.filter((r) => r.estado === 'no_existe');

  // Consulta el estado REAL de la matrícula en el SNR antes de gastar saldo. Es gratis
  // (consulta pública, sin login) y evita quemar $23.000 en una matrícula que no existe.
  async function verificar(i: number) {
    const r = rows[i];
    if (!r.matricula.trim()) return;
    set(i, { estado: 'verificando', detalle: null, direccion: null });
    try {
      const res = await fetch('/api/validar', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ oficina: r.oficina, matricula: r.matricula.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (j?.disponible === true) set(i, { estado: 'ok', direccion: j.direccion ?? null, detalle: j.estado ?? null });
      else if (j?.disponible === false && !j?.error) set(i, { estado: 'no_existe', detalle: 'El SNR no encontró esa matrícula en esa oficina' });
      else set(i, { estado: 'no_concluyente', detalle: j?.error || 'El portal del SNR no respondió' });
    } catch {
      set(i, { estado: 'no_concluyente', detalle: 'Error de red al consultar' });
    }
  }

  async function submit() {
    if (completas.length === 0) { setError('Agrega al menos una fila con matrícula y correo'); return; }
    if (inexistentes.length > 0) { setError(`${inexistentes.length} matrícula(s) no existen en el SNR. Quítalas o corrígelas antes de generar.`); return; }
    const aviso = sinVerificar.length > 0
      ? `\n\n⚠️ ${sinVerificar.length} matrícula(s) sin verificar: si no existen, el saldo se pierde igual.`
      : '';
    if (!confirm(`Vas a GENERAR ${completas.length} pedido(s) sin pago.\nGasta ~$${(completas.length * 23000).toLocaleString('es-CO')} del saldo SNR.${aviso}\n\n¿Continuar?`)) return;
    setError(''); setResultados(null); setSubmitting(true);
    try {
      const items = completas.map((r) => ({ matricula: r.matricula.trim(), oficina: r.oficina, email: r.email.trim(), phone: r.phone.trim() || undefined, plan: r.plan }));
      const res = await fetch('/api/admin/generar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error || 'Error al generar'); return; }
      setResultados(j.resultados || []);
    } catch { setError('Error de red'); } finally { setSubmitting(false); }
  }

  const inp = 'w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[var(--brand-ring)]';
  const lbl = 'mb-1 block text-[10.5px] font-bold uppercase tracking-wide text-[var(--muted-2)]';

  const SELLO: Record<Estado, { txt: string; cls: string } | null> = {
    sin_verificar: null,
    verificando: { txt: 'Consultando al SNR…', cls: 'bg-[var(--background)] text-[var(--muted)]' },
    ok: { txt: '✓ Existe en el SNR', cls: 'bg-[#e8f5ef] text-[#0f7a52]' },
    no_existe: { txt: '✕ No existe', cls: 'bg-[#fdecec] text-[#b42318]' },
    no_concluyente: { txt: '! No se pudo verificar', cls: 'bg-[#fdf6e8] text-[#b45309]' },
  };

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

      <div className="flex flex-col gap-4 p-5">
        {/* Una TARJETA por pedido (antes era una tabla con 6 columnas apretadas donde no se
            leía ni la oficina ni el correo). Aquí cada campo respira y funciona en móvil. */}
        {rows.map((r, i) => {
          const sello = SELLO[r.estado];
          return (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted-2)]">Pedido {i + 1}</span>
                {rows.length > 1 && (
                  <button onClick={() => delRow(i)} className="text-[11px] font-semibold text-[var(--muted-2)] hover:text-red-600">Quitar</button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={lbl}>Oficina de registro</label>
                  <OficinaSelect value={r.oficina} onChange={(v) => set(i, { oficina: v, estado: 'sin_verificar' })} />
                </div>
                <div>
                  <label className={lbl}>Matrícula</label>
                  <div className="flex gap-2">
                    <input
                      className={inp} inputMode="numeric" placeholder="95200" value={r.matricula}
                      onChange={(e) => set(i, { matricula: e.target.value.replace(/\D/g, ''), estado: 'sin_verificar', detalle: null, direccion: null })}
                      onBlur={() => r.matricula.trim() && r.estado === 'sin_verificar' && verificar(i)}
                    />
                    <button
                      type="button" onClick={() => verificar(i)} disabled={!r.matricula.trim() || r.estado === 'verificando'}
                      className="shrink-0 rounded-lg border border-[var(--border)] bg-white px-3 text-[11.5px] font-semibold text-[var(--muted)] transition hover:border-[var(--brand-ring)] hover:text-[var(--brand)] disabled:opacity-50"
                      title="Consulta gratis si la matrícula existe en el SNR"
                    >
                      Verificar
                    </button>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Correo del cliente</label>
                  <input className={inp} type="email" placeholder="cliente@correo.com" value={r.email} onChange={(e) => set(i, { email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>WhatsApp (opc.)</label>
                    <input className={inp} placeholder="+57 300…" value={r.phone} onChange={(e) => set(i, { phone: e.target.value })} />
                  </div>
                  <div>
                    <label className={lbl}>Plan</label>
                    <select value={r.plan} onChange={(e) => set(i, { plan: e.target.value as Row['plan'] })} className={inp}>
                      <option value="basico">Básico</option><option value="express">Express</option><option value="avanzado">Avanzado</option>
                    </select>
                  </div>
                </div>
              </div>

              {sello && (
                <div className={`mt-3 rounded-lg px-3 py-2 text-[12px] font-semibold ${sello.cls}`}>
                  {sello.txt}
                  {r.direccion && <span className="ml-1 font-normal">· {r.direccion}</span>}
                  {r.detalle && r.estado !== 'ok' && <span className="ml-1 font-normal">· {r.detalle}</span>}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={addRow} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand-50)]">+ Agregar pedido</button>
          <button onClick={submit} disabled={submitting || completas.length === 0}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-600)] disabled:opacity-50">
            {submitting ? 'Generando…' : `Generar ${completas.length || ''} pedido(s)`}
          </button>
          {completas.length > 0 && (
            <span className="text-[11.5px] text-[var(--muted-2)]">
              Costo estimado: ${(completas.length * 23000).toLocaleString('es-CO')} del saldo SNR
            </span>
          )}
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
        </div>

        {resultados && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
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
