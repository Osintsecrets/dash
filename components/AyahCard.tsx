'use client';

import { useMemo, useState } from 'react';
import { Button, Badge, Card } from '@/components/ui';
import { useToast } from '@/components/ToastProvider';
import type { QuranAyah } from '@/lib/types';

interface AyahCardProps {
  ayah: QuranAyah;
  onAddToSheet?: (ayah: QuranAyah) => void;
}

export function AyahCard({ ayah, onAddToSheet }: AyahCardProps) {
  const { push } = useToast();
  const [activeTranslation, setActiveTranslation] = useState(0);

  const translation = useMemo(() => ayah.translations[activeTranslation], [ayah.translations, activeTranslation]);

  const copyCitation = async () => {
    const cite = `Q ${ayah.surah}:${ayah.ayah} (Arabic); ${translation?.work_id ?? 'translator'}, citation.`;
    try {
      await navigator.clipboard.writeText(cite);
      push({ title: 'Citation copied', description: `Q ${ayah.surah}:${ayah.ayah} saved to clipboard.` });
    } catch (error) {
      push({ title: 'Clipboard unavailable', description: 'Copy failed. Try again or use manual selection.' });
    }
  };

  const handleAddToSheet = () => {
    onAddToSheet?.(ayah);
    push({ title: 'Added to sheet', description: `Ayah ${ayah.surah}:${ayah.ayah} queued for your notes.` });
  };

  return (
    <Card className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-brand-muted">Surah {ayah.surah}</p>
          <h1 className="text-2xl font-semibold text-white">Ayah {ayah.ayah}</h1>
          <p className="text-sm text-slate-400">Translations may vary; consult Arabic source and tafsīr context.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={copyCitation}>
            Copy cite
          </Button>
          {onAddToSheet ? (
            <Button size="sm" variant="ghost" onClick={handleAddToSheet}>
              Add to sheet
            </Button>
          ) : null}
        </div>
      </header>
      <div className="rounded-2xl border border-white/5 bg-brand-surface/70 p-6 text-2xl leading-[2.2] text-white shadow-brand-sm arabic" lang="ar" dir="rtl">
        {ayah.arabic}
      </div>
      <div className="flex flex-wrap gap-2">
        {ayah.translations.map((item, index) => (
          <Button
            key={item.work_id}
            variant={activeTranslation === index ? 'solid' : 'ghost'}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveTranslation(index)}
            aria-pressed={activeTranslation === index}
          >
            {item.work_id}
          </Button>
        ))}
      </div>
      {translation ? (
        <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-5 text-sm leading-relaxed text-slate-100">
          <Badge className="bg-white/10 text-xs uppercase tracking-wide text-brand-muted">{translation.work_id}</Badge>
          <p className="text-base text-slate-100">{translation.text}</p>
        </div>
      ) : null}
      <footer className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
        <Badge variant="default">Qur&apos;an</Badge>
        {translation?.source_url ? (
          <a href={translation.source_url} target="_blank" rel="noreferrer" className="text-brand-accent">
            Source
          </a>
        ) : null}
      </footer>
    </Card>
  );
}
