import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orders';
import { checkoutUrl } from '@/lib/wompi';
import { AMOUNT_IN_CENTS } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';
import { verificar } from '@/lib/verify';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const matricula = String(body.matricula ?? '').trim();
  const oficina = String(body.oficina ?? '').trim();
  const email = body.email ? String(body.email).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;

  if (!/^\d{2,10}$/.test(matricula)) return NextResponse.json({ error: 'Matrícula inválida (solo números)' }, { status: 400 });
  if (!isOficina(oficina)) return NextResponse.json({ error: 'Selecciona una oficina de registro válida' }, { status: 400 });
  if (!email && !phone) return NextResponse.json({ error: 'Ingresa un correo o un WhatsApp' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
  if (phone && !/^\+?\d{7,15}$/.test(phone)) return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });

  // VALIDAR ANTES DE COBRAR: si la consulta es conclusiva y la matrícula NO está disponible, no se crea
  // la orden ni se redirige a Wompi (evita cobrar por una matrícula inexistente). Pega caché (el modal ya
  // validó) → instantáneo. Si la validación no es concluyente (mock/timeout) se deja pasar (fail-open):
  // el robot vuelve a consultar antes de generar y, si falla, la devolución automática es el respaldo.
  const check = await verificar(oficina, matricula);
  const inconclusive = check.mocked || !!check.error; // mock/timeout → fail-open (robot + devolución respaldan)
  if (!inconclusive && check.disponible === false) {
    return NextResponse.json({ error: 'No encontramos esa matrícula en esa oficina. Verifícala antes de pagar.' }, { status: 422 });
  }

  const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
  await orders.create({ reference, matricula, oficina, email, phone, amountInCents: AMOUNT_IN_CENTS, status: 'PENDING_PAYMENT', createdAt: new Date().toISOString() });

  // URL pública del sitio. Detrás de un proxy (Traefik/Vercel) NO usar req.url (da el origen interno localhost).
  // Prioridad: APP_BASE_URL (fijo y seguro) -> X-Forwarded-Host -> req.url.
  const fwdHost = req.headers.get('x-forwarded-host');
  const fwdProto = req.headers.get('x-forwarded-proto') || 'https';
  const origin = process.env.APP_BASE_URL || (fwdHost ? `${fwdProto}://${fwdHost}` : new URL(req.url).origin);
  const url = checkoutUrl({ reference, amountInCents: AMOUNT_IN_CENTS, redirectUrl: `${origin}/estado?ref=${reference}` });
  return NextResponse.json({ ok: true, reference, checkoutUrl: url });
}
