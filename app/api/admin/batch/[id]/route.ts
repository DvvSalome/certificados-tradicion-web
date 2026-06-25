import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin';
import { getBatch } from '@/lib/batch';

export const runtime = 'nodejs';

// Estado de un lote (el panel hace polling para mostrar el progreso en vivo).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await ctx.params;
  const batch = await getBatch(Number(id));
  if (!batch) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(batch);
}
