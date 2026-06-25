import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orders';
import { checkoutUrl } from '@/lib/wompi';
import { AMOUNT_IN_CENTS } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';

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

  const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
  await orders.create({ reference, matricula, oficina, email, phone, amountInCents: AMOUNT_IN_CENTS, status: 'PENDING_PAYMENT', createdAt: new Date().toISOString() });

  const origin = new URL(req.url).origin;
  const url = checkoutUrl({ reference, amountInCents: AMOUNT_IN_CENTS, redirectUrl: `${origin}/estado?ref=${reference}` });
  return NextResponse.json({ ok: true, reference, checkoutUrl: url });
}
