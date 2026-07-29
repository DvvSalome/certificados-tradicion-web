import { createHmac } from 'crypto';

// Empuja al comprador al CRM de FourG como contacto, para que el equipo pueda trabajarlo.
// Se llama JUSTO cuando se crea la orden, no cuando se paga: quien llenó todo (nombre, cédula,
// correo, WhatsApp) y no pagó es el lead más caliente que hay, y hasta ahora no quedaba en ninguna parte.
//
// BEST-EFFORT SIEMPRE: si el CRM está caído o lento, la venta sigue su curso. Nunca se hace await
// bloqueante del resultado en el camino del checkout ni se propaga el error.

const URL_CRM = process.env.CRM_INGEST_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/lead';
const KEY = process.env.CRM_INGEST_KEY ?? '';
const SECRET = process.env.CRM_INGEST_SECRET ?? '';

export interface LeadCrm {
  nombre?: string | null;
  email?: string | null;
  phone?: string | null;
  etapa?: 'interesado' | 'ganado';
  referencia: string;
  plan?: string | null;
  matricula?: string | null;
  oficina?: string | null;
  montoCents?: number | null;
  landingUrl?: string | null;
  utm?: Record<string, string> | null;
}

export async function enviarLeadAlCrm(l: LeadCrm): Promise<{ ok: boolean; error?: string }> {
  if (!KEY || !SECRET) return { ok: false, error: 'sin credenciales' }; // no configurado → no-op silencioso

  const body = JSON.stringify({
    source_key: KEY,
    name: l.nombre || null,
    email: l.email || null,
    phone: l.phone || null,
    cc: '57',
    stage_key: l.etapa || 'interesado',
    source: 'checkout',
    attributes: {
      referencia: l.referencia,
      plan: l.plan ?? null,
      matricula: l.matricula ?? null,
      oficina: l.oficina ?? null,
      // El CRM muestra pesos, no centavos: se convierte aquí para que el asesor lea $38.900.
      monto: l.montoCents != null ? Math.round(l.montoCents / 100) : null,
    },
    referral: {
      landing_url: l.landingUrl ?? null,
      ...(l.utm && Object.keys(l.utm).length ? { utm: l.utm } : {}),
    },
  });

  // La firma va sobre el string EXACTO que se envía (si se re-serializa, el hash deja de cuadrar).
  const sig = 'sha256=' + createHmac('sha256', SECRET).update(body, 'utf8').digest('hex');

  try {
    const r = await fetch(URL_CRM, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-fourg-signature': sig },
      body,
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}
