// Sección "Lo que dicen nuestros clientes" — testimonios con calificación.
//
// ⚠️ PLACEHOLDERS: estos testimonios son ILUSTRATIVOS para el lanzamiento. Reemplázalos
// por reseñas REALES y verificables de clientes. NO se marcan como Review/aggregateRating
// en el JSON-LD a propósito: publicar reseñas inventadas como structured data puede
// acarrear una acción manual de Google. Cuando tengas reseñas reales, se cablean al
// schema desde ESTE mismo arreglo (una sola fuente de verdad).

type Review = { name: string; city: string; stars: number; text: string };

const REVIEWS: Review[] = [
  { name: 'María Fernanda R.', city: 'Barranquilla', stars: 5, text: 'Necesitaba el certificado para una compraventa y me llegó al WhatsApp en menos de 10 minutos. Todo clarísimo, sin filas ni vueltas.' },
  { name: 'Andrés Gómez', city: 'Bogotá', stars: 5, text: 'No sabía la matrícula de mi apartamento y me ayudaron a ubicarla. Excelente acompañamiento y el PDF llegó oficial.' },
  { name: 'Luisa Martínez', city: 'Medellín', stars: 5, text: 'Lo usé antes de firmar el arriendo para revisar que el inmueble no tuviera embargos. Rápido y seguro con el pago por PSE.' },
  { name: 'Carlos Herrera', city: 'Cali', stars: 4, text: 'Muy buen servicio, el certificado llegó actualizado y me explicaron las anotaciones que no entendía.' },
  { name: 'Diana Patiño', city: 'Cartagena', stars: 5, text: 'Estaba desconfiada de pagar en línea, pero el pago con Wompi me dio tranquilidad y recibí el documento al instante.' },
  { name: 'Jorge Rodríguez', city: 'Bucaramanga', stars: 5, text: 'Como asesor inmobiliario los uso seguido. El resumen del estado jurídico me ahorra horas con cada predio.' },
];

const AVG = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1);

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`size-4 ${i < n ? 'text-[#f59e0b]' : 'text-gray-200'}`} fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.6l1.2-6.5L2.5 9l6.6-.9L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="border-t border-[var(--border)] bg-[var(--background)] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm">
            Opiniones
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center gap-2.5">
            <Stars n={5} />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {AVG} de 5 · {REVIEWS.length} opiniones
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <Stars n={r.stars} />
              <blockquote className="text-[15px] leading-relaxed text-[var(--foreground)]">“{r.text}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand-50)] text-sm font-bold text-[var(--brand)]">
                  {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{r.name}</p>
                  <p className="text-xs text-[var(--muted-2)]">{r.city}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
