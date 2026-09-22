// Copia de los certificados al Google Drive de FourG, para que Alexis pueda rebajarlos y reenviárselos
// a sus clientes directos mucho después de que el PDF local se purgue (CERT_PDF_TTL_HOURS).
//
// Permiso MÍNIMO: scope `drive.file`, que solo da acceso a los archivos que crea esta app. No puede
// leer, mover ni borrar nada más del Drive. Por eso la carpeta la CREA la app (con drive.file no ve
// las carpetas hechas a mano desde la web de Drive, aunque se llamen igual).
//
// El archivo queda PRIVADO: se sube sin permisos de compartir. El certificado trae datos personales
// de los propietarios del inmueble (terceros), así que nunca se publica con enlace abierto; si hay
// que enviárselo a alguien, se comparte a mano desde Drive.
//
// Mismo patrón ya probado en producción en Adiós Vellos (fichas): OAuth + fetch, sin librería.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/drive/v3';
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const CARPETA = process.env.GOOGLE_DRIVE_FOLDER || 'Certitradición · Certificados';

export type ArchivoDrive = { id: string; url: string; nombre: string };

export function driveConfigurado(): boolean {
  return !!(process.env.GOOGLE_DRIVE_CLIENT_ID && process.env.GOOGLE_DRIVE_CLIENT_SECRET && process.env.GOOGLE_DRIVE_REFRESH_TOKEN);
}

// El access token dura 1 h; se guarda en memoria del proceso para no pedir uno por cada certificado.
let cache: { token: string; vence: number } | null = null;
async function token(): Promise<string> {
  if (cache && Date.now() < cache.vence) return cache.token;
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(15000),
  });
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string; error?: string };
  if (!r.ok || !j.access_token) throw new Error('Drive: no se pudo refrescar el token (' + (j.error_description || j.error || r.status) + ')');
  cache = { token: j.access_token, vence: Date.now() + Math.max(60, (j.expires_in ?? 3600) - 120) * 1000 };
  return cache.token;
}

const escapar = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

async function buscar(tk: string, q: string): Promise<{ id: string; name: string; webViewLink?: string }[]> {
  const u = new URL(`${API}/files`);
  u.searchParams.set('q', q);
  u.searchParams.set('fields', 'files(id,name,webViewLink)');
  u.searchParams.set('pageSize', '10');
  const r = await fetch(u, { headers: { Authorization: `Bearer ${tk}` }, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error('Drive: fallo al buscar (' + r.status + ')');
  return ((await r.json()) as { files?: { id: string; name: string; webViewLink?: string }[] }).files ?? [];
}

// Carpeta de la app (find-or-create). Con drive.file solo ve lo suyo, así que esta búsqueda nunca
// choca con otras carpetas del Drive que se llamen parecido.
let carpetaId: string | null = null;
async function carpeta(tk: string): Promise<string> {
  if (carpetaId) return carpetaId;
  const hay = await buscar(tk, `name='${escapar(CARPETA)}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  if (hay[0]) { carpetaId = hay[0].id; return carpetaId; }
  const r = await fetch(`${API}/files?fields=id`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tk}`, 'content-type': 'application/json' },
    body: JSON.stringify({ name: CARPETA, mimeType: 'application/vnd.google-apps.folder' }),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error('Drive: no se pudo crear la carpeta (' + r.status + ')');
  carpetaId = ((await r.json()) as { id: string }).id;
  return carpetaId;
}

/**
 * Sube (o reusa) el PDF de un pedido. Idempotente por nombre: si el certificado ya está arriba
 * —porque el robot reintentó o porque se reenvió— devuelve el que hay en vez de duplicarlo.
 */
export async function subirCertificado(nombre: string, pdf: Buffer): Promise<ArchivoDrive> {
  const tk = await token();
  const padre = await carpeta(tk);
  const yaEsta = await buscar(tk, `name='${escapar(nombre)}' and '${padre}' in parents and trashed=false`);
  if (yaEsta[0]) return { id: yaEsta[0].id, url: yaEsta[0].webViewLink || `https://drive.google.com/file/d/${yaEsta[0].id}/view`, nombre };

  // multipart: metadatos + bytes en una sola llamada (los certificados pesan poco, no hace falta resumable)
  const linde = 'certi' + Math.random().toString(36).slice(2);
  const meta = JSON.stringify({ name: nombre, parents: [padre], mimeType: 'application/pdf' });
  const cuerpo = Buffer.concat([
    Buffer.from(`--${linde}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${linde}\r\ncontent-type: application/pdf\r\n\r\n`),
    pdf,
    Buffer.from(`\r\n--${linde}--\r\n`),
  ]);
  const r = await fetch(`${UPLOAD}/files?uploadType=multipart&fields=id,webViewLink`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tk}`, 'content-type': `multipart/related; boundary=${linde}` },
    body: new Uint8Array(cuerpo),
    signal: AbortSignal.timeout(45000),
  });
  const j = (await r.json().catch(() => ({}))) as { id?: string; webViewLink?: string; error?: { message?: string } };
  if (!r.ok || !j.id) throw new Error('Drive: no se pudo subir (' + (j.error?.message || r.status) + ')');
  return { id: j.id, url: j.webViewLink || `https://drive.google.com/file/d/${j.id}/view`, nombre };
}
