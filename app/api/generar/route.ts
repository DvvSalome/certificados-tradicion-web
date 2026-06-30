import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Puente de disparo de generación: Vercel no alcanza al robot interno (certificados_robot:3000), así que
// apunta su N8N_GENERAR_CTL_URL a https://certificados.fourgsolutions.com/api/generar → esta ruta corre en
// el web de EasyPanel (que sí está en la red interna) y reenvía al robot. Mismo patrón que /api/orders.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret') || '';
  if (!process.env.N8N_WEBHOOK_SECRET || secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  try {
    const body = await req.text();
    const target = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/generar'
      : 'http://certificados_robot:3000/generar';
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
