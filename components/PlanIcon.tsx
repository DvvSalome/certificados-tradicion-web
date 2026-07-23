import type { PlanId } from '@/lib/config';

// Ícono distintivo por plan (hero + checkout): documento = Básico, rayo = Express,
// medalla = Avanzado. Cuadrito suave con el ícono en línea (sin dependencias).
const CFG: Record<PlanId, { bg: string; fg: string; path: React.ReactNode }> = {
  basico: {
    bg: '#eef4fb', fg: '#33608c',
    path: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></>,
  },
  express: {
    bg: '#ecfccb', fg: '#4d7c0f',
    path: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  avanzado: {
    bg: '#fef3c7', fg: '#b45309',
    path: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></>,
  },
};

export default function PlanIcon({ plan, size = 36 }: { plan: PlanId; size?: number }) {
  const c = CFG[plan];
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, background: c.bg, color: c.fg }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {c.path}
      </svg>
    </span>
  );
}
