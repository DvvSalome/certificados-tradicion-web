export const PRICE_COP = Number(process.env.PRICE_BASICO_COP || process.env.PRICE_COP || 38900);
export const AMOUNT_IN_CENTS = PRICE_COP * 100;
export const CURRENCY = 'COP';
export const SITE_NAME = 'Certificado de Tradición y Libertad';

export type PlanId = 'basico' | 'express' | 'avanzado';
// requiresConsent: el plan consulta datos de terceros (antecedentes) → el checkout exige declaración de autorización.
export interface Plan { id: PlanId; label: string; tagline: string; priceCop: number; recommended?: boolean; requiresConsent?: boolean; features: string[]; }

export const PLANS: Record<PlanId, Plan> = {
  basico: {
    id: 'basico', label: 'Certi Básico', tagline: 'Ideal si solo necesitas el documento oficial',
    priceCop: Number(process.env.PRICE_BASICO_COP || 38900),
    features: ['Certificado de Tradición y Libertad (PDF oficial)', 'Entrega por correo en minutos', 'Validez 30 días'],
  },
  express: {
    id: 'express', label: 'Certi Express', tagline: 'Análisis de gravámenes con IA y semáforo de riesgo', recommended: true,
    priceCop: Number(process.env.PRICE_EXPRESS_COP || 49900), requiresConsent: true,
    features: [
      'Incluye el Certificado de Tradición y Libertad',
      'Estudio de títulos: propietarios, gravámenes y banderas de riesgo',
      '**Antecedentes judiciales de los propietarios actuales**', // ** = negrilla (gancho del plan)
      'Alertas de lavado de activos (Lista Clinton / OFAC)',
      'Avalúo comercial digital del inmueble',
    ],
  },
  avanzado: {
    id: 'avanzado', label: 'Certi Avanzado', tagline: 'Gravámenes + antecedentes de todos los propietarios',
    priceCop: Number(process.env.PRICE_AVANZADO_COP || 99900), requiresConsent: true,
    features: [
      'Todo lo del plan Express',
      '**Antecedentes completos: todos los propietarios (actuales e históricos)**',
      'Ideal para comprar con tranquilidad: sabes a quién le compras',
    ],
  },
};

export function getPlan(id: string | null | undefined): Plan { return PLANS[(id as PlanId)] ?? PLANS.basico; }
export function planAmountCents(id: string | null | undefined): number { return getPlan(id).priceCop * 100; }

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
