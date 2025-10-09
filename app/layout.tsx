import type { Metadata, Route } from 'next';
import Link from 'next/link';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';
import CommandPalette from '@/components/CommandPalette';
import { ToastProvider } from '@/components/ToastProvider';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export const metadata: Metadata = {
  title: 'Neutral Scripture Research',
  description: 'Comparative scripture research & debate prep platform focused on primary texts and transparent provenance.'
};

const navItems: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/read', label: 'Read' },
  { href: '/hadith', label: 'Hadith' },
  { href: '/topics', label: 'Topics' },
  { href: '/sheets', label: 'Sheets' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/about', label: 'About' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-brand-bg text-slate-100">
        <AnimatedBackground />
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-surface/80 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/40 via-brand-accent2/30 to-brand-accent/10 text-brand-accent shadow-brand-glow">
                    ⨁
                  </span>
                  <span>Neutral Scripture Research</span>
                </Link>
                <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/80"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <span className="rounded-full px-3 py-2 text-xs uppercase tracking-wide text-slate-500">
                    Cmd/Ctrl + K
                  </span>
                </nav>
                <div className="flex items-center gap-2 sm:hidden">
                  <span className="text-xs text-slate-500">Cmd/Ctrl + K</span>
                </div>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-10">
              <PwaRegister />
              {children}
            </main>
            <footer className="border-t border-white/5 bg-brand-surface/70 py-6 text-center text-sm text-slate-400">
              Primary texts and recognized interpretations are shown for study. This platform does not endorse harassment or discrimination.
            </footer>
          </div>
          <CommandPalette />
        </ToastProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}`,
          }}
        />
      </body>
    </html>
  );
}
