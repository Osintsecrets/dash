'use client';

import { useEffect, useState } from 'react';
import SurahNavigator from '@/components/SurahNavigator';
import TafsirPanel from '@/components/TafsirPanel';
import RelatedRefs from '@/components/RelatedRefs';
import ExportButtons from '@/components/ExportButtons';
import { getAyah } from '@/lib/db';
import { toMarkdown } from '@/lib/export';
import type { QuranAyah } from '@/lib/types';

export default function AyahPage({ params }: { params: { surah: string; ayah: string } }) {
  const surah = Number(params.surah);
  const ayah = Number(params.ayah);
  const [record, setRecord] = useState<QuranAyah | null>(null);

  useEffect(() => {
    getAyah(surah, ayah).then((data) => {
      setRecord(data ?? null);
    });
  }, [surah, ayah]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <SurahNavigator currentSurah={surah} currentAyah={ayah} />
      </div>
      <div className="grid gap-4 lg:col-span-3">
        <article className="card">
          <header className="mb-2 flex items-center gap-2">
            <span className="badge">Qur&apos;an</span>
            <h1 className="text-xl font-semibold">{surah}:{ayah}</h1>
          </header>
          {!record ? (
            <p className="text-slate-400">Load offline data or import sample packs via the Downloads page.</p>
          ) : (
            <div className="grid gap-3">
              <p className="text-2xl" lang="ar" dir="rtl">
                {record.arabic}
              </p>
              <div className="grid gap-2">
                {record.translations.slice(0, 3).map((translation) => (
                  <p key={translation.work_id}>
                    <span className="badge mr-2">{translation.work_id}</span>
                    {translation.text}
                  </p>
                ))}
              </div>
              <ExportButtons
                getData={async () => {
                  const md = toMarkdown({ title: `Q ${surah}:${ayah}`, ayat: [record], tafsir: [], hadith: [] });
                  return { title: `Q-${surah}-${ayah}`, md };
                }}
              />
            </div>
          )}
        </article>
        <TafsirPanel surah={surah} ayah={ayah} />
        <RelatedRefs surah={surah} ayah={ayah} />
      </div>
    </div>
  );
}
