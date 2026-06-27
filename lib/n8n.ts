// BFF → n8n. Dispara el workflow "CTL · Generar y Entregar".
// Patrón de la skill n8n-refrendia-integration: oculta el secret, mock cuando no está configurado.
const N8N_URL = process.env.N8N_GENERAR_CTL_URL ?? '';
const SECRET = process.env.N8N_WEBHOOK_SECRET ?? '';

export interface GenerarCTLPayload {
  reference: string;
  matricula: string;
  oficina: string;
  email: string | null;
  phone: string | null;
  transactionId: string;
  plan?: 'basico' | 'express';
}

export interface N8nResult {
  ok: boolean;
  mocked: boolean;
  status?: number;
  error?: string;
}

export async function triggerGenerarCTL(payload: GenerarCTLPayload): Promise<N8nResult> {
  if (!N8N_URL) {
    console.log('[n8n mock] generar-ctl', payload.reference);
    return { ok: true, mocked: true };
  }
  try {
    const res = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(SECRET ? { 'X-Webhook-Secret': SECRET } : {}) },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, mocked: false, status: res.status };
  } catch (err) {
    return { ok: false, mocked: false, error: String(err) };
  }
}
