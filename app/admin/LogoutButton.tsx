'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-lg border border-[var(--border-strong)] bg-white px-3 py-1.5 text-[13px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
    >
      Salir
    </button>
  );
}
