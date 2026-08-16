// BFF → n8n workflow de ALERTAS. Un solo webhook que abanica a WhatsApp + Email (Alexis y FourG).
// Se usa para: saldo prepago bajo, y fallos del flujo de generación.
// Mismo patrón que lib/n8n.ts: oculta el secret, mock cuando no está configurado.
const ALERT_URL = process.env.N8N_ALERT_URL ?? '';
const SECRET = process.env.N8N_WEBHOOK_SECRET ?? '';

export type AlertKind = 'saldo_bajo' | 'generacion_fallida' | 'pago_fallido' | 'estudio_pendiente' | 'venta_confirmada';

export interface Alert {
  kind: AlertKind;
  title: string;
  message: string;
  // contexto libre para el mensaje (matrícula, referencia, saldo, etc.)
  data?: Record<string, string | number | null>;
}

export async function sendAlert(alert: Alert): Promise<{ ok: boolean; mocked: boolean }> {
  if (!ALERT_URL) {
    console.log('[alert mock]', alert.kind, alert.title, alert.data ?? {});
    return { ok: true, mocked: true };
  }
  try {
    const res = await fetch(ALERT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(SECRET ? { 'X-Webhook-Secret': SECRET } : {}) },
      body: JSON.stringify({ ...alert, at: new Date().toISOString() }),
    });
    return { ok: res.ok, mocked: false };
  } catch (err) {
    console.error('[alert] fallo enviando a n8n', err);
    return { ok: false, mocked: false };
  }
}
