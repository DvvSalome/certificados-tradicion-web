import { createHmac, timingSafeEqual } from 'crypto';
import { signDownload } from './download-token';

// Puente con el CRM de FourG. Tres cosas salen de aquí (lead, pedido, WhatsApp enviado) y una
// entra (acciones que el asesor dispara desde el CRM: reenviar, reintentar). Todo firmado con
// la MISMA llave pública + secreto compartido (CRM_INGEST_KEY / CRM_INGEST_SECRET).
//
// El pedido viaja con el contrato genérico de conectores del CRM: estado, DOCUMENTOS (enlaces
// firmados de descarga, con vencimiento) y ACCIONES (rutas de este sitio que el CRM llama
// firmadas). El CRM no sabe qué es un certificado: pinta lo que mandamos.
//
// Lo que sale es BEST-EFFORT SIEMPRE: si el CRM está caído o lento, la venta sigue su curso.
// Nunca se hace await bloqueante del resultado en el camino del checkout ni se propaga el error.

const URL_CRM = process.env.CRM_INGEST_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/lead';
const URL_PEDIDOS = process.env.CRM_ORDER_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/order';
const URL_MENSAJES = process.env.CRM_MESSAGE_URL || 'https://crm.fourgsolutions.com/api/integrations/inbound/message';
const KEY = process.env.CRM_INGEST_KEY ?? '';
const SECRET = process.env.CRM_INGEST_SECRET ?? '';
const BASE_SITIO = () => process.env.APP_BASE_URL || 'https://certitradicion.com';

