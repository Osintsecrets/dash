'use client';

import { useState } from 'react';
import type { QuranAyah } from '@/lib/types';

interface AyahCardProps {
  ayah: QuranAyah;
  onAddToSheet?: (ayah: QuranAyah) => void;
}

export function AyahCard({ ayah, onAddToSheet }: AyahCardProps) {
  const [activeTranslation, setActiveTranslation] = useState(0);

  function copyCitation() {
    const translation = ayah.translations[activeTranslation];
    const cite = `Q ${ayah.surah}:${ayah.ayah} (Arabic); ${translation?.work_id ?? 'translator'}, citation.`;
    navigator.clipboard.writeText(cite).catch(() => {});
  }

  return (
    <article className="card space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Q {ayah.surah}:{ayah.ayah}</p>
          <p className="text-sm text-slate-400">Translations may vary; consult Arabic and tafsīr for context.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn" onClick={copyCitation}>
            Copy cite
          </button>
          {onAddToSheet && (
            <button type="button" className="btn" onClick={() => onAddToSheet(ayah)}>
              Add to sheet
            </button>
          )}
        </div>
      </header>
      <p className="rounded-2xl bg-slate-950/80 p-4 text-xl leading-loose text-slate-100" lang="ar" dir="rtl">
        {ayah.arabic}
      </p>
      <div className="flex flex-wrap gap-2">
        {ayah.translations.map((translation, index) => (
          <button
            key={translation.work_id}
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              activeTranslation === index ? 'bg-accent text-slate-900' : 'bg-slate-800 text-slate-300'
            }`}
            onClick={() => setActiveTranslation(index)}
          >
            {translation.work_id}
          </button>
        ))}
      </div>
      {ayah.translations[activeTranslation] && (
        <p className="rounded-2xl bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-200">
          {ayah.translations[activeTranslation].text}
        </p>
      )}
    </article>
  );
}
