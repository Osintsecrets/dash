'use client';

import { useEffect, useState } from 'react';
import { AyahCard } from '@/components/AyahCard';
import { useSurah } from '@/lib/hooks';
import type { QuranAyah } from '@/lib/types';
import { seedDev } from '@/tools/seed-dev';

export default function ReadPage() {
  const ayahs = useSurah(9);
  const [fallback, setFallback] = useState<QuranAyah[] | null>(null);

  useEffect(() => {
    seedDev().catch(() => {
      /* noop */
    });
  }, []);

  useEffect(() => {
    if (!ayahs) return;
    if (ayahs.length > 0) {
      setFallback(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/data/quran/surah-009.json');
        if (!response.ok) return;
        const payload = await response.json();
        if (!cancelled) {
          setFallback(payload.ayahs ?? []);
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
  }, [ayahs]);

  const content = ayahs && ayahs.length > 0 ? ayahs : fallback;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Qur'an — Surah 9</h1>
      {!content && <div className="card">Loading…</div>}
      {content && content.length === 0 && (
        <div className="card text-sm text-slate-300">
          Import Surah 9 via the Downloads page to browse it offline.
        </div>
      )}
      {content?.map((ayah) => (
        <AyahCard key={ayah.id} ayah={ayah} />
      ))}
    </div>
  );
}
