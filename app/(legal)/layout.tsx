import SiteFooter from '@/components/SiteFooter';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">Certificado de Tradición</span>
          </a>
          <a href="/" className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-600)]">Solicitar</a>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-10 lg:py-14 [&_h1]:text-[clamp(1.6rem,5vw,2.1rem)] [&_h1]:font-bold [&_h1]:tracking-[-0.02em] [&_h1]:text-[var(--foreground)] [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--foreground)] [&_h2]:mt-7 [&_h2]:mb-2 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:text-[var(--muted)] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:mb-3 [&_a]:text-[var(--brand)] [&_a]:font-medium">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
