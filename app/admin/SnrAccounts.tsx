'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Cuenta = { user: string; disponible: boolean; saldoCents: number | null; reason: string | null };

const fmt = (c: number) =>
  '$ ' + Math.round(c / 100).toLocaleString('es-CO');

// Gestión del pool de cuentas SNR desde el panel: agregar (sin redeploy), quitar, y consultar
// el saldo de una cuenta concreta. El robot recoge los cambios de la tabla cada 3 min.
export default function SnrAccounts({
  cuentas,
  activa,
  costCents,
}: {
  cuentas: Cuenta[];
  activa: string | null;
  costCents: number;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [msg, setMsg] = useState<{ txt: string; ok: boolean } | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null); // usuario cuyo saldo se está leyendo

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setOcupado('__add');
    try {
      const r = await fetch('/api/admin/snr-accounts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ usuario, clave }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'No se pudo guardar');
      setMsg({ txt: `Cuenta ${d.usuario} guardada. El robot la toma en menos de 3 minutos.`, ok: true });
      setUsuario('');
      setClave('');
      router.refresh();
    } catch (err) {
      setMsg({ txt: err instanceof Error ? err.message : 'Error', ok: false });
    } finally {
      setOcupado(null);
    }
  };

  const quitar = async (u: string) => {
    setMsg(null);
    setOcupado(u);
    try {
      const r = await fetch('/api/admin/snr-accounts', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ usuario: u }),
      });
      if (!r.ok) throw new Error('No se pudo quitar');
      setMsg({ txt: `${u} quitada del pool.`, ok: true });
      router.refresh();
    } catch (err) {
      setMsg({ txt: err instanceof Error ? err.message : 'Error', ok: false });
    } finally {
      setOcupado(null);
    }
  };

  const consultarSaldo = async (u: string) => {
    setMsg(null);
    setOcupado(u);
    try {
      const r = await fetch('/api/admin/saldo/refresh', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cuenta: u }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'No se pudo leer');
      setMsg({ txt: `${u}: ${fmt(d.saldoCents)}`, ok: true });
      router.refresh();
    } catch (err) {
      setMsg({ txt: err instanceof Error ? err.message : 'Error', ok: false });
    } finally {
      setOcupado(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {cuentas.map((c) => {
          const esActiva = c.user === activa;
          const trabajando = ocupado === c.user;
          return (
            <div key={c.user} className="rounded-xl border border-[var(--border)] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[13.5px] font-bold text-[var(--foreground)]">{c.user}</span>
                <span className="flex items-center gap-1.5">
                  {esActiva && (
                    <span className="rounded-full bg-[var(--brand-50)] px-2 py-0.5 text-[10px] font-bold text-[var(--brand)]">EN USO</span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.disponible ? 'bg-[#e8f5ef] text-[#0f7a52]' : 'bg-[#fdecec] text-[#b42318]'}`}>
                    {c.disponible ? 'disponible' : c.reason || 'no disponible'}
                  </span>
                </span>
              </div>

              <p className="mt-2 text-[13px] text-[var(--foreground)]">
                Saldo:{' '}
                {c.saldoCents == null ? (
                  <span className="text-[var(--muted-2)]">sin consultar</span>
                ) : (
                  <>
                    <span className="font-semibold">{fmt(c.saldoCents)}</span>
                    <span className="text-[var(--muted-2)]"> · ~{Math.floor(c.saldoCents / costCents)} certificados</span>
                  </>
                )}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => consultarSaldo(c.user)}
                  disabled={!!ocupado}
                  className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--brand-ring)] hover:text-[var(--brand)] disabled:opacity-60"
                  title="Entra al portal con esta cuenta y lee su saldo (gasta 1 login si no es la que está en uso)"
                >
                  {trabajando ? 'Consultando…' : 'Consultar saldo'}
                </button>
                <button
                  type="button"
                  onClick={() => quitar(c.user)}
                  disabled={!!ocupado}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[var(--muted-2)] transition hover:text-[#b42318] disabled:opacity-60"
                  title="Quitar del pool (solo aplica a cuentas agregadas desde el panel)"
                >
                  Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {msg && (
        <p className={`text-[12px] font-semibold ${msg.ok ? 'text-[#0f7a52]' : 'text-[#b42318]'}`}>{msg.txt}</p>
      )}

      {!abierto ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="self-start rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          + Agregar cuenta SNR
        </button>
      ) : (
        <form onSubmit={agregar} className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-[12px] font-semibold text-[var(--foreground)]">Nueva cuenta del portal SNR</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario (ej. CC22521092)"
              className="flex-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--brand-ring)]"
            />
            <input
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              type="password"
              placeholder="Clave"
              className="flex-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--brand-ring)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={ocupado === '__add' || !usuario || !clave}
              className="rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-[12px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {ocupado === '__add' ? 'Guardando…' : 'Guardar cuenta'}
            </button>
            <button type="button" onClick={() => { setAbierto(false); setMsg(null); }} className="text-[12px] font-semibold text-[var(--muted-2)] hover:text-[var(--muted)]">
              Cancelar
            </button>
          </div>
          <p className="text-[11px] leading-snug text-[var(--muted-2)]">
            El robot usa la primera cuenta con saldo; si el SNR la bloquea por exceso de ingresos del día, salta sola a la siguiente. La clave se guarda para que el robot entre y nunca se vuelve a mostrar.
          </p>
        </form>
      )}
    </div>
  );
}
