import { NextResponse } from 'next/server';
import { verificarFirmaDelCrm } from '@/lib/crm';
import { crearCheckout } from '@/lib/checkout';
import { buscarOficina } from '@/lib/oficinas';
import { getPlan, formatCOP } from '@/lib/config';

// El consentimiento (términos, datos y antecedentes) solo con una afirmación EXPLÍCITA en `datos.acepta`: el título del
// botón del menú del CRM («Sí, acepto») o una respuesta escrita que empiece afirmando (sí, acepto, ok, dale, claro, de
// una, 1). Sin tildes ni mayúsculas que importen (antes /^s[ií]\b/ fallaba con «Sí»: la í no es letra para \b y el botón
// nativo llegaba como NO aceptado, 20/10/2026). Cualquier negación, duda o pregunta, o un valor que no sea texto, es no.
const AFIRMA = new Set(['si', 'acepto', 'aceptar', 'acepta', 'aceptamos', 'ok', 'okey', 'okay', 'dale', 'claro', '1']);
const DUDA = new Set(['no', 'nunca', 'jamas', 'tampoco', 'sin', 'pero', 'aunque', 'quiza', 'quizas', 'tal', 'depende', 'despues', 'luego']);
function aceptaExplicita(v: unknown): boolean {
  if (typeof v !== 'string' && typeof v !== 'number') return false;
  const t = String(v).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
  if (/[?¿]/.test(t)) return false;
  const palabras = t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!palabras.length || palabras.some((p) => DUDA.has(p))) return false;
  return AFIRMA.has(palabras[0]) || (palabras[0] === 'de' && palabras[1] === 'una');
}

export const runtime = 'nodejs';
export const maxDuration = 30;

// LA COMPRA DESDE EL CHAT DE WHATSAPP. El flujo del CRM ("Enlace de tu sistema") pregunta plan,
// matrícula, oficina y correo, y nos pide el link de pago con lo que la persona respondió; nosotros
// validamos (misma compra que el formulario: SNR fail-closed, orden, CRM) y devolvemos el link para
// que el CRM lo mande como botón de pago en el mismo chat. Al pagar, todo sigue igual que hoy: el
// webhook de Wompi, el robot y la entrega por WhatsApp y correo.
//
// Contrato (docs/integraciones-pedidos.md del CRM, sección "Enlace de tu sistema"): firmado con el
// secreto compartido; entra { contacto: { nombre, telefono, correo }, datos: { plan_elegido | plan,
// matricula, oficina, correo, acepta } }; sale { url, label, text } o { error } (el texto va al cliente).
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verificarFirmaDelCrm(req, raw)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let b: { contacto?: Record<string, unknown>; datos?: Record<string, unknown> } | null = null;
  try { b = JSON.parse(raw); } catch { /* abajo */ }
  if (!b) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const d = b.datos ?? {};
  const c = b.contacto ?? {};
  const dato = (k: string) => String(d[k] ?? '').trim();

  const planTxt = dato('plan') || dato('plan_elegido');
  const plan = /avanz/i.test(planTxt) ? 'avanzado' : /expr/i.test(planTxt) ? 'express' : 'basico';
  // La matrícula como la dicta la gente: "001-1234567" (prefijo de oficina + número) o solo el número.
  const m = dato('matricula').replace(/\s+/g, '');
  const numero = (m.includes('-') ? m.split('-').pop() : m) ?? '';
  const matricula = numero.replace(/\D/g, '');
  if (!/^\d{2,10}$/.test(matricula)) {
    return NextResponse.json({ error: 'No entendí la matrícula. Escríbela como aparece en el predial o la escritura, por ejemplo 001-1234567 (o solo el número).' }, { status: 422 });
  }
  const ofi = buscarOficina(dato('oficina') || dato('ciudad'));
  if (!ofi) return NextResponse.json({ error: 'No reconozco esa oficina de registro. Escribe la ciudad de la oficina tal como aparece en el predial (por ejemplo Medellín Sur, Bogotá Zona Norte o Cali).' }, { status: 422 });
  if ('opciones' in ofi) return NextResponse.json({ error: `¿Cuál de estas oficinas? ${ofi.opciones.map((o) => o.charAt(0) + o.slice(1).toLowerCase()).join(', ')}. Escríbela completa.` }, { status: 422 });

  const email = (dato('correo') || dato('email') || String(c.correo ?? '')).trim().toLowerCase() || null;
  const acepta = aceptaExplicita(d.acepta);
  const nombre = String(c.nombre ?? '').trim();
  const [nombres, ...resto] = nombre.split(/\s+/);

  const r = await crearCheckout({
    matricula, oficina: ofi.oficina, email, phone: String(c.telefono ?? ''), plan,
    nombres: nombres || null, apellidos: resto.join(' ') || null,
    termsAccepted: acepta, privacyAccepted: acepta, consentAntecedentes: acepta,
  }, { origin: process.env.APP_BASE_URL || 'https://certitradicion.com', referer: null, utm: { utm_source: 'whatsapp', utm_medium: 'crm', utm_campaign: 'compra-por-chat' } });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });

  const p = getPlan(plan);
  const precio = formatCOP(p.priceCop);
  return NextResponse.json({
    ok: true, url: r.url, reference: r.reference,
    label: `Pagar ${precio}`.slice(0, 20),
    text: `Listo ✅ ${p.label} para la matrícula ${matricula} de ${ofi.oficina.charAt(0) + ofi.oficina.slice(1).toLowerCase()}: ${precio}. Toca el botón para pagar con tarjeta, PSE o Nequi. Apenas pagues, el certificado te llega aquí y a ${email} en minutos.`,
  });
}
