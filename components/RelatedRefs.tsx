'use client';

import { useEffect, useState } from 'react';
import type { HadithItem, TafsirSegment } from '@/lib/types';
import { relatedForAyah } from '@/lib/refs';
import { HadithCard } from './HadithCard';

export default function RelatedRefs({ surah, ayah }: { surah: number; ayah: number }) {
  const [taf, setTaf] = useState<TafsirSegment[]>([]);
  const [hadith, setHadith] = useState<HadithItem[]>([]);

  useEffect(() => {
    relatedForAyah(surah, ayah).then((data) => {
      setTaf(data.tafsir);
      setHadith(data.hadith);
    });
  }, [surah, ayah]);

  return (
    <div className="grid gap-4">
      <div className="card">
        <h3 className="mb-2 text-lg">Related Tafsīr</h3>
        {taf.length === 0 ? (
          <p className="text-slate-400">No related tafsīr excerpts found locally.</p>
        ) : (
          <ul className="grid gap-2 text-sm leading-relaxed">
            {taf.map((segment) => (
              <li key={segment.id}>
                <div className="text-xs uppercase tracking-wide text-slate-400">{segment.work_id}</div>
                <p>{segment.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card">
        <h3 className="mb-2 text-lg">Related Hadith</h3>
        {hadith.length === 0 ? (
          <p className="text-slate-400">No related hadith found locally.</p>
        ) : (
          <ul className="grid gap-3">
            {hadith.map((item) => (
              <li key={item.id}>
                <HadithCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
