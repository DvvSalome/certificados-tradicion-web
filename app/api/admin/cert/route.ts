import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

// El robot guarda aquí el PDF del certificado (base64) tras generarlo, para poder reenviarlo por WhatsApp
// sin re-loguear al SNR. Auth con el mismo x-webhook-secret. El PDF es efímero (se puede purgar a los días).
function authed(req: Request): boolean {
  const s = process.env.N8N_WEBHOOK_SECRET;
  return !!s && req.headers.get('x-webhook-secret') === s;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { reference?: string; pdfBase64?: string };
  if (!b.reference || !b.pdfBase64) return NextResponse.json({ error: 'reference y pdfBase64 requeridos' }, { status: 400 });
  const buf = Buffer.from(b.pdfBase64, 'base64');
  if (buf.slice(0, 5).toString() !== '%PDF-') return NextResponse.json({ error: 'no es PDF' }, { status: 400 });
  // El pool de Vercel va por un proxy HTTP que hace JSON.stringify de los params: un Buffer se corromper­ía a
  // {"type":"Buffer",...}. Pasamos la base64 como TEXTO (sobrevive JSON) y la decodificamos a bytea en SQL.
  await getPool().query("UPDATE orders SET cert_pdf = decode($2, 'base64'), cert_pdf_at = now() WHERE reference = $1", [b.reference, b.pdfBase64]);
  return NextResponse.json({ ok: true, bytes: buf.length });
}
