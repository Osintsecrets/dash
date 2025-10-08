'use client';

import type { HadithItem } from '@/lib/types';

interface HadithCardProps {
  item: HadithItem;
}

export function HadithCard({ item }: HadithCardProps) {
  function copyCitation() {
    const cite = `${item.collection} ${item.book}:${item.number} — grading: ${item.grading?.authority ?? 'N/A'} (${item.grading?.value ?? 'unknown'}).`;
    navigator.clipboard.writeText(cite).catch(() => {});
  }

  return (
    <article className="card space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            {item.collection} {item.book}:{item.number}
          </h3>
          <p className="text-xs text-slate-400">Grading reflects cited authority and may differ among scholars.</p>
        </div>
        <div className="flex items-center gap-2">
          {item.grading && (
            <span className="badge bg-slate-800 text-slate-200">
              {item.grading.authority}: {item.grading.value ?? 'unknown'}
            </span>
          )}
          <button type="button" className="btn" onClick={copyCitation}>
            Copy cite
          </button>
        </div>
      </header>
      {item.arabic && (
        <p className="rounded-2xl bg-slate-950/80 p-4 text-lg leading-loose text-slate-100" lang="ar" dir="rtl">
          {item.arabic}
        </p>
      )}
      {item.translations && item.translations.length > 0 ? (
        <div className="space-y-2 text-sm text-slate-200">
          {item.translations.map((translation) => (
            <div key={translation.work_id} className="rounded-xl border border-slate-800/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{translation.work_id}</p>
              <p className="mt-1 leading-relaxed">{translation.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
          English translation unavailable here; follow the canonical link for details.
        </p>
      )}
      {item.sources.length > 0 && (
        <footer className="text-xs text-slate-400">
          Source:{' '}
          {item.sources
            .map((src) => {
              const name = src.attribution ?? src.source_id;
              return src.canonical_uri ? `${name} · ${src.canonical_uri}` : name;
            })
            .join(' | ')}
        </footer>
      )}
    </article>
  );
}
