import SiteFooter from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-10 lg:py-14 [&_h1]:text-[clamp(1.6rem,5vw,2.1rem)] [&_h1]:font-bold [&_h1]:tracking-[-0.02em] [&_h1]:text-[var(--foreground)] [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--foreground)] [&_h2]:mt-7 [&_h2]:mb-2 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:text-[var(--muted)] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:mb-3 [&_a]:text-[var(--brand)] [&_a]:font-medium">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
