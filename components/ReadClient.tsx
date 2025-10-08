'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AyahCard } from './AyahCard';
import TafsirPanel from './TafsirPanel';
import { Card, Tabs } from '@/components/ui';
import type { QuranAyah } from '@/lib/types';

const sampleSurahs = [
  { number: 1, name: 'Al-Fātiḥah' },
  { number: 4, name: 'An-Nisāʾ' },
  { number: 9, name: 'At-Tawbah' }
];

interface ReadClientProps {
  ayahs: QuranAyah[];
}

export default function ReadClient({ ayahs }: ReadClientProps) {
  const hasAyahs = ayahs.length > 0;
  const searchParams = useSearchParams();
  const surahParam = Number.parseInt(searchParams.get('surah') ?? '9', 10);
  const ayahParam = Number.parseInt(searchParams.get('ayah') ?? '29', 10);

  const selectedAyah = useMemo(() => {
    if (!hasAyahs) return undefined;
    return ayahs.find((item) => item.surah === surahParam && item.ayah === ayahParam) ?? ayahs[0];
  }, [ayahs, surahParam, ayahParam, hasAyahs]);

  const showTabs = (selectedAyah?.translations.length ?? 0) > 3;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <Card className="sticky top-24 max-h-[70vh] overflow-auto space-y-3">
          <h2 className="text-sm font-semibold text-white">Sūrahs (sample)</h2>
          <ul className="space-y-1 text-sm">
            {sampleSurahs.map((item) => (
              <li key={item.number}>
                <Link
                  href={`/read?surah=${item.number}&ayah=${
                    item.number === selectedAyah?.surah && selectedAyah ? selectedAyah.ayah : 1
                  }`}
                  className={`block rounded-2xl px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 ${
                    item.number === surahParam ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="font-semibold">{item.number}</span> · {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
      <div className="space-y-5">
        {selectedAyah ? (
          <>
            <AyahCard ayah={selectedAyah} />
            {showTabs ? (
              <Tabs
                items={[
                  {
                    id: 'translations',
                    label: 'Translations',
                    content: (
                      <Card className="space-y-3">
                        {selectedAyah.translations.map((translation) => (
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
                    content: <TafsirPanel surah={selectedAyah.surah} ayah={selectedAyah.ayah} />
                  }
                ]}
              />
            ) : (
              <TafsirPanel surah={selectedAyah.surah} ayah={selectedAyah.ayah} />
            )}
            <Card className="space-y-2 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-white">Source metadata</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                {selectedAyah.sources.map((src) => {
                  const attribution = src.attribution ?? src.source_id;
                  return (
                    <li key={`${attribution}-${src.canonical_uri ?? ''}`} className="flex flex-wrap gap-2">
                      <span>{attribution}</span>
                      <span className="text-slate-500">{src.license ?? 'see About'}</span>
                      {src.canonical_uri ? (
                        <a href={src.canonical_uri} className="text-brand-accent" target="_blank" rel="noreferrer">
                          {src.canonical_uri}
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </>
        ) : (
          <Card>Sample data not available for the requested reference.</Card>
        )}
      </div>
    </div>
  );
}