// La firma va sobre el string EXACTO que se envía (si se re-serializa, el hash deja de cuadrar).
async function postFirmado(url: string, body: string, timeoutMs: number): Promise<{ ok: boolean; error?: string }> {
  const sig = 'sha256=' + createHmac('sha256', SECRET).update(body, 'utf8').digest('hex');
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-fourg-signature': sig },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}

// ── CRM → sitio ──────────────────────────────────────────────────────────────
// El asesor ejecuta una acción del pedido DESDE el CRM (2026-09-09: "todo el servicio de
// Certitradición se mapea en el CRM"). El CRM firma `${ts}.${METHOD}.${ruta}.${cuerpo}` (ruta =
// pathname + query) con el mismo secreto compartido; el timestamp va dentro de la firma y caduca
// a los 5 min para que una petición capturada no se pueda repetir.
export function verificarFirmaDelCrm(req: Request, raw: string): boolean {
  if (!SECRET) return false;
  const ts = Number(req.headers.get('x-fourg-timestamp') || '');
  const sig = req.headers.get('x-fourg-signature') || '';
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000 || !sig) return false;
  const url = new URL(req.url);
  const ruta = url.pathname + url.search;
  const expected = 'sha256=' + createHmac('sha256', SECRET).update(`${ts}.${req.method.toUpperCase()}.${ruta}.${raw}`, 'utf8').digest('hex');
  const a = Buffer.from(sig), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

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

// ── Pedidos → CRM ────────────────────────────────────────────────────────────
// Espejo de la orden en el módulo /pedidos del CRM (misma llave y firma que el lead).
// Se empuja el ESTADO COMPLETO en cada transición: el receptor es idempotente por
// referencia y no retrocede estados, así que reenviar nunca daña (backfill incluido).
// Nace del 2026-08-15: una clienta compró y nadie se enteró hasta horas después.

export interface PedidoCrm {
  reference: string;
  status: string;               // los estados del sitio tal cual (PENDING_PAYMENT, PAID…)
  matricula?: string | null;
  oficina?: string | null;
  plan?: string | null;
  email?: string | null;
  phone?: string | null;
  amountInCents?: number | null; // centavos Wompi (COP*100), igual que orders.amount_in_cents
  transactionId?: string | null;
  // Lo que el asesor necesita para trabajar el pedido sin entrar al panel del sitio.
  hasCertPdf?: boolean;
  hasEstudioPdf?: boolean;
  certPdfAt?: string | null;    // desde cuándo está guardado el PDF (se purga a las CERT_PDF_TTL_HOURS)
  attempts?: number | null;
  lastError?: string | null;    // último error del robot para esta referencia
  // Copia permanente en el Drive de FourG: sobrevive a la purga del PDF local y es la que Alexis
  // reenvía a sus clientes directos. Solo la abre quien esté con la cuenta de FourG (no es pública).
  driveCertUrl?: string | null;
  driveEstudioUrl?: string | null;
}

export async function pedidoAlCrm(p: PedidoCrm, eventAt?: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!KEY || !SECRET) return { ok: false, error: 'sin credenciales' };

  // Documentos: los mismos enlaces firmados que recibe el cliente tras pagar, con el vencimiento
  // de la purga (el reaper no vuelve a espejar; el CRM los apaga solo al vencer).
  const ttlH = Number(process.env.CERT_PDF_TTL_HOURS || 48);
  const vence = p.certPdfAt ? new Date(Date.parse(p.certPdfAt) + ttlH * 3600_000).toISOString() : null;
  const descarga = (doc?: 'estudio') =>
    `${BASE_SITIO()}/api/order/${p.reference}/download?t=${signDownload(p.reference)}${doc ? '&doc=' + doc : ''}`;
  const documents = [
    ...(p.hasCertPdf ? [{ key: 'certificado', label: 'Certificado', url: descarga(), expires_at: vence }] : []),
    ...(p.hasEstudioPdf ? [{ key: 'estudio', label: 'Estudio de títulos', url: descarga('estudio'), expires_at: vence }] : []),
    // Sin expires_at: la copia de Drive no caduca, es la que queda cuando el PDF local ya se purgó.
    ...(p.driveCertUrl ? [{ key: 'certificado_drive', label: 'Certificado (Drive)', url: p.driveCertUrl, expires_at: null }] : []),
    ...(p.driveEstudioUrl ? [{ key: 'estudio_drive', label: 'Estudio de títulos (Drive)', url: p.driveEstudioUrl, expires_at: null }] : []),
  ];

  // Acciones: rutas de ESTE sitio que el CRM llama firmadas. Reenviar no cuesta (usa el PDF
  // guardado); reintentar toca el SNR y cuesta, así que va marcado como riesgoso.
  const ruta = `/api/admin/order/${p.reference}`;
  const sinPdf = !p.hasCertPdf ? (p.status === 'DELIVERED' ? 'El sitio no tiene un PDF disponible: aún no se guardó o venció su conservación' : 'Todavía no hay certificado generado') : null;
  const actions = [
    { key: 'reenviar_correo', label: '✉ Correo', method: 'POST', path: `${ruta}/resend`, body: { channel: 'email' },
      enabled: !!p.hasCertPdf && !!p.email, reason: sinPdf ?? (!p.email ? 'El pedido no tiene correo' : null), needs: 'certificado' },
    { key: 'reenviar_whatsapp', label: 'WhatsApp', method: 'POST', path: `${ruta}/resend`, body: { channel: 'whatsapp' },
      enabled: !!p.hasCertPdf && !!p.phone, reason: sinPdf ?? (!p.phone ? 'El pedido no tiene teléfono' : null), needs: 'certificado' },
    ...(p.status === 'FAILED' ? [{
      key: 'reintentar', label: '↻ Reintentar', method: 'POST', path: `${ruta}/retry`, risky: true,
      confirm: 'Reintentar vuelve a generar el certificado en el SNR y puede costar su valor. ¿Continuar?',
    }] : []),
  ];

  const body = JSON.stringify({
    source_key: KEY,
    external_ref: p.reference,
    status: p.status,
    event_at: eventAt || new Date().toISOString(),
    source: 'certitradicion',
    customer: { email: p.email ?? null, phone: p.phone ?? null, cc: '57' },
    amount_cents: p.amountInCents ?? null,
    currency: 'COP',
    transaction_id: p.transactionId ?? null,
    product: p.plan === 'express' ? 'CTL + Estudio Express' : 'CTL básico',
    item: { matricula: p.matricula ?? null, oficina: p.oficina ?? null, plan: p.plan ?? null, attempts: p.attempts ?? null, error: p.lastError ?? null },
    documents,
    actions,
  });
  return await postFirmado(URL_PEDIDOS, body, 6000);
}

