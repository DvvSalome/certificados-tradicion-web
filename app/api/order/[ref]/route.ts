import { NextResponse } from 'next/server';
import { orders } from '@/lib/orders';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const { ref } = await ctx.params;
  const o = await orders.get(ref);
  if (!o) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ reference: o.reference, status: o.status, matricula: o.matricula, oficina: o.oficina });
}
