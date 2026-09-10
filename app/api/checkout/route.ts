import { NextResponse } from 'next/server';
import { rateLimited } from '@/lib/verify';
import { crearCheckout, utmDeReferer } from '@/lib/checkout';

export const runtime = 'nodejs';
// El checkout revalida contra el SNR antes de cobrar (fail-closed), así que hereda el mismo riesgo que
// /api/validar: sin esto Vercel corta a los 10s y la compra muere en el último clic.
export const maxDuration = 30;

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  return (xff ? xff.split(',')[0] : '') || req.headers.get('x-real-ip') || 'anon';
}

// Checkout del FORMULARIO del sitio. La compra en sí (validación, SNR, orden, CRM, link de Wompi)
// vive en lib/checkout.ts y la comparte con /api/crm/checkout (la compra desde el chat de WhatsApp).
export async function POST(req: Request) {
  // Rate limit por IP: cada checkout ejecuta verificar() contra el portal del SNR y crea una orden.
  // Un flood podría inflar la tabla orders y disparar el bloqueo de la cuenta SNR por logins/día.
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  // URL pública del sitio. Detrás de un proxy (Traefik/Vercel) NO usar req.url (da el origen interno localhost).
  // Prioridad: APP_BASE_URL (fijo y seguro) -> X-Forwarded-Host -> req.url.
  const fwdHost = req.headers.get('x-forwarded-host');
  const fwdProto = req.headers.get('x-forwarded-proto') || 'https';
  const origin = process.env.APP_BASE_URL || (fwdHost ? `${fwdProto}://${fwdHost}` : new URL(req.url).origin);
  const referer = req.headers.get('referer');

  const r = await crearCheckout({
    matricula: String(body.matricula ?? ''),
    oficina: String(body.oficina ?? ''),
    email: body.email ? String(body.email) : null,
    phone: body.phone ? String(body.phone) : null,
    plan: String(body.plan ?? 'basico'),
    nombres: body.nombres ? String(body.nombres) : null,
    apellidos: body.apellidos ? String(body.apellidos) : null,
    tipoId: body.tipoId ? String(body.tipoId) : null,
    cedula: body.cedula ? String(body.cedula) : null,
    termsAccepted: body.termsAccepted === true,
    privacyAccepted: body.privacyAccepted === true,
    consentAntecedentes: body.consentAntecedentes === true,
  }, { origin, referer, utm: utmDeReferer(referer) });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ ok: true, reference: r.reference, checkoutUrl: r.url });
}
