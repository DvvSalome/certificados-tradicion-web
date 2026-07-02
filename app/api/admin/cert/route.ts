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
  const b = (await req.json().catch(() => ({}))) as { reference?: string; pdfBase64?: string; estudioBase64?: string };
  if (!b.reference || (!b.pdfBase64 && !b.estudioBase64)) return NextResponse.json({ error: 'reference y (pdfBase64 o estudioBase64) requeridos' }, { status: 400 });
  // El pool de Vercel va por un proxy HTTP que hace JSON.stringify de los params: un Buffer se corromper­ía a
  // {"type":"Buffer",...}. Pasamos la base64 como TEXTO (sobrevive JSON) y la decodificamos a bytea en SQL.
  const out: Record<string, number> = {};
  if (b.pdfBase64) {
    const buf = Buffer.from(b.pdfBase64, 'base64');
    if (buf.slice(0, 5).toString() !== '%PDF-') return NextResponse.json({ error: 'cert no es PDF' }, { status: 400 });
    await getPool().query("UPDATE orders SET cert_pdf = decode($2, 'base64'), cert_pdf_at = now() WHERE reference = $1", [b.reference, b.pdfBase64]);
    out.cert = buf.length;
  }
  if (b.estudioBase64) {
    const buf = Buffer.from(b.estudioBase64, 'base64');
    if (buf.slice(0, 5).toString() !== '%PDF-') return NextResponse.json({ error: 'estudio no es PDF' }, { status: 400 });
    await getPool().query("UPDATE orders SET estudio_pdf = decode($2, 'base64') WHERE reference = $1", [b.reference, b.estudioBase64]);
    out.estudio = buf.length;
  }
  return NextResponse.json({ ok: true, ...out });
}
