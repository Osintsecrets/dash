'use client';

import { useEffect, useState } from 'react';
import SurahNavigator from '@/components/SurahNavigator';
import TafsirPanel from '@/components/TafsirPanel';
import RelatedRefs from '@/components/RelatedRefs';
import ExportButtons from '@/components/ExportButtons';
import { AyahCard } from '@/components/AyahCard';
import { Card, Tabs, UiLoaderDots } from '@/components/ui';
import { getAyah } from '@/lib/db';
import { toMarkdown } from '@/lib/export';
import type { QuranAyah } from '@/lib/types';

interface AyahClientProps {
  surahParam: string;
  ayahParam: string;
}

export function AyahClient({ surahParam, ayahParam }: AyahClientProps) {
  const surah = Number(surahParam);
  const ayah = Number(ayahParam);
  const [record, setRecord] = useState<QuranAyah | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAyah(surah, ayah)
      .then((data) => {
        setRecord(data ?? null);
        setLoading(false);
      })
      .catch(() => {
        setRecord(null);
        setLoading(false);
      });
  }, [surah, ayah]);

  const showTabs = (record?.translations.length ?? 0) > 3;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="hidden lg:block">
        <SurahNavigator currentSurah={surah} currentAyah={ayah} />
      </div>
      <div className="space-y-5">
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-muted">Qur&apos;an</p>
              <h1 className="text-xl font-semibold text-white">
                {surah}:{ayah}
              </h1>
            </div>
            {record ? (
              <ExportButtons
                getData={async () => {
                  const md = toMarkdown({ title: `Q ${surah}:${ayah}`, ayat: [record], tafsir: [], hadith: [] });
                  return { title: `Q-${surah}-${ayah}`, md };
                }}
              />
            ) : null}
          </div>
          {loading ? (
            <div className="flex justify-center py-6">
              <UiLoaderDots label="Loading ayah" />
            </div>
          ) : record ? (
            <AyahCard ayah={record} />
          ) : (
            <p className="text-sm text-slate-400">Load offline data or import sample packs via the Downloads page.</p>
          )}
        </Card>
        {record ? (
          showTabs ? (
            <Tabs
              items={[
                {
                  id: 'translations',
                  label: 'Translations',
                  content: (
                    <Card className="space-y-3">
                      {record.translations.map((translation) => (
                        <div key={translation.work_id} className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">{translation.work_id}</p>
                          <p className="text-sm leading-relaxed text-slate-100">{translation.text}</p>
                        </div>
                      ))}
                    </Card>
                  )
                },
                {
                  id: 'tafsir',
                  label: 'Tafsīr',
                  content: <TafsirPanel surah={surah} ayah={ayah} />
                }
              ]}
            />
          ) : (
            <TafsirPanel surah={surah} ayah={ayah} />
          )
        ) : null}
        <RelatedRefs surah={surah} ayah={ayah} />
      </div>
    </div>
  );
}
