import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orders';
import { checkoutUrl } from '@/lib/wompi';
import { signDownload } from '@/lib/download-token';
import { planAmountCents, getPlan } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';
import { verificar, rateLimited } from '@/lib/verify';

export const runtime = 'nodejs';

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  return (xff ? xff.split(',')[0] : '') || req.headers.get('x-real-ip') || 'anon';
}

// Normaliza al formato wa_id de WhatsApp (dígitos con indicativo de país, sin +/espacios) para que coincida
// con el `from` que manda Meta. Así el webhook entrega el certificado SOLO al número que pagó.
// ponytail: heurística simple (Colombia local → +57, resto se asume con indicativo). Para los quirks de
// trunk-0 de otros países (UK/AR/etc.) no es perfecta, pero el correo siempre es el respaldo de entrega.
function normalizeWa(raw: string | null): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2); // prefijo de marcación internacional → fuera
  if (d.length === 10 && d.startsWith('3')) d = '57' + d; // celular colombiano local sin indicativo → +57
  return d.length >= 8 && d.length <= 15 ? d : null; // E.164: cualquier país
}

export async function POST(req: Request) {
  // Rate limit por IP: cada checkout ejecuta verificar() contra el portal del SNR y crea una orden.
  // Un flood podría inflar la tabla orders y disparar el bloqueo de la cuenta SNR por logins/día.
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const matricula = String(body.matricula ?? '').trim();
  const oficina = String(body.oficina ?? '').trim();
  const email = body.email ? String(body.email).trim() : null;
  const phone = normalizeWa(body.phone ? String(body.phone) : null);

  if (!/^\d{2,10}$/.test(matricula)) return NextResponse.json({ error: 'Matrícula inválida (solo números)' }, { status: 400 });
  if (!isOficina(oficina)) return NextResponse.json({ error: 'Selecciona una oficina de registro válida' }, { status: 400 });
  if (!email) return NextResponse.json({ error: 'El correo electrónico es obligatorio' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
  // WhatsApp obligatorio: es a dónde (y a quién) entregamos el certificado de forma autorizada.
  if (!phone) return NextResponse.json({ error: 'Ingresa un número de WhatsApp válido con indicativo de país (ej: +57 300…)' }, { status: 400 });

  // Datos del comprador (registro/facturación) + CONSENTIMIENTO explícito (Ley 1581, Habeas Data).
  // Se exige en el SERVIDOR: la casilla del form gatea la UI, pero el registro real de la autorización va acá.
  const nombres = body.nombres ? String(body.nombres).trim() : null;
  const apellidos = body.apellidos ? String(body.apellidos).trim() : null;
  const tipoId = body.tipoId ? String(body.tipoId).trim() : null;
  const cedula = body.cedula ? String(body.cedula).replace(/\D/g, '') : null;
  if (body.termsAccepted !== true || body.privacyAccepted !== true) {
    return NextResponse.json({ error: 'Debes aceptar los términos y la política de tratamiento de datos para continuar.' }, { status: 400 });
  }

  // VALIDAR ANTES DE COBRAR (fail-CLOSED): solo se cobra si la matrícula está CONFIRMADA como disponible.
  //  - disponible=true  → seguimos al pago.
  //  - disponible=false → 422 "no encontrada" (no cobramos por algo inexistente).
  //  - no verificable (portal del SNR caído/lento/error) → 503 "intenta más tarde": si no podemos verificar,
  //    tampoco vamos a poder generar → mejor no cobrar. (mocked = entorno local sin robot → se permite.)
  const check = await verificar(oficina, matricula);
  if (check.disponible !== true && !check.mocked) {
    if (check.disponible === false && !check.error) {
      return NextResponse.json({ error: 'No encontramos esa matrícula en esa oficina. Verifícala antes de pagar.' }, { status: 422 });
    }
    return NextResponse.json({ error: 'El portal oficial del SNR no está disponible en este momento. Por favor intenta más tarde.' }, { status: 503 });
  }

  const plan = body.plan === 'express' || body.plan === 'avanzado' ? body.plan : 'basico';
  // Los planes que consultan antecedentes de terceros exigen declaración de autorización (Ley 1581).
  if (getPlan(plan).requiresConsent && body.consentAntecedentes !== true) {
    return NextResponse.json({ error: 'Este plan requiere confirmar la autorización del propietario para consultar sus antecedentes.' }, { status: 422 });
  }
  const amountInCents = planAmountCents(plan);

  const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
  await orders.create({ reference, matricula, oficina, email, phone, amountInCents, status: 'PENDING_PAYMENT', plan, createdAt: new Date().toISOString(), nombres, apellidos, tipoId, cedula, consentAt: new Date().toISOString() });

  // URL pública del sitio. Detrás de un proxy (Traefik/Vercel) NO usar req.url (da el origen interno localhost).
  // Prioridad: APP_BASE_URL (fijo y seguro) -> X-Forwarded-Host -> req.url.
  const fwdHost = req.headers.get('x-forwarded-host');
  const fwdProto = req.headers.get('x-forwarded-proto') || 'https';
  const origin = process.env.APP_BASE_URL || (fwdHost ? `${fwdProto}://${fwdHost}` : new URL(req.url).origin);
  // Token de descarga firmado en la redirección → habilita bajar el PDF desde /estado sin exponerlo a
  // cualquiera que tenga la sola referencia (protección de PII, Habeas Data).
  const dl = signDownload(reference);
  const url = checkoutUrl({ reference, amountInCents, redirectUrl: `${origin}/estado?ref=${reference}&t=${dl}` });
  return NextResponse.json({ ok: true, reference, checkoutUrl: url });
}
