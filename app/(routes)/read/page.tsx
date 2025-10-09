'use client';

import Link from 'next/link';
import SurahNavigator from '@/components/SurahNavigator';
import { Card, GlowButton } from '@/components/ui';
import { SURAHS } from '@/lib/quran-meta';

export default function ReadPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="hidden lg:block">
        <SurahNavigator currentAyah={1} />
      </div>
      <Card className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Open a passage</h1>
          <p className="text-sm text-slate-300">
            Choose a surah and start at ayah 1, or open the command palette and type <code>/q 9:29</code> to jump directly.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {SURAHS.map((surah) => (
            <GlowButton key={surah.n} asChild>
              <Link href={`/read/${surah.n}/1/` as const}>{surah.n}. {surah.translit}</Link>
            </GlowButton>
          ))}
        </div>
      </Card>
    </div>
  );
}
