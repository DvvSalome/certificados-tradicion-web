import { after } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orders';
import { checkoutUrl } from '@/lib/wompi';
import { signDownload } from '@/lib/download-token';
import { planAmountCents, getPlan, type PlanId } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';
import { verificar } from '@/lib/verify';
import { enviarLeadAlCrm, pedidoAlCrm } from '@/lib/crm';

// LA COMPRA, sin importar por dónde entró: el formulario del sitio (/api/checkout) o el chat de
// WhatsApp del CRM (/api/crm/checkout, el flujo pregunta plan, matrícula, oficina y correo). Valida,
// verifica contra el SNR (fail-closed), crea la orden, avisa al CRM y devuelve el link de pago de
// Wompi. Antes vivía dentro de la ruta del formulario; se sacó el 2026-09-10 para no duplicarla.

export interface CheckoutInput {
  matricula: string;
  oficina: string;
  email: string | null;
  phone: string | null;
  plan: string;
  nombres?: string | null;
  apellidos?: string | null;
  tipoId?: string | null;
  cedula?: string | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  consentAntecedentes: boolean;
}

export type CheckoutResult =
  | { ok: true; reference: string; url: string; amountInCents: number; plan: PlanId }
  | { ok: false; status: number; error: string };

// Atribución del lead: de qué campaña venía la página desde la que compró. Sale del referer porque
// el checkout es server-to-server y no ve la URL del navegador. Si no hay, el lead entra igual.
export function utmDeReferer(referer: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!referer) return out;
  try {
    const p = new URL(referer).searchParams;
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
      const v = p.get(k);
      if (v) out[k] = v.slice(0, 120);
    }
  } catch { /* referer no parseable → sin atribución */ }
  return out;
}

// Normaliza al formato wa_id de WhatsApp (dígitos con indicativo de país, sin +/espacios) para que coincida
// con el `from` que manda Meta. Así el webhook entrega el certificado SOLO al número que pagó.
// ponytail: heurística simple (Colombia local → +57, resto se asume con indicativo). Para los quirks de
// trunk-0 de otros países (UK/AR/etc.) no es perfecta, pero el correo siempre es el respaldo de entrega.
export function normalizeWa(raw: string | null): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2); // prefijo de marcación internacional → fuera
  if (d.length === 10 && d.startsWith('3')) d = '57' + d; // celular colombiano local sin indicativo → +57
  return d.length >= 8 && d.length <= 15 ? d : null; // E.164: cualquier país
}

