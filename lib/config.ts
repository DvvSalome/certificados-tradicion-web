export const PRICE_COP = Number(process.env.PRICE_BASICO_COP || process.env.PRICE_COP || 39800);
export const AMOUNT_IN_CENTS = PRICE_COP * 100;
export const CURRENCY = 'COP';
export const SITE_NAME = 'Certificado de Tradición y Libertad';

export type PlanId = 'basico' | 'express';
export interface Plan { id: PlanId; label: string; tagline: string; priceCop: number; recommended?: boolean; features: string[]; }

export const PLANS: Record<PlanId, Plan> = {
  basico: {
    id: 'basico', label: 'Básico', tagline: 'Ideal si solo necesitas el documento oficial',
    priceCop: Number(process.env.PRICE_BASICO_COP || 39800),
    features: ['Certificado de Tradición y Libertad (PDF oficial)', 'Entrega por correo en minutos', 'Validez 30 días'],
  },
  express: {
    id: 'express', label: 'Express', tagline: 'Descubre problemas ocultos del inmueble', recommended: true,
    priceCop: Number(process.env.PRICE_EXPRESS_COP || 44900),
    features: [
      'Incluye el Certificado de Tradición y Libertad',
      'Estudio de títulos: propietarios, gravámenes y banderas de riesgo',
      'Alertas de lavado de activos (Lista Clinton / OFAC)',
      'Avalúo comercial digital del inmueble',
    ],
  },
};

export function getPlan(id: string | null | undefined): Plan { return PLANS[(id as PlanId)] ?? PLANS.basico; }
export function planAmountCents(id: string | null | undefined): number { return getPlan(id).priceCop * 100; }

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
