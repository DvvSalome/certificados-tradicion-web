'use client';

// Modal de ayuda "¿Cómo encuentro mi matrícula inmobiliaria?" — mismo contenido que la referencia
// (certificado antiguo + impuesto predial), con ilustraciones anotadas propias (mock de documento con
// el recuadro rojo = Oficina de registro y el verde = Matrícula). Se abre desde el campo de matrícula.

// Valor de documento con una etiqueta de color encima (rojo = oficina, verde = matrícula).
function LabeledBox({ color, label, value }: { color: 'red' | 'green'; label: string; value: string }) {
  const ring = color === 'red' ? 'ring-red-500' : 'ring-green-500';
  const chip = color === 'red' ? 'bg-red-500' : 'bg-green-600';
  return (
    <span className="relative inline-flex flex-col items-center">
      <span className={`mb-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white ${chip}`}>{label}</span>
      <span className={`rounded bg-white px-1.5 py-0.5 font-mono text-[12px] font-bold text-gray-900 ring-2 ${ring}`}>{value}</span>
    </span>
  );
}

function QrMock() {
  // patrón tipo QR (decorativo)
  const cells = '1101011 1001101 1011001 0110110 1101011 1000101 1011101'.split(' ');
  return (
    <div className="grid grid-cols-7 gap-[1px]" aria-hidden>
      {cells.flatMap((row, r) => row.split('').map((c, i) => (
        <span key={`${r}-${i}`} className={`size-[3px] ${c === '1' ? 'bg-gray-900' : 'bg-transparent'}`} />
      )))}
    </div>
  );
}

export default function MatriculaHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">¿Cómo encuentro mi matrícula inmobiliaria?</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Cerrar">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-5">
          <p className="mb-2 text-center text-sm font-semibold text-gray-500">Desde un certificado de tradición y libertad antiguo.</p>
          {/* Mock encabezado SNR */}
          <div className="mb-7 rounded-xl border border-gray-200 bg-[#f3f4f6] p-4">
            <div className="mb-2 flex items-center gap-2 border-b border-gray-300 pb-2">
              <span className="font-black leading-none tracking-tight text-[#1b1b2f]">
                SNR
                <span className="block text-[6px] font-semibold leading-tight text-gray-500">SUPERINTENDENCIA DE<br />NOTARIADO &amp; REGISTRO</span>
              </span>
              <span className="ml-auto text-[9px] font-semibold uppercase tracking-wide text-gray-400">Oficina · Datos de certificación</span>
            </div>
            <p className="text-center text-[11px] font-bold tracking-wide text-gray-700">MATRÍCULA INMOBILIARIA</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-1.5 gap-y-2">
              <span className="pb-0.5 font-mono text-[11px] text-gray-600">Certificado generado con el Pin No: 12345… Nro Matrícula:</span>
              <LabeledBox color="red" label="Oficina de registro" value="50N" />
              <span className="pb-1 font-mono text-[12px] font-bold text-gray-500">-</span>
              <LabeledBox color="green" label="Matrícula" value="111111111" />
            </div>
            <p className="mt-3 text-[9px] text-gray-400">Página 1 · TURNO: 2024-241282</p>
          </div>

          <p className="mb-2 text-center text-sm font-semibold text-gray-500">Desde un impuesto predial.</p>
          {/* Mock factura predial */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between border-b border-gray-300 pb-2">
              <p className="text-[11px] font-black uppercase leading-tight text-gray-800">Factura<br />Impuesto Predial<br />Unificado</p>
              <div className="flex items-start gap-2">
                <div className="text-right">
                  <p className="text-[8px] uppercase text-gray-400">No. Referencia</p>
                  <p className="font-mono text-[11px] text-gray-700">123456789</p>
                </div>
                <span className="rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">401</span>
                <QrMock />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-x-1.5 gap-y-2">
              <span className="pb-0.5 text-[11px] font-semibold text-gray-600">3. MATRÍCULA INMOBILIARIA:</span>
              <LabeledBox color="red" label="Oficina de registro" value="050C" />
              <LabeledBox color="green" label="Matrícula" value="1234567" />
            </div>
          </div>

          <p className="mt-5 rounded-xl bg-[var(--brand-50)] px-4 py-3 text-[13px] text-[var(--foreground)]">
            La <b className="text-red-600">oficina de registro</b> (código del círculo) va en el selector, y el número de <b className="text-green-700">matrícula</b> en el campo de matrícula. ¿No la encuentras? Escríbenos por WhatsApp y te ayudamos.
          </p>
        </div>

        <div className="border-t p-4">
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-[var(--brand)] py-3 font-bold text-white hover:bg-[var(--brand-600)]">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
