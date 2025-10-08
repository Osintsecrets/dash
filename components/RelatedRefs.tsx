'use client';

import { useEffect, useState } from 'react';
import type { HadithItem, TafsirSegment } from '@/lib/types';
import { relatedForAyah } from '@/lib/refs';
import { HadithCard } from './HadithCard';
import { Card } from '@/components/ui';

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
      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Related Tafsīr</h3>
        {taf.length === 0 ? (
          <p className="text-sm text-slate-400">No related tafsīr excerpts found locally.</p>
        ) : (
          <ul className="grid gap-3 text-sm leading-relaxed text-slate-200">
            {taf.map((segment) => (
              <li key={segment.id} className="space-y-1 rounded-2xl border border-white/5 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400">{segment.work_id}</div>
                <p>{segment.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Related Hadith</h3>
        {hadith.length === 0 ? (
          <p className="text-sm text-slate-400">No related hadith found locally.</p>
        ) : (
          <ul className="grid gap-3">
            {hadith.map((item) => (
              <li key={item.id}>
                <HadithCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
