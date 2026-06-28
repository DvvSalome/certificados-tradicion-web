import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPool } from '@/lib/db';
import { enviarDocumento, enviarTexto, whatsappConfigured } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// GET — verificación del webhook: Meta manda hub.mode + hub.verify_token + hub.challenge y esperamos que
// devolvamos el challenge si el verify_token coincide. (Apretón de manos, una sola vez.)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? '', { status: 200, headers: { 'content-type': 'text/plain' } });
  }
  return new Response('forbidden', { status: 403 });
}

// Verifica la firma de Meta (X-Hub-Signature-256 = HMAC-SHA256(app_secret, body crudo)).
function firmaValida(raw: string, sig: string): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET || '';
  if (!secret) {
    console.warn('[wa webhook] WHATSAPP_APP_SECRET no seteado → firma NO verificada (configúralo antes de producción)');
    return true;
  }
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// POST — mensajes entrantes. El cliente escribe "...mi certificado CTL-XXXX" → le reenviamos el PDF
// (dentro de la ventana de 24h = gratis). Responder 200 YA y procesar en segundo plano.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!firmaValida(raw, req.headers.get('x-hub-signature-256') || '')) {
    return new Response('bad signature', { status: 401 });
  }
  procesar(raw).catch((e) => console.error('[wa webhook] procesar:', e));
  return NextResponse.json({ ok: true });
}

async function procesar(raw: string) {
  if (!whatsappConfigured()) return;
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return; }
  const value = (body as { entry?: { changes?: { value?: { messages?: unknown[] } }[] }[] })?.entry?.[0]?.changes?.[0]?.value;
  const msgs = value?.messages;
  if (!Array.isArray(msgs)) return;
  for (const m of msgs as { type?: string; from?: string; text?: { body?: string } }[]) {
    if (m.type !== 'text' || !m.from) continue;
    const from = m.from;
    const ref = (m.text?.body || '').match(/CTL-[A-Za-z0-9]+/i)?.[0];
    if (!ref) {
      await enviarTexto(from, 'Hola 👋 Para enviarte tu certificado necesito el número de referencia (empieza por CTL-), lo ves en el correo de confirmación.');
      continue;
    }
    const { rows } = await getPool().query<{ cert_pdf: Buffer | null; matricula: string }>(
      'SELECT cert_pdf, matricula FROM orders WHERE reference = $1',
      [ref.toUpperCase()],
    );
    const row = rows[0];
    if (!row || !row.cert_pdf) {
      await enviarTexto(from, 'Aún no tengo el certificado listo para esa referencia. Si ya pagaste, dame unos minutos y vuelve a escribir 🙏');
      continue;
    }
    try {
      await enviarDocumento(
        from,
        row.cert_pdf,
        `Certificado-Tradicion-${row.matricula}.pdf`,
        `Aquí tienes tu Certificado de Tradición y Libertad (matrícula ${row.matricula}). ¡Gracias por usar Certitradición!`,
      );
    } catch (e) {
      console.error('[wa webhook] envío doc falló:', (e as Error).message);
      await enviarTexto(from, 'Tuvimos un problema enviando tu PDF por aquí, pero ya te llegó por correo. Si necesitas ayuda, respóndenos.');
    }
  }
}
