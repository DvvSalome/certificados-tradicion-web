// Cliente WhatsApp Cloud API (Meta). Envía el certificado (documento) DENTRO de la ventana de servicio de
// 24h → gratis, sin plantilla. Token + phone number ID por env (nunca en código/git).
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

// Envía el certificado (PDF) a un número. Dentro de la ventana de 24h = gratis (sin plantilla).
export async function enviarDocumento(to: string, pdf: Buffer, filename: string, caption: string): Promise<void> {
  const mediaId = await uploadMedia(pdf, filename);
  const res = await fetch(`${BASE}/${PHONE_ID()}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'document', document: { id: mediaId, filename, caption } }),
  });
  if (!res.ok) throw new Error('WA send doc: ' + JSON.stringify(await res.json().catch(() => ({}))).slice(0, 200));
}

// Texto simple (para respuestas de ayuda/error dentro de la ventana). Best-effort.
export async function enviarTexto(to: string, body: string): Promise<void> {
  await fetch(`${BASE}/${PHONE_ID()}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
  }).catch(() => {});
}
