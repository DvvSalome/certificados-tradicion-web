import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orders';
import { checkoutUrl } from '@/lib/wompi';
import { planAmountCents } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';
import { verificar } from '@/lib/verify';

export const runtime = 'nodejs';

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

  // VALIDAR ANTES DE COBRAR: si la consulta es conclusiva y la matrícula NO está disponible, no se crea
  // la orden ni se redirige a Wompi (evita cobrar por una matrícula inexistente). Pega caché (el modal ya
  // validó) → instantáneo. Si la validación no es concluyente (mock/timeout) se deja pasar (fail-open):
  // el robot vuelve a consultar antes de generar y, si falla, la devolución automática es el respaldo.
  const check = await verificar(oficina, matricula);
  const inconclusive = check.mocked || !!check.error; // mock/timeout → fail-open (robot + devolución respaldan)
  if (!inconclusive && check.disponible === false) {
    return NextResponse.json({ error: 'No encontramos esa matrícula en esa oficina. Verifícala antes de pagar.' }, { status: 422 });
  }

  const plan = body.plan === 'express' ? 'express' : 'basico';
  const amountInCents = planAmountCents(plan);

  const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
  await orders.create({ reference, matricula, oficina, email, phone, amountInCents, status: 'PENDING_PAYMENT', plan, createdAt: new Date().toISOString(), nombres, apellidos, tipoId, cedula, consentAt: new Date().toISOString() });

  // URL pública del sitio. Detrás de un proxy (Traefik/Vercel) NO usar req.url (da el origen interno localhost).
  // Prioridad: APP_BASE_URL (fijo y seguro) -> X-Forwarded-Host -> req.url.
  const fwdHost = req.headers.get('x-forwarded-host');
  const fwdProto = req.headers.get('x-forwarded-proto') || 'https';
  const origin = process.env.APP_BASE_URL || (fwdHost ? `${fwdProto}://${fwdHost}` : new URL(req.url).origin);
  const url = checkoutUrl({ reference, amountInCents, redirectUrl: `${origin}/estado?ref=${reference}` });
  return NextResponse.json({ ok: true, reference, checkoutUrl: url });
}
