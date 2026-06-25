import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { createBatch, listBatches, type BatchItemInput } from '@/lib/batch';

export const runtime = 'nodejs';

const MAX_ITEMS = 200;

// GET: lista de lotes recientes (para el panel).
export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  return NextResponse.json({ batches: await listBatches(10) });
}

// POST: crea un lote desde el panel y dispara el procesador en loop (n8n → robot).
export async function POST(req: Request) {
  const role = await getSession();
  if (!role) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { items?: BatchItemInput[] };
  const items = (body.items ?? [])
    .map((i) => ({ matricula: String(i.matricula ?? '').trim(), oficina: String(i.oficina ?? '').trim() }))
    .filter((i) => i.matricula && i.oficina);
  if (items.length === 0) return NextResponse.json({ error: 'No hay matrículas válidas' }, { status: 400 });
  if (items.length > MAX_ITEMS) return NextResponse.json({ error: `Máximo ${MAX_ITEMS} por lote` }, { status: 400 });

  const { batchId, total } = await createBatch(role, items);

  // Dispara el procesador (fire-and-forget). El robot tomará 1 ítem a la vez con delay.
  const url = process.env.N8N_BATCH_URL;
  if (url) {
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(process.env.N8N_WEBHOOK_SECRET ? { 'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify({ batchId }),
    }).catch((e) => console.error('[batch] no se pudo disparar n8n', e));
  } else {
    console.log('[batch mock] lote', batchId, 'con', total, 'ítems — configura N8N_BATCH_URL para procesarlo');
  }

  return NextResponse.json({ ok: true, batchId, total, triggered: !!url });
}
