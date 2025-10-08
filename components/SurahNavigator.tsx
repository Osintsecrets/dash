'use client';

import Link from 'next/link';
import { SURAHS } from '@/lib/quran-meta';

export default function SurahNavigator({ currentSurah, currentAyah }: { currentSurah?: number; currentAyah?: number }) {
  return (
    <aside className="card sticky top-4 max-h-[80vh] overflow-auto">
      <h3 className="mb-2 text-lg">Navigator</h3>
      <ul className="grid gap-1 text-sm">
        {SURAHS.map((surah) => (
          <li key={surah.n} className={surah.n === currentSurah ? 'font-semibold text-slate-100' : 'text-slate-300'}>
            <Link className="hover:underline" href={`/read/${surah.n}/${currentAyah ?? 1}/`}>
              {surah.n}. {surah.translit}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
