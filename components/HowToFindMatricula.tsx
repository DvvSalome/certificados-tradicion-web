import React from 'react';

export default function HowToFindMatricula() {
  return (
    <div className="w-full bg-white rounded-2xl border border-[var(--border)] p-5 sm:p-8 my-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        ¿Cómo encuentro mi matrícula inmobiliaria?
      </h2>
      
      {/* Option 1: Old Certificate */}
      <div className="mb-12">
        <p className="text-center text-sm font-medium text-[var(--muted)] mb-5">
          Desde un certificado de tradición y libertad antiguo.
        </p>
        <div className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-300 bg-[#e4e6e7] p-4 sm:p-6 shadow-inner">
          <div className="flex items-start justify-between">
            <div className="text-[8px] sm:text-[10px] font-black uppercase leading-tight text-gray-700 w-[30%] opacity-80">
              SNR SUPERINTENDENCIA<br/>DE NOTARIADO<br/>Y REGISTRO
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="z-10 rounded border-[3px] border-[#ef4444] bg-white px-2 py-1 text-xs sm:text-sm font-bold text-black shadow-sm">
                Oficina de registro
              </div>
              {/* Arrow */}
              <div className="h-8 w-0.5 bg-[#ef4444]"></div>
              <div className="h-2 w-2 -mt-1 rotate-45 border-b-2 border-r-2 border-[#ef4444]"></div>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="z-10 rounded border-[3px] border-[#84cc16] bg-white px-2 py-1 text-xs sm:text-sm font-bold text-black shadow-sm">
                Matricula
              </div>
              {/* Arrow */}
              <div className="h-8 w-0.5 bg-[#84cc16]"></div>
              <div className="h-2 w-2 -mt-1 rotate-45 border-b-2 border-r-2 border-[#84cc16]"></div>
            </div>
          </div>
          
          <div className="mt-2 text-center text-[9px] sm:text-[11px] font-bold text-gray-700 opacity-80">
            MATRICULA INMOBILIARIA
          </div>
          
          <div className="mt-4 flex items-end justify-between border-b border-gray-400 pb-2">
            <div className="text-[9px] sm:text-[10px] text-gray-600">
              Certificado generado con el Pin No: 123456789...
            </div>
            <div className="flex items-center">
              <div className="rounded-l border-[3px] border-[#ef4444] bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-bold text-black">
                50N
              </div>
              <span className="px-1 font-bold text-black">-</span>
              <div className="rounded-r border-[3px] border-[#84cc16] bg-[#f7fee7] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-bold text-black">
                11111111
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Option 2: Property Tax */}
      <div>
        <p className="text-center text-sm font-medium text-[var(--muted)] mb-5">
          Desde un impuesto predial.
        </p>
        <div className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-300 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between mb-8">
            <div className="text-[10px] sm:text-xs font-black uppercase leading-tight text-black w-1/3 text-center sm:text-left">
              FACTURA<br/>IMPUESTO PREDIAL<br/>UNIFICADO
            </div>
            
            <div className="flex flex-1 justify-end gap-2 sm:gap-4">
              <div className="relative flex flex-col items-center">
                <div className="z-10 rounded border-[3px] border-[#ef4444] bg-white px-2 py-1 text-xs sm:text-sm font-bold text-black shadow-sm">
                  Oficina de registro
                </div>
                {/* Arrow */}
                <div className="h-10 w-0.5 bg-[#ef4444]"></div>
                <div className="h-2 w-2 -mt-1 rotate-45 border-b-2 border-r-2 border-[#ef4444]"></div>
              </div>

              <div className="relative flex flex-col items-center">
                <div className="z-10 rounded border-[3px] border-[#84cc16] bg-white px-2 py-1 text-xs sm:text-sm font-bold text-black shadow-sm">
                  Matrícula
                </div>
                {/* Arrow */}
                <div className="h-10 w-0.5 bg-[#84cc16]"></div>
                <div className="h-2 w-2 -mt-1 rotate-45 border-b-2 border-r-2 border-[#84cc16]"></div>
              </div>
            </div>
          </div>
          
          <div className="flex border-[3px] border-black mt-2">
            <div className="flex-1 flex items-center px-2 py-1 text-[8px] sm:text-[10px] font-bold text-black uppercase">
              3. MATRÍCULA INMOBILIARIA
            </div>
            <div className="flex border-l-[3px] border-black bg-white">
              <div className="border-[3px] border-[#ef4444] bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-bold text-black -ml-1 -mt-1 -mb-1 relative z-10">
                050C
              </div>
              <div className="border-[3px] border-[#84cc16] bg-[#f7fee7] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-bold text-black -ml-[3px] -mt-1 -mb-1 -mr-1 relative z-10">
                01234567
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
