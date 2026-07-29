import type { Funnel } from '@/lib/admin';

// Embudo: en qué paso se pierde la gente. Es la pregunta que ni los pedidos ni el Ads
// Manager responden — un visitante que llega y se va no deja rastro en ninguna tabla.
const nf = (n: number) => n.toLocaleString('es-CO');

export default function FunnelPanel({ f }: { f: Funnel }) {
  const pasos = [
    { txt: 'Entraron al sitio', n: f.visitas, ayuda: 'Visitantes únicos' },
    { txt: 'Eligieron un plan', n: f.vieronPlanes, ayuda: 'Tocaron una tarjeta de plan (paso opcional)' },
    { txt: 'Empezaron a llenar', n: f.empezaronForm, ayuda: 'Escribieron su primer dato en el formulario' },
    { txt: 'Validaron su matrícula', n: f.validaron, ayuda: 'El SNR confirmó que existe' },
    { txt: 'Fueron a pagar', n: f.alPago, ayuda: 'Completaron el formulario' },
    { txt: 'Pagaron', n: f.pagaron, ayuda: 'Compra confirmada', final: true },
  ];
  const max = Math.max(f.visitas, 1);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-5 py-3.5">
        <div>
          <h2 className="text-sm font-bold text-[var(--foreground)]">Dónde se cae la gente</h2>
          <p className="text-xs text-[var(--muted)]">Últimos {f.dias} días · cada paso incluye a los que llegaron más lejos</p>
        </div>
      </div>

      {f.visitas === 0 ? (
        <p className="p-5 text-[13px] text-[var(--muted)]">
          Aún no hay visitas registradas. El seguimiento acaba de activarse: en cuanto entre gente al sitio, aquí verás en qué paso se queda cada uno.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 p-5">
          {pasos.map((p, i) => {
            const anterior = i > 0 ? pasos[i - 1].n : null;
            // Cuánto se pierde ENTRE pasos: es el número que dice dónde meter mano.
            const caida = anterior && anterior > 0 ? Math.round(((anterior - p.n) / anterior) * 100) : null;
            const ancho = Math.max((p.n / max) * 100, p.n > 0 ? 4 : 1.5);
            return (
              <div key={p.txt}>
                {caida !== null && caida > 0 && (
                  <p className="mb-1 pl-1 text-[11px] font-semibold text-[#b42318]">↓ se fue el {caida}%</p>
                )}
                <div className="flex items-center gap-3">
                  <div className="h-9 flex-1 overflow-hidden rounded-lg bg-[var(--background)]">
                    <div
                      className="flex h-full items-center px-3 text-[12.5px] font-bold text-white"
                      style={{ width: `${ancho}%`, background: p.final ? 'var(--accent)' : 'var(--brand)', minWidth: 44 }}
                    >
                      {nf(p.n)}
                    </div>
                  </div>
                  <div className="w-[46%] shrink-0">
                    <p className="text-[13px] font-semibold text-[var(--foreground)]">{p.txt}</p>
                    <p className="text-[11px] text-[var(--muted-2)]">{p.ayuda}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Una validación fallida NO es un visitante curioso: es alguien que ya escribió su matrícula y se
              quedó sin poder pagar (el checkout no cobra si el SNR no confirma). Es la fuga más cara. */}
          {f.validacionFallida > 0 && (
            <div className="mt-3 rounded-lg border border-[#f5c2c0] bg-[#fef3f2] px-3.5 py-2.5">
              <p className="text-[12.5px] font-semibold text-[#b42318]">
                {nf(f.validacionFallida)} {f.validacionFallida === 1 ? 'persona intentó validar' : 'personas intentaron validar'} y no se pudo
                {f.validaron + f.validacionFallida > 0 && (
                  <> · falla {Math.round((f.validacionFallida / (f.validaron + f.validacionFallida)) * 100)}% de las veces</>
                )}
              </p>
              <p className="mt-0.5 text-[11px] text-[#912018]">
                Sin confirmación del SNR no se puede cobrar, así que cada una de estas es una venta perdida.
              </p>
            </div>
          )}

          {f.porCampana.length > 0 && (
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--muted-2)]">De dónde llegan</p>
              <div className="flex flex-col gap-1.5">
                {f.porCampana.map((c) => (
                  <div key={c.campana} className="flex items-center justify-between gap-3 text-[12.5px]">
                    <span className="truncate text-[var(--foreground)]">{c.campana}</span>
                    <span className="shrink-0 text-[var(--muted)]">
                      {nf(c.visitas)} visitas · <b className="text-[var(--foreground)]">{nf(c.alPago)}</b> al pago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
