import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPool } from '@/lib/db';
import { enviarDocumento, enviarTexto, whatsappConfigured } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// Anti-spam / anti-reintento (en memoria, 1 réplica; se resetea en redeploy):
//  - dedup de reintentos de Meta por message id (Meta reenvía el webhook si tardamos/erramos)
//  - cooldown: no reenviar el mismo cert al mismo número si ya se mandó hace <60s
// ponytail: en memoria; si el web escala a >1 réplica, mover a Redis/DB.
const SEEN = new Set<string>();
const SENT = new Map<string, number>();
const COOLDOWN_MS = 60_000;
function esDuplicado(id?: string): boolean {
  if (!id) return false;
  if (SEEN.has(id)) return true;
  SEEN.add(id);
  if (SEEN.size > 500) SEEN.delete(SEEN.values().next().value as string);
  return false;
}
function reenvioReciente(key: string): boolean {
  const last = SENT.get(key);
  return last !== undefined && Date.now() - last < COOLDOWN_MS;
}
function marcarEnviado(key: string): void {
  const now = Date.now();
  SENT.set(key, now);
  if (SENT.size > 1000) for (const [k, t] of SENT) if (now - t > COOLDOWN_MS) SENT.delete(k);
}

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
  if (!whatsappConfigured()) { console.error('[wa webhook] whatsapp NO configurado (faltan envs)'); return; }
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return; }
  const value = (body as { entry?: { changes?: { value?: { messages?: unknown[]; statuses?: unknown[] } }[] }[] })?.entry?.[0]?.changes?.[0]?.value;
  const msgs = value?.messages;
  if (!Array.isArray(msgs)) {
    // statuses = recibos de entrega/lectura (no son mensajes del cliente). Lo logueamos suave.
    if (Array.isArray(value?.statuses)) console.error('[wa webhook] evento status (entrega/lectura), no es mensaje entrante');
    else console.error('[wa webhook] evento sin messages:', JSON.stringify(value).slice(0, 200));
    return;
  }
  for (const m of msgs as { id?: string; type?: string; from?: string; text?: { body?: string } }[]) {
    if (esDuplicado(m.id)) { console.error('[wa webhook] mensaje duplicado (retry de Meta), ignorado'); continue; }
    if (m.type !== 'text' || !m.from) { console.error('[wa webhook] mensaje no-texto, ignorado:', m.type); continue; }
    const from = m.from; // wa_id del cliente, verificado por WhatsApp → ES la autorización
    const texto = m.text?.body || '';
    const ref = texto.match(/CTL-[A-Za-z0-9]+/i)?.[0];
    console.error(`[wa webhook] ENTRANTE de ${from}: "${texto.slice(0, 80)}"${ref ? ` (ref ${ref})` : ' (sin ref)'}`);

    // AUTORIZACIÓN: solo entregamos certificados cuyo pedido tenga ESTE mismo número (phone == from).
    // El número se captura al pagar. La referencia sola NO basta: es un token que puede filtrarse
    // (correo reenviado, URL /estado, captura) y entregar datos del inmueble a quien no pagó (Habeas Data).
    const { rows } = ref
      ? await getPool().query<Cert>(
          'SELECT reference, cert_pdf, matricula FROM orders WHERE reference = $1 AND phone = $2 AND cert_pdf IS NOT NULL',
          [ref.toUpperCase(), from])
      : await getPool().query<Cert>(
          'SELECT reference, cert_pdf, matricula FROM orders WHERE phone = $1 AND cert_pdf IS NOT NULL ORDER BY cert_pdf_at DESC LIMIT 1',
          [from]);
    const row = rows[0];
    if (!row || !row.cert_pdf) {
      console.error(`[wa webhook] sin certificado autorizado para ${from}${ref ? ` (ref ${ref})` : ''}`);
      await enviarTexto(from, ref
        ? 'No encuentro un certificado a nombre de este número de WhatsApp con esa referencia. Escríbenos desde el mismo número que registraste al pagar 🙏'
        : 'Hola 👋 No veo un certificado asociado a este número. Si ya pagaste, escríbenos desde el mismo número de WhatsApp que pusiste al comprar.');
      continue;
    }
    const cdKey = `${from}:${row.reference}`;
    if (reenvioReciente(cdKey)) { console.error(`[wa webhook] ${row.reference} ya enviado a ${from} hace <60s, omito reenvío`); continue; }
    try {
      await enviarDocumento(
        from,
        row.cert_pdf,
        `Certificado-Tradicion-${row.matricula}.pdf`,
        `Aquí tienes tu Certificado de Tradición y Libertad (matrícula ${row.matricula}). ¡Gracias por usar Certitradición!`,
      );
      console.error(`[wa webhook] ✅ PDF (${row.reference}, matrícula ${row.matricula}) enviado a ${from}`);
      marcarEnviado(cdKey);
    } catch (e) {
      console.error('[wa webhook] envío doc falló:', (e as Error).message);
      await enviarTexto(from, 'Tuvimos un problema enviando tu PDF por aquí, pero ya te llegó por correo. Si necesitas ayuda, respóndenos.');
    }
  }
}

type Cert = { reference: string; cert_pdf: Buffer | null; matricula: string };
