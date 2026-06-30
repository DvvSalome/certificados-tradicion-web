'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [role, setRole] = useState<'cliente' | 'superadmin'>('cliente');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ role, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || 'No se pudo iniciar sesión');
        setLoading(false);
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Error de red');
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2.5 text-center">
          <span aria-hidden className="grid size-11 place-items-center rounded-2xl bg-[var(--brand)] text-white shadow-sm">
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)]">Panel de control</h1>
            <p className="text-[13px] text-[var(--muted)]">Certificado de Tradición · acceso restringido</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_40px_-12px_rgba(13,27,42,0.18)]">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--background)] p-1">
            {(['cliente', 'superadmin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  role === r ? 'bg-white text-[var(--brand)] shadow-sm' : 'text-[var(--muted)]'
                }`}
              >
                {r === 'cliente' ? 'Cliente' : 'Superadmin'}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[var(--muted)]">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="rounded-xl border border-[var(--border-strong)] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-[var(--brand-ring)]"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-[13px] font-medium text-[#b42318]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-600)] disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--muted-2)]">Panel de administración interno</p>
      </div>
    </div>
  );
}
