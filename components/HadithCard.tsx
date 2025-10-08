'use client';

import { Badge, Button, Card } from '@/components/ui';
import { useToast } from '@/components/ToastProvider';
import type { HadithItem } from '@/lib/types';

interface HadithCardProps {
  item: HadithItem;
}

export function HadithCard({ item }: HadithCardProps) {
  const { push } = useToast();

  const copyCitation = async () => {
    const cite = `${item.collection} ${item.book}:${item.number} — grading: ${item.grading?.authority ?? 'N/A'} (${item.grading?.value ?? 'unknown'}).`;
    try {
      await navigator.clipboard.writeText(cite);
      push({ title: 'Citation copied', description: `${item.collection} ${item.book}:${item.number}` });
    } catch (error) {
      push({ title: 'Clipboard unavailable', description: 'Copy failed. Try again or use manual selection.' });
    }
  };

  return (
    <Card className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">
            {item.collection} {item.book}:{item.number}
          </h3>
          <p className="text-xs text-slate-400">Grading reflects cited authority and may differ among scholars.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.grading ? (
            <Badge variant="default">
              {item.grading.authority}: {item.grading.value ?? 'unknown'}
            </Badge>
          ) : null}
          <Button size="sm" variant="outline" onClick={copyCitation}>
            Copy cite
          </Button>
        </div>
      </header>
      {item.arabic ? (
        <div className="rounded-2xl border border-white/5 bg-brand-surface/70 p-5 text-lg leading-loose text-white arabic" lang="ar" dir="rtl">
          {item.arabic}
        </div>
      ) : null}
      {item.translations && item.translations.length > 0 ? (
        <div className="space-y-3 text-sm text-slate-200">
          {item.translations.map((translation) => (
            <div key={translation.work_id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{translation.work_id}</p>
              <p className="mt-1 leading-relaxed text-slate-100">{translation.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
          English translation unavailable here; follow the canonical link for details.
        </p>
      )}
      {item.sources.length > 0 ? (
        <footer className="text-xs text-slate-400">
          Source:{' '}
          {item.sources
            .map((src) => {
              const name = src.attribution ?? src.source_id;
              return src.canonical_uri ? `${name} · ${src.canonical_uri}` : name;
            })
            .join(' | ')}
        </footer>
      ) : null}
    </Card>
  );
}
