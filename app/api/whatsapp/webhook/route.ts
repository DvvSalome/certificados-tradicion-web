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
    console.error('[wa webhook] ⛔ WHATSAPP_APP_SECRET no seteado → rechazo el evento (fail-closed). Configúralo.');
    return false;
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
  // IMPORTANTE (serverless): NO fire-and-forget. En Vercel la función se CONGELA al responder y mataría el
  // procesamiento asíncrono → el mensaje llegaba pero la respuesta nunca se enviaba (por eso "dejó de
  // contestar" al migrar de EasyPanel a Vercel). Awaiteamos antes de responder. Es rápido (1 query + 1 envío)
  // y cabe holgado en el timeout del webhook de Meta.
  await procesar(raw).catch((e) => console.error('[wa webhook] procesar:', e));
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

    // ── UNA SOLA VOZ HABLA CON EL CLIENTE ────────────────────────────────────────────
    // Este número está suscrito a DOS apps de Meta: la del sitio (esta) y la del CRM.
    // Meta le entrega cada mensaje a las dos, y las dos contestaban: el cliente recibía
    // DOS respuestas distintas al mismo "hola", a veces contradictorias ("no veo tu
    // certificado" y "te lo consigo en minutos"). Comprobado el 2026-09-09.
    //
    // El dueño de la conversación es el CRM: sabe de embudo, etapas, historial y asesor.
    // El sitio conserva SOLO lo que el CRM no puede hacer: reconocer una referencia
    // CTL- y devolver ese PDF exacto desde su base.
    //
    // Sin referencia => silencio. No es que no haya nada que decir: es que ya lo dijo el CRM.
    if (!ref) { console.error('[wa webhook] sin referencia CTL- → lo atiende el CRM, no respondo'); continue; }

    // AUTORIZACIÓN: solo entregamos certificados cuyo pedido tenga ESTE mismo número (phone == from).
    // El número se captura al pagar. La referencia sola NO basta: es un token que puede filtrarse
    // (correo reenviado, URL /estado, captura) y entregar datos del inmueble a quien no pagó (Habeas Data).
    // cert_pdf sale como base64 (encode en SQL): el pool de Vercel va por un proxy HTTP con JSON.stringify,
    // un Buffer crudo llegaría corrupto como {"type":"Buffer",...}. Reconstruimos el Buffer con Buffer.from.
    // La comparación de la referencia va SIN distinguir mayúsculas, en los dos lados.
    // Antes se hacía `reference = $1` con `ref.toUpperCase()`, y eso NUNCA podía coincidir:
    // el checkout genera la referencia con randomUUID(), que devuelve el hex en minúscula
    // ('CTL-1e86381a…'), y la columna es TEXT (case-sensitive). Resultado: todo cliente que
    // mandaba su referencia recibía "no encuentro un certificado", con el pago hecho y el PDF
    // guardado. Solo funcionaba el camino sin referencia (por teléfono).
    // Se compara con upper() en ambos lados y no bajando el input, porque el teclado del celular
    // autocapitaliza y el cliente puede escribirla como sea.
    // ponytail: upper() no usa el índice de la PK. Con este volumen de pedidos da igual.
    const { rows } = ref
      ? await getPool().query<Cert>(
          "SELECT reference, encode(cert_pdf,'base64') AS cert_pdf_b64, encode(estudio_pdf,'base64') AS estudio_pdf_b64, matricula FROM orders WHERE upper(reference) = upper($1) AND phone = $2 AND cert_pdf IS NOT NULL",
          [ref, from])
      : await getPool().query<Cert>(
          "SELECT reference, encode(cert_pdf,'base64') AS cert_pdf_b64, encode(estudio_pdf,'base64') AS estudio_pdf_b64, matricula FROM orders WHERE phone = $1 AND cert_pdf IS NOT NULL ORDER BY cert_pdf_at DESC LIMIT 1",
          [from]);
    const row = rows[0];
    if (!row || !row.cert_pdf_b64) {
      console.error(`[wa webhook] sin certificado autorizado para ${from}${ref ? ` (ref ${ref})` : ''}`);
      // DIAGNÓSTICO: la consulta de arriba exige referencia + teléfono + PDF a la vez, así que al
      // fallar no se sabe cuál de las tres condiciones falló. Esta consulta lo dice. Del teléfono
      // guardado solo se loguean los últimos 4 dígitos: sirve para comparar sin volcar el número.
      if (ref) {
        try {
          const d = await getPool().query<{ phone: string | null; tiene_pdf: boolean; status: string }>(
            "SELECT phone, (cert_pdf IS NOT NULL) AS tiene_pdf, status FROM orders WHERE upper(reference) = upper($1)",
            [ref]);
          const o = d.rows[0];
          if (!o) console.error(`[wa webhook] diag: la referencia ${ref} NO existe en orders`);
          else console.error(`[wa webhook] diag: ${ref} existe · status=${o.status} · pdf=${o.tiene_pdf} · phone guardado ***${(o.phone || '').slice(-4)} vs from ***${from.slice(-4)}`);
        } catch (e) { console.error('[wa webhook] diag falló:', e); }
      }
      // Aqui SIEMPRE hay referencia (arriba se corta si no la hay), y este mensaje si es del
      // sitio: el CRM no puede saber que una referencia concreta no cuadra con este numero.
      await enviarTexto(from, 'Mmm, no encuentro un certificado con esa referencia a nombre de este número 🤔. Verifica que sea la referencia de tu correo de confirmación (empieza por CTL-) y escríbeme desde el mismo número de WhatsApp con el que pagaste 🙏');
      continue;
    }
    const cdKey = `${from}:${row.reference}`;
    if (reenvioReciente(cdKey)) { console.error(`[wa webhook] ${row.reference} ya enviado a ${from} hace <60s, omito reenvío`); continue; }
    try {
      await enviarDocumento(
        from,
        Buffer.from(row.cert_pdf_b64, 'base64'),
        `Certificado-Tradicion-${row.matricula}.pdf`,
        `Aquí tienes tu Certificado de Tradición y Libertad (matrícula ${row.matricula}). ¡Gracias por usar Certitradición!`,
      );
      console.error(`[wa webhook] ✅ CTL (${row.reference}, matrícula ${row.matricula}) enviado a ${from}`);
      // Express: si el pedido tiene Estudio de Títulos guardado, lo enviamos también como 2º documento.
      if (row.estudio_pdf_b64) {
        try {
          await enviarDocumento(
            from,
            Buffer.from(row.estudio_pdf_b64, 'base64'),
            `Estudio-Titulos-${row.matricula}.pdf`,
            `Y aquí tu Estudio de Títulos: propietarios, gravámenes, banderas de riesgo y avalúo estimado. ⚖️ Análisis informativo, no reemplaza asesoría legal.`,
          );
          console.error(`[wa webhook] ✅ Estudio (${row.reference}) enviado a ${from}`);
        } catch (ee) { console.error('[wa webhook] envío estudio falló:', (ee as Error).message); }
      }
      marcarEnviado(cdKey);
    } catch (e) {
      console.error('[wa webhook] envío doc falló:', (e as Error).message);
      await enviarTexto(from, 'Tuvimos un problema enviando tu PDF por aquí, pero ya te llegó por correo. Si necesitas ayuda, respóndenos.');
    }
  }
}

type Cert = { reference: string; cert_pdf_b64: string; estudio_pdf_b64: string | null; matricula: string };
