import { createHash, timingSafeEqual } from 'crypto';

const PUB = process.env.WOMPI_PUBLIC_KEY ?? '';
const INTEGRITY = process.env.WOMPI_INTEGRITY_SECRET ?? '';
const EVENTS = process.env.WOMPI_EVENTS_SECRET ?? '';
const PRIVATE = process.env.WOMPI_PRIVATE_KEY ?? '';
const EVENT_MAX_AGE_S = 300;
const CHECKOUT_BASE = process.env.WOMPI_CHECKOUT_URL || 'https://checkout.wompi.co/p/';

// Firma de integridad para el Web Checkout: SHA256(reference + amountInCents + currency + secret)
export function integritySignature(reference: string, amountInCents: number, currency = 'COP'): string {
  return createHash('sha256').update(`${reference}${amountInCents}${currency}${INTEGRITY}`).digest('hex');
}

export function checkoutUrl(opts: { reference: string; amountInCents: number; redirectUrl: string; currency?: string }): string {
  const currency = opts.currency || 'COP';
  const p = new URLSearchParams({
    'public-key': PUB,
    currency,
    'amount-in-cents': String(opts.amountInCents),
    reference: opts.reference,
    'redirect-url': opts.redirectUrl,
    'signature:integrity': integritySignature(opts.reference, opts.amountInCents, currency),
  });
  return `${CHECKOUT_BASE}?${p.toString()}`;
}

// Valida el checksum de un evento webhook de Wompi.
// checksum = SHA256( valores(signature.properties dentro de data) + timestamp + events_secret )
export function verifyEvent(body: unknown): boolean {
  const b = body as { data?: Record<string, unknown>; timestamp?: number; signature?: { properties?: string[]; checksum?: string } };
  const sig = b?.signature;
  if (!sig?.properties?.length || !sig?.checksum || b.timestamp == null || !b.data) return false;
  // Anti-replay: rechazar eventos fuera de ±5 min.
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(Number(b.timestamp)) || Math.abs(now - Number(b.timestamp)) > EVENT_MAX_AGE_S) return false;
  const values = sig.properties.map((path) =>
    String(path.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), b.data)),
  );
  const concat = values.join('') + b.timestamp + EVENTS;
  const expected = createHash('sha256').update(concat).digest('hex');
  const got = String(sig.checksum).toLowerCase();
  if (expected.length !== got.length) return false;
  // Comparación de tiempo constante (evita timing attack sobre el checksum).
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(got));
  } catch {
    return false;
  }
}

// Consulta una transacción en la API de Wompi (FUENTE DE VERDAD; nunca confiar solo en el webhook/redirect).
export async function getTransaction(
  id: string,
): Promise<{ status: string; reference: string; amount_in_cents: number; currency: string } | null> {
  try {
    const base = process.env.WOMPI_API_BASE || 'https://production.wompi.co/v1';
    const r = await fetch(`${base}/transactions/${id}`, {
      cache: 'no-store',
      headers: PRIVATE ? { Authorization: `Bearer ${PRIVATE}` } : {},
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { data?: { status: string; reference: string; amount_in_cents: number; currency: string } };
    return j.data ?? null;
  } catch {
    return null;
  }
}
