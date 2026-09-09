// Cliente WhatsApp Cloud API (Meta). Envía el certificado (documento) DENTRO de la ventana de servicio de
// 24h → gratis, sin plantilla. Token + phone number ID por env (nunca en código/git).
import { mensajeAlCrm } from './crm';

const BASE = 'https://graph.facebook.com/v21.0';
const TOKEN = () => process.env.WHATSAPP_TOKEN || '';
const PHONE_ID = () => process.env.WHATSAPP_PHONE_NUMBER_ID || '';

export function whatsappConfigured(): boolean {
  return !!TOKEN() && !!PHONE_ID();
}

// Sube un PDF a Meta → devuelve media_id.
async function uploadMedia(pdf: Buffer, filename: string): Promise<string> {
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', 'application/pdf');
  form.append('file', new Blob([new Uint8Array(pdf)], { type: 'application/pdf' }), filename);
  const res = await fetch(`${BASE}/${PHONE_ID()}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}` },
    body: form,
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.id) throw new Error('WA media upload: ' + JSON.stringify(j).slice(0, 200));
  return j.id as string;
}

// Todo lo que sale por aquí queda espejado en el CRM de FourG, para que el asesor vea lo que el
// sitio ya le contestó al cliente (si no, el chat cae en "Esperando" con la respuesta ya dada).
// Best-effort y después del envío: un CRM caído jamás frena un certificado.
async function espejar(to: string, wamid: string | null, text: string, kind: 'text' | 'document' = 'text', filename: string | null = null): Promise<void> {
  if (!wamid) return;
  const r = await mensajeAlCrm({ to, wamid, text, kind, filename, phoneNumberId: PHONE_ID() });
  if (!r.ok) console.error('[wa] espejo al CRM falló:', r.error);
}

// Envía el certificado (PDF) a un número. Dentro de la ventana de 24h = gratis (sin plantilla).
// Devuelve el wamid de Meta.
export async function enviarDocumento(to: string, pdf: Buffer, filename: string, caption: string): Promise<string | null> {
  const mediaId = await uploadMedia(pdf, filename);
  const res = await fetch(`${BASE}/${PHONE_ID()}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'document', document: { id: mediaId, filename, caption } }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error('WA send doc: ' + JSON.stringify(j).slice(0, 200));
  const wamid: string | null = j?.messages?.[0]?.id ?? null;
  await espejar(to, wamid, `📎 ${filename}\n${caption}`, 'document', filename);
  return wamid;
}

// Texto simple (para respuestas de ayuda/error dentro de la ventana). Best-effort, pero loguea si falla.
// Devuelve el wamid de Meta, o null si no salió.
export async function enviarTexto(to: string, body: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/${PHONE_ID()}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { console.error('[wa] enviarTexto falló:', JSON.stringify(j).slice(0, 200)); return null; }
    const wamid: string | null = j?.messages?.[0]?.id ?? null;
    await espejar(to, wamid, body);
    return wamid;
  } catch (e) {
    console.error('[wa] enviarTexto error:', (e as Error).message);
    return null;
  }
}
