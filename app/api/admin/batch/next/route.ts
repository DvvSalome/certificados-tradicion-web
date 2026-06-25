import { NextResponse } from 'next/server';
import { claimNextItem } from '@/lib/batch';

export const runtime = 'nodejs';

// El robot pide el siguiente ítem pendiente (loop secuencial). Protegido por secret.
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const item = await claimNextItem();
  if (!item) return NextResponse.json({ empty: true });
  return NextResponse.json({ empty: false, item });
}
