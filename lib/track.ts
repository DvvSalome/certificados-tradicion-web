'use client';

// Registro de pasos del visitante (cliente). Anónimo: un id de sesión aleatorio en
// sessionStorage, sin datos personales. Fire-and-forget: si falla, la página sigue igual.
export type Paso = 'view' | 'plan_click' | 'form_start' | 'validate_ok' | 'validate_fail' | 'checkout' | 'paid';

const KEY = 'ct_sid';

function sid(): string {
  try {
    let s = sessionStorage.getItem(KEY);
    if (!s) {
      s = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, s);
    }
    return s;
  } catch {
    return 'anon';
  }
}

// Los UTM llegan en la URL de entrada; se guardan para toda la sesión porque el visitante
// navega y los pierde de la barra (sin esto, solo la primera vista tendría origen).
function utms(): Record<string, string> {
  try {
    const guardado = sessionStorage.getItem('ct_utm');
    const p = new URLSearchParams(location.search);
    const actual: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      const v = p.get(k);
      if (v) actual[k] = v;
    }
    if (Object.keys(actual).length) {
      sessionStorage.setItem('ct_utm', JSON.stringify(actual));
      return actual;
    }
    return guardado ? JSON.parse(guardado) : {};
  } catch {
    return {};
  }
}

export function track(event: Paso, extra: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({
    sid: sid(),
    event,
    path: location.pathname,
    ref: (() => { try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; } })(),
    ...utms(),
    ...extra,
  });
  try {
    // sendBeacon sobrevive a que el visitante cierre o navegue justo después del evento.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      return;
    }
  } catch { /* cae al fetch */ }
  fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
}
