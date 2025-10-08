'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';
import { SURAHS } from '@/lib/quran-meta';

export default function SurahNavigator({ currentSurah, currentAyah }: { currentSurah?: number; currentAyah?: number }) {
  return (
    <Card className="sticky top-24 max-h-[70vh] overflow-auto space-y-3">
      <h3 className="text-lg font-semibold text-white">Navigator</h3>
      <ul className="grid gap-1 text-sm">
        {SURAHS.map((surah) => (
          <li key={surah.n}>
            <Link
              className={`block rounded-2xl px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 ${
                surah.n === currentSurah ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
              href={`/read/${surah.n}/${currentAyah ?? 1}/`}
            >
              {surah.n}. {surah.translit}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
