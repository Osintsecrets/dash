import type { Metadata, Route } from 'next';
import Link from 'next/link';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';

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
      <body className="bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-lg font-semibold text-accent">
                Neutral Scripture Research
              </Link>
              <nav className="flex items-center gap-2 text-sm font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-slate-200 transition hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6">
            <PwaRegister />
            {children}
          </main>
          <footer className="border-t border-slate-800 bg-slate-950/90 py-4 text-center text-sm text-slate-400">
            Primary texts and recognized interpretations are shown for study. This platform does not endorse harassment or discrimination.
          </footer>
        </div>
      </body>
    </html>
  );
}
