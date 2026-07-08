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
  plan?: 'basico' | 'express' | 'avanzado';
}

export interface N8nResult {
  ok: boolean;
  mocked: boolean;
  status?: number;
  error?: string;
}

async function postRobot(payload: unknown, mockLabel: string): Promise<N8nResult> {
  if (!N8N_URL) {
    console.log('[n8n mock]', mockLabel);
    return { ok: true, mocked: true };
  }
  try {
    const isIP = /^https?:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(N8N_URL);
    const res = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(SECRET ? { 'X-Webhook-Secret': SECRET } : {}),
        ...(isIP ? { 'Host': 'certitradicion.com' } : {})
      },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, mocked: false, status: res.status };
  } catch (err) {
    return { ok: false, mocked: false, error: String(err) };
  }
}

export async function triggerGenerarCTL(payload: GenerarCTLPayload): Promise<N8nResult> {
  return postRobot(payload, 'generar-ctl ' + payload.reference);
}

// Despacho por LOTE: manda TODOS los ítems en una sola llamada → el robot los mete en un carrito y paga
// una vez (generarLote). Misma URL/puente que triggerGenerarCTL; el robot detecta el array `items`.
export async function triggerGenerarLote(items: GenerarCTLPayload[]): Promise<N8nResult> {
  return postRobot({ items }, `generar-lote (${items.length})`);
}
