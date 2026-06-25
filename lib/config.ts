export const PRICE_COP = Number(process.env.PRICE_COP || 39900);
export const AMOUNT_IN_CENTS = PRICE_COP * 100;
export const CURRENCY = 'COP';
export const SITE_NAME = 'Certificado de Tradición y Libertad';

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
