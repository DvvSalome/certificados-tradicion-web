import { createHash } from 'node:crypto';

// Conversions API de Meta: Purchase server-side desde el webhook de Wompi. Complementa el
// pixel del navegador (que pierde 40-60% de eventos por bloqueadores y iOS): va al MISMO
// pixel (certitradicion_web) y con el MISMO event_id (la referencia CTL) que manda
// fbq('track','Purchase',...,{eventID}) en EstadoView, así Meta DEDUPLICA y no cuenta doble.
// Sin META_CAPI_TOKEN configurado es un no-op silencioso: nunca rompe el webhook de pago.
const PIXEL_ID = '1747057343316637';

const sha = (v: string) => createHash('sha256').update(v).digest('hex');

export async function capiPurchase(o: {
  reference: string;
  email?: string | null;
  phone?: string | null;
  amountInCents: number;
}): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;
  try {
    // Advanced matching: Meta exige los datos personales HASHEADOS (sha256, normalizados).
    const user_data: Record<string, string[]> = {};
    if (o.email) user_data.em = [sha(o.email.trim().toLowerCase())];
    if (o.phone) user_data.ph = [sha(o.phone.replace(/[^0-9]/g, ''))];
    const body = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: o.reference,
          action_source: 'website',
          event_source_url: 'https://certitradicion.com/estado',
          user_data,
          custom_data: { value: o.amountInCents / 100, currency: 'COP' },
        },
      ],
    };
    const r = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (!r.ok) console.warn('[meta capi] HTTP', r.status, (await r.text()).slice(0, 200));
  } catch (e) {
    console.warn('[meta capi] error:', e instanceof Error ? e.message : String(e));
  }
}
