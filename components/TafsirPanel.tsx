'use client';

import { useEffect, useState } from 'react';
import { Card, Skeleton } from '@/components/ui';
import type { TafsirSegment } from '@/lib/types';
import { getTafsirByAyah } from '@/lib/db';

export default function TafsirPanel({ surah, ayah }: { surah: number; ayah: number }) {
  const [segments, setSegments] = useState<TafsirSegment[] | null>(null);

  useEffect(() => {
    getTafsirByAyah(surah, ayah).then((list) => {
      setSegments(list);
    });
  }, [surah, ayah]);

  if (!segments) {
    return (
      <Card className="space-y-3" aria-live="polite">
        <h3 className="text-lg font-semibold text-white">Tafsīr</h3>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-28 w-full" />
      </Card>
    );
  }

  if (segments.length === 0) {
    return (
      <Card>
        No tafsīr excerpts available locally for {surah}:{ayah}. Download more works or open the online context.
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Tafsīr</h3>
      <ul className="grid gap-4">
        {segments.map((segment) => (
          <li key={segment.id} className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {segment.work_id} · {segment.surah}:{segment.ayah}
            </div>
            <p className="text-sm leading-relaxed text-slate-100">{segment.excerpt}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
