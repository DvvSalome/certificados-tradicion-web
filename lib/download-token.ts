import { createHmac, timingSafeEqual } from 'crypto';

// Token de descarga: HMAC firmado, ligado a la referencia + expiración. Se emite tras el pago (viaja en la
// redirect_url de Wompi a /estado) y se exige en /api/order/[ref]/download. Así el PDF (con PII de terceros)
// no se descarga con la sola referencia (que se filtra en correos/historial): hace falta el token firmado.
const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || process.env.N8N_WEBHOOK_SECRET || process.env.ADMIN_SESSION_SECRET || '';
const TTL_MS = 45 * 24 * 60 * 60 * 1000; // 45 días (cubre de sobra los 30 de vigencia del certificado)

export function signDownload(reference: string, now = Date.now()): string {
  const exp = now + TTL_MS;
  const mac = createHmac('sha256', SECRET).update(`${reference}.${exp}`).digest('hex').slice(0, 32);
  return `${exp}.${mac}`;
}

export function verifyDownload(reference: string, token: string | null | undefined, now = Date.now()): boolean {
  if (!SECRET || !token) return false;
  const [expStr, mac] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || now > exp || !mac) return false;
  const expected = createHmac('sha256', SECRET).update(`${reference}.${expStr}`).digest('hex').slice(0, 32);
  const a = Buffer.from(mac), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
