import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Puente de validación: Vercel no alcanza al robot interno, y correr la consulta al SNR desde Vercel (EE.UU.)
// se cuelga. verify.ts (en Vercel) pega a certificados.fourgsolutions.com/api/verificar → esta ruta (web de
// EasyPanel, red interna) reenvía al robot, que consulta el SNR desde el VPS (~800ms). Mismo patrón que /api/generar.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret') || '';
  if (!process.env.N8N_WEBHOOK_SECRET || secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  try {
    const body = await req.text();
    const target = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/verificar'
      : 'http://certificados_robot:3000/verificar';
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
