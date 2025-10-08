'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AyahCard } from './AyahCard';
import { TafsirPanel } from './TafsirPanel';
import type { QuranAyah } from '@/lib/types';

const sampleSurahs = [
  { number: 1, name: 'Al-Fātiḥah' },
  { number: 4, name: 'An-Nisāʾ' },
  { number: 9, name: 'At-Tawbah' }
];

interface ReadClientProps {
  ayahs: QuranAyah[];
}

export function ReadClient({ ayahs }: ReadClientProps) {
  const hasAyahs = ayahs.length > 0;
  const searchParams = useSearchParams();
  const surahParam = Number.parseInt(searchParams.get('surah') ?? '9', 10);
  const ayahParam = Number.parseInt(searchParams.get('ayah') ?? '29', 10);

  const selectedAyah = useMemo(() => {
    if (!hasAyahs) return undefined;
    return ayahs.find((item) => item.surah === surahParam && item.ayah === ayahParam) ?? ayahs[0];
  }, [ayahs, surahParam, ayahParam, hasAyahs]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="card h-fit space-y-2">
        <h2 className="text-sm font-semibold text-slate-200">Sūrahs (sample)</h2>
        <ul className="space-y-1 text-sm">
          {sampleSurahs.map((item) => (
            <li key={item.number}>
              <Link
                href={`/read?surah=${item.number}&ayah=${
                  item.number === selectedAyah?.surah && selectedAyah ? selectedAyah.ayah : 1
                }`}
                className={`block rounded-lg px-3 py-2 transition ${
                  item.number === surahParam ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="font-semibold">{item.number}</span> · {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="space-y-4">
        {selectedAyah ? (
          <>
            <AyahCard ayah={selectedAyah} />
            <TafsirPanel
              works={[
                { work_id: 'ibn_kathir', label: 'Ibn Kathīr' },
                { work_id: 'jalalayn', label: 'Al-Jalālayn' }
              ]}
              surah={selectedAyah.surah}
              ayah={selectedAyah.ayah}
            />
            <section className="card space-y-2 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-slate-100">Source metadata</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                {selectedAyah.sources.map((src) => {
                  const attribution = src.attribution ?? src.source_id;
                  return (
                    <li key={`${attribution}-${src.canonical_uri ?? ''}`}>
                      {attribution} — {src.license ?? 'see About'}{' '}
                      {src.canonical_uri && (
                        <a href={src.canonical_uri} className="underline" target="_blank" rel="noreferrer">
                          {src.canonical_uri}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        ) : (
          <p className="card">Sample data not available for the requested reference.</p>
        )}
      </div>
    </div>
  );
}
