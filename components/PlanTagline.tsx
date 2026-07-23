// Tagline del plan con la parte de "gravámenes" resaltada (es el gancho de venta
// del Express/Avanzado). Comparten esto el hero (HeroPlans) y el checkout.
export default function PlanTagline({ text }: { text: string }) {
  const parts = text.split(/(análisis de gravámenes|gravámenes)/i);
  return (
    <>
      {parts.map((p, i) =>
        /gravámenes/i.test(p)
          ? <strong key={i} className="font-extrabold text-[var(--brand)]">{p}</strong>
          : p
      )}
    </>
  );
}
