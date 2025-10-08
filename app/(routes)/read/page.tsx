'use client';

import Link from 'next/link';
import SurahNavigator from '@/components/SurahNavigator';
import { SURAHS } from '@/lib/quran-meta';

export default function ReadPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <SurahNavigator currentAyah={1} />
      </div>
      <div className="card lg:col-span-3">
        <h1 className="mb-3 text-2xl font-semibold">Open a passage</h1>
        <p className="mb-4 text-slate-300">
          Choose a surah and start at ayah 1, or open the command palette and type <code>/q 9:29</code> to jump directly.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {SURAHS.map((surah) => (
            <Link key={surah.n} href={`/read/${surah.n}/1/`} className="btn">
              {surah.n}. {surah.translit}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
