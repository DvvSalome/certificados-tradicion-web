import { NextResponse } from 'next/server';
import { verificar, rateLimited } from '@/lib/verify';
import { isOficina } from '@/lib/oficinas';

export const runtime = 'nodejs';

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  return (xff ? xff.split(',')[0] : '') || req.headers.get('x-real-ip') || 'anon';
}

// Valida una matrícula ANTES de pagar (lo usa el modal del checkout para mostrar la dirección).
export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Demasiadas consultas. Espera un momento.' }, { status: 429 });
  }
  const { oficina, matricula } = (await req.json().catch(() => ({}))) as { oficina?: string; matricula?: string };
  const mat = String(matricula ?? '').trim().toUpperCase();
  if (!isOficina(oficina)) return NextResponse.json({ error: 'Oficina inválida' }, { status: 400 });
  if (!/^[0-9A-Z-]{2,20}$/.test(mat)) return NextResponse.json({ error: 'Matrícula inválida' }, { status: 400 });

  const r = await verificar(oficina as string, mat);
  // mocked/error → "no concluyente": el front deja pasar (fail-open); el robot + devolución son el respaldo.
  return NextResponse.json(r);
}
