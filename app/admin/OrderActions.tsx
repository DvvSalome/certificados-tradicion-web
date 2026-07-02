'use client';

import { useState } from 'react';

type Props = { reference: string; status: string; hasPdf: boolean; isSuperadmin: boolean };

export default function OrderActions({ reference, status, hasPdf, isSuperadmin }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function post(path: string, body?: unknown) {
    setBusy(path);
    setMsg(null);
    try {
      const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) setMsg({ ok: false, text: j.error || 'Falló' });
      else setMsg({ ok: true, text: j.sentTo ? `Enviado a ${j.sentTo}` : j.mocked ? 'Disparado (mock)' : 'Listo' });
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(null);
    }
  }

  const canRetry = isSuperadmin && status === 'FAILED';
  const btn = 'rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-semibold transition hover:bg-[var(--brand-50)] disabled:opacity-40';

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <a
          href={hasPdf ? `/api/admin/order/${encodeURIComponent(reference)}/pdf` : undefined}
          target="_blank" rel="noreferrer"
          className={`${btn} ${hasPdf ? 'text-[var(--brand)]' : 'pointer-events-none opacity-40'}`}
          title={hasPdf ? 'Ver el PDF' : 'Sin PDF guardado'}
        >PDF</a>
        <button className={`${btn} text-[var(--foreground)]`} disabled={!hasPdf || !!busy}
          onClick={() => post(`/api/admin/order/${encodeURIComponent(reference)}/resend`, { channel: 'email' })}
          title="Reenviar por correo">✉ Correo</button>
        <button className={`${btn} text-[#0a7d3f]`} disabled={!hasPdf || !!busy}
          onClick={() => post(`/api/admin/order/${encodeURIComponent(reference)}/resend`, { channel: 'whatsapp' })}
          title="Reenviar por WhatsApp">WhatsApp</button>
        {canRetry && (
          <button className={`${btn} text-[#b42318]`} disabled={!!busy}
            onClick={() => { if (confirm('Reintentar genera de NUEVO en el SNR y puede costar el valor del certificado. ¿Continuar?')) post(`/api/admin/order/${encodeURIComponent(reference)}/retry`); }}
            title="Reintentar generación (cuesta)">↻ Reintentar</button>
        )}
        {busy && <span className="size-3 animate-spin rounded-full border-2 border-[var(--brand)]/30 border-t-[var(--brand)]" />}
      </div>
      {msg && <span className={`text-[10.5px] font-medium ${msg.ok ? 'text-[#0a7d3f]' : 'text-[#b42318]'}`}>{msg.text}</span>}
    </div>
  );
}
