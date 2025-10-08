'use client';

import { useEffect, useState } from 'react';
import type { TafsirSegment } from '@/lib/types';
import { fetchTafsir } from '@/lib/data';

interface TafsirPanelProps {
  works: Array<{ work_id: string; label: string }>;
  surah: number;
  ayah: number;
}

export function TafsirPanel({ works, surah, ayah }: TafsirPanelProps) {
  const [active, setActive] = useState(works[0]?.work_id ?? '');
  const [segments, setSegments] = useState<Record<string, TafsirSegment[]>>({});

  useEffect(() => {
    if (!active) return;
    if (segments[active]) return;
    fetchTafsir(active, surah).then((data) => {
      setSegments((prev) => ({ ...prev, [active]: data.filter((segment) => segment.ayah === ayah) }));
    });
  }, [active, surah, ayah, segments]);

  const activeSegments = segments[active] ?? [];

  return (
    <section className="card space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">Tafsīr excerpts</h3>
        <div className="flex flex-wrap gap-2">
          {works.map((work) => (
            <button
              key={work.work_id}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                active === work.work_id ? 'bg-accent text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
              onClick={() => setActive(work.work_id)}
            >
              {work.label}
            </button>
          ))}
        </div>
      </header>
      {activeSegments.length > 0 ? (
        <div className="space-y-3 text-sm leading-relaxed text-slate-200">
          {activeSegments.map((segment) => (
            <article key={segment.id} className="rounded-xl border border-slate-800/70 p-4">
              <p>{segment.excerpt}</p>
              <p className="mt-2 text-xs text-slate-400">
                Source: {segment.sources.map((src) => src.attribution).join(' | ')}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
          Tafsīr excerpt unavailable for this ayah in the selected work within the sample dataset.
        </p>
      )}
    </section>
  );
}