// Conveniencia para los puntos donde solo se tiene la referencia: lee la fila y empuja
// el estado ACTUAL (después de la transición, nunca antes). `eventAt` solo lo usa el backfill.
export async function pedidoAlCrmPorRef(reference: string, eventAt?: string | null): Promise<{ ok: boolean; error?: string }> {
  try {
    const { getPool } = await import('./db');
    const { rows } = await getPool().query(
      `SELECT o.reference, o.status, o.matricula, o.oficina, o.plan, o.email, o.phone, o.amount_in_cents, o.transaction_id,
              (o.cert_pdf IS NOT NULL) AS has_cert_pdf, (o.estudio_pdf IS NOT NULL) AS has_estudio_pdf,
              o.cert_pdf_at, o.attempts, o.drive_cert_url, o.drive_estudio_url,
              (SELECT g.error FROM generations g WHERE g.reference = o.reference AND g.status = 'FAILED'
                ORDER BY g.created_at DESC LIMIT 1) AS last_error
         FROM orders o WHERE o.reference = $1`,
      [reference],
    );
    const r = rows[0];
    if (!r) return { ok: false, error: 'orden no encontrada' };
    return await pedidoAlCrm({
      reference: r.reference, status: r.status, matricula: r.matricula, oficina: r.oficina,
      plan: r.plan, email: r.email, phone: r.phone,
      amountInCents: r.amount_in_cents != null ? Number(r.amount_in_cents) : null,
      transactionId: r.transaction_id,
      hasCertPdf: !!r.has_cert_pdf, hasEstudioPdf: !!r.has_estudio_pdf,
      certPdfAt: r.cert_pdf_at ? new Date(r.cert_pdf_at).toISOString() : null,
      attempts: r.attempts != null ? Number(r.attempts) : null,
      lastError: r.last_error ?? null,
      driveCertUrl: r.drive_cert_url ?? null,
      driveEstudioUrl: r.drive_estudio_url ?? null,
    }, eventAt);
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 120) };
  }
}

// ── WhatsApp enviados → CRM ──────────────────────────────────────────────────
// Lo que el sitio manda por WhatsApp con su propio token (respuestas de estado, el PDF del
// certificado) no pasa por el CRM y Meta no se lo cuenta: el asesor veía al cliente preguntando
// y a nadie contestando, y el chat caía en "Esperando" (2026-09-09). Cada envío exitoso se
// espeja aquí, best-effort. El receptor es idempotente por wamid: reintentar nunca duplica.

export interface MensajeCrm {
  to: string;                    // wa_id del cliente (dígitos)
  wamid: string;                 // id que devolvió Meta al enviar
  text: string;                  // lo que se le mostró al cliente (para un PDF: nombre + caption)
  kind?: 'text' | 'document';
  filename?: string | null;
  documentUrl?: string | null;
  phoneNumberId?: string | null; // por cuál número salió, para que el CRM lo cuelgue de esa conexión
}

export async function mensajeAlCrm(m: MensajeCrm): Promise<{ ok: boolean; error?: string }> {
  if (!KEY || !SECRET) return { ok: false, error: 'sin credenciales' };
  const body = JSON.stringify({
    source_key: KEY,
    source: 'certitradicion.com',
    to: m.to,
    provider_msg_id: m.wamid,
    text: m.text,
    kind: m.kind ?? 'text',
    filename: m.filename ?? null,
    document_url: m.documentUrl ?? null,
    document_mime: m.kind === 'document' ? 'application/pdf' : null,
    phone_number_id: m.phoneNumberId ?? null,
    sent_at: new Date().toISOString(),
  });
  return await postFirmado(URL_MENSAJES, body, 4000);
}

// ── Lead → CRM ───────────────────────────────────────────────────────────────
// Empuja al comprador al CRM como contacto, para que el equipo pueda trabajarlo. Se llama JUSTO
// cuando se crea la orden, no cuando se paga: quien llenó todo (nombre, cédula, correo, WhatsApp)
// y no pagó es el lead más caliente que hay, y hasta ahora no quedaba en ninguna parte.
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
  return await postFirmado(URL_CRM, body, 6000);
}