export async function crearCheckout(
  b: CheckoutInput,
  ctx: { origin: string; referer: string | null; utm?: Record<string, string> },
): Promise<CheckoutResult> {
  const matricula = b.matricula.trim();
  const oficina = b.oficina.trim();
  const email = b.email ? b.email.trim() : null;
  const phone = normalizeWa(b.phone);

  if (!/^\d{2,10}$/.test(matricula)) return { ok: false, status: 400, error: 'Matrícula inválida (solo números)' };
  if (!isOficina(oficina)) return { ok: false, status: 400, error: 'Selecciona una oficina de registro válida' };
  if (!email) return { ok: false, status: 400, error: 'El correo electrónico es obligatorio' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, status: 400, error: 'Correo inválido' };
  // WhatsApp obligatorio: es a dónde (y a quién) entregamos el certificado de forma autorizada.
  if (!phone) return { ok: false, status: 400, error: 'Ingresa un número de WhatsApp válido con indicativo de país (ej: +57 300…)' };

  // Datos del comprador (registro/facturación) + CONSENTIMIENTO explícito (Ley 1581, Habeas Data).
  // Se exige en el SERVIDOR: la casilla del form gatea la UI, pero el registro real de la autorización va acá.
  const nombres = b.nombres ? String(b.nombres).trim() : null;
  const apellidos = b.apellidos ? String(b.apellidos).trim() : null;
  const tipoId = b.tipoId ? String(b.tipoId).trim() : null;
  const cedula = b.cedula ? String(b.cedula).replace(/\D/g, '') : null;
  if (b.termsAccepted !== true || b.privacyAccepted !== true) {
    return { ok: false, status: 400, error: 'Debes aceptar los términos y la política de tratamiento de datos para continuar.' };
  }

  // VALIDAR ANTES DE COBRAR (fail-CLOSED): solo se cobra si la matrícula está CONFIRMADA como disponible.
  //  - disponible=true  → seguimos al pago.
  //  - disponible=false → 422 "no encontrada" (no cobramos por algo inexistente).
  //  - no verificable (portal del SNR caído/lento/error) → 503 "intenta más tarde": si no podemos verificar,
  //    tampoco vamos a poder generar → mejor no cobrar. (mocked = entorno local sin robot → se permite.)
  const check = await verificar(oficina, matricula);
  if (check.disponible !== true && !check.mocked) {
    // El SNR dio una razón (folio en calificación, o su portal público no discrimina esta matrícula):
    // se la pasamos tal cual al cliente. Decirle "no encontramos esa matrícula" sería mentirle, y
    // decirle "el portal está caído" lo deja reintentando contra algo que no va a cambiar hoy.
    if (check.disponible === false && !check.error && check.motivo) {
      return { ok: false, status: 422, error: check.motivo };
    }
    if (check.disponible === false && !check.error) {
      return { ok: false, status: 422, error: 'No encontramos esa matrícula en esa oficina. Verifícala antes de pagar.' };
    }
    return { ok: false, status: 503, error: 'El portal oficial del SNR no está disponible en este momento. Por favor intenta más tarde.' };
  }

  const plan: PlanId = b.plan === 'express' || b.plan === 'avanzado' ? b.plan : 'basico';
  // Los planes que consultan antecedentes de terceros exigen declaración de autorización (Ley 1581).
  if (getPlan(plan).requiresConsent && b.consentAntecedentes !== true) {
    return { ok: false, status: 422, error: 'Este plan requiere confirmar la autorización del propietario para consultar sus antecedentes.' };
  }
  const amountInCents = planAmountCents(plan);

  const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
  await orders.create({ reference, matricula, oficina, email, phone, amountInCents, status: 'PENDING_PAYMENT', plan, createdAt: new Date().toISOString(), nombres, apellidos, tipoId, cedula, consentAt: new Date().toISOString() });

  // El comprador entra al CRM YA, sin esperar al pago: si abandona en la pasarela, el equipo tiene a
  // quién llamar. Va en after() y no en un `void promesa`: en serverless la función se congela apenas
  // responde, así que un fire-and-forget suelto NUNCA llega a ejecutarse (verificado en producción).
  // after() corre después de responder, así que tampoco demora la redirección al pago.
  after(async () => {
    const r = await enviarLeadAlCrm({
      nombre: [nombres, apellidos].filter(Boolean).join(' ') || null,
      email, phone, etapa: 'interesado', referencia: reference,
      plan, matricula, oficina, montoCents: amountInCents,
      landingUrl: ctx.referer,
      utm: ctx.utm ?? utmDeReferer(ctx.referer),
    });
    if (!r.ok) console.error('[crm] lead no enviado: ' + r.error);
    // El pedido nace en el módulo /pedidos del CRM desde ya (pendiente de pago).
    const p = await pedidoAlCrm({
      reference, status: 'PENDING_PAYMENT', matricula, oficina, plan,
      email, phone, amountInCents,
    });
    if (!p.ok) console.error('[crm] pedido no enviado: ' + p.error);
  });

  // Token de descarga firmado en la redirección → habilita bajar el PDF desde /estado sin exponerlo a
  // cualquiera que tenga la sola referencia (protección de PII, Habeas Data).
  const dl = signDownload(reference);
  const url = checkoutUrl({ reference, amountInCents, redirectUrl: `${ctx.origin}/estado?ref=${reference}&t=${dl}` });
  return { ok: true, reference, url, amountInCents, plan };
}
