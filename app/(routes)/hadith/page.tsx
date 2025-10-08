'use client';

import { useEffect, useState } from 'react';
import { HadithCard } from '@/components/HadithCard';
import { useHadith } from '@/lib/hooks';
import type { HadithItem } from '@/lib/types';
import { seedDev } from '@/tools/seed-dev';

export default function HadithPage() {
  const hadith = useHadith('bukhari', 67);
  const [fallback, setFallback] = useState<HadithItem[] | null>(null);

  useEffect(() => {
    seedDev().catch(() => {
      /* noop */
    });
  }, []);

  useEffect(() => {
    if (!hadith) return;
    if (hadith.length > 0) {
      setFallback(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/data/hadith/bukhari/book-67.json');
        if (!response.ok) return;
        const payload = await response.json();
        if (!cancelled) {
          setFallback(payload.items ?? []);
        }
      } catch {
        if (!cancelled) {
          setFallback([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hadith]);

  const content = hadith && hadith.length > 0 ? hadith : fallback;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Hadith — Bukhari Book 67</h1>
      {!content && <div className="card">Loading…</div>}
      {content && content.length === 0 && (
        <div className="card text-sm text-slate-300">Import Bukhari Book 67 to review it offline.</div>
      )}
      {content?.map((item) => (
        <HadithCard key={item.id} item={item} />
      ))}
    </div>
  );
}
