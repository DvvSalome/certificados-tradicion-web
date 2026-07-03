// Bloque de autoría + frescura (E-E-A-T) reutilizable en la página pilar y las guías. La IA y Google
// premian el contenido con autor y fecha de actualización visibles, sobre todo en temas legales (YMYL).
// NOTA: para máximo E-E-A-T, reemplazar el autor por un revisor con nombre y credencial real
// (p. ej. "Revisado por [Abogado], especialista en derecho registral").
export const UPDATED_LABEL = 'julio de 2026';
export const UPDATED_ISO = '2026-07-01';

export function ArticleMeta({ author = 'Equipo editorial de Certitradición' }: { author?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--muted-2)]">
      <span className="inline-flex items-center gap-1.5">
        <svg className="size-4 text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        <span className="font-medium text-[var(--muted)]">{author}</span>
      </span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1.5">
        <svg className="size-4 text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        Actualizado en {UPDATED_LABEL}
      </span>
    </div>
  );
}
