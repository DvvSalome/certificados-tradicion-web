import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; // leer el saldo abre el portal del SNR: puede tardar

// Puente de LECTURA DE SALDO (mismo patrón que /api/generar): Vercel no alcanza al robot
// interno (certificados_robot:3000), así que el panel llama a
// https://certificados.fourgsolutions.com/api/saldo → esta ruta corre en el web de
// EasyPanel (sí está en la red interna) y reenvía al robot.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret') || '';
  if (!process.env.N8N_WEBHOOK_SECRET || secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  try {
    const target = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/saldo'
      : 'http://certificados_robot:3000/saldo';
    const body = await req.text(); // puede traer {cuenta:"CCxxxx"} para leer una en concreto
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
      body: body || '{}',
      signal: AbortSignal.timeout(55_000),
    });
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
