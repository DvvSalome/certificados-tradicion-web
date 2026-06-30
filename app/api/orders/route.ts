import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret') || '';
    // Rechazar de una si el secreto no coincide (no reenviar nada al robot sin auth).
    if (!process.env.N8N_WEBHOOK_SECRET || secret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
    }
    const body = await req.json();

    // Este endpoint está diseñado para ejecutarse en EasyPanel (certificados_web)
    // y hacer proxy a certificados_robot en el puerto interno 3000.
    // Si se ejecuta localmente, certificados_robot:3000 fallará a menos que se use Docker Compose.
    
    const targetUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3010/api/orders' 
      : 'http://certificados_robot:3000/api/orders';

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': secret
      },
      body: JSON.stringify(body)
    });
    
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
