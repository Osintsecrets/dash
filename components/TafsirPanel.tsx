'use client';

import { useEffect, useState } from 'react';
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
    return <div className="card">Loading tafsīr…</div>;
  }

  if (segments.length === 0) {
    return (
      <div className="card">
        No tafsīr excerpts available locally for {surah}:{ayah}. Download more works or open the online context.
      </div>
    );
  }

  return (
    <section className="card">
      <h3 className="mb-2 text-lg">Tafsīr</h3>
      <ul className="grid gap-4">
        {segments.map((segment) => (
          <li key={segment.id} className="grid gap-2">
            <div className="text-sm text-slate-400">{segment.work_id} on {segment.surah}:{segment.ayah}</div>
            <div className="prose prose-invert max-w-none">
              <p>{segment.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
