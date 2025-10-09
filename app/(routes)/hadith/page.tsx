'use client';

import { useEffect, useState } from 'react';
import { Card, UiLoaderDots } from '@/components/ui';
import { HadithClient } from '@/components/HadithClient';
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
        const response = await fetch('data/hadith/bukhari/book-67.json');
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

  if (!content) {
    return (
      <Card className="flex items-center justify-center">
        <UiLoaderDots label="Loading hadith" />
      </Card>
    );
  }

  if (content.length === 0) {
    return (
      <Card className="text-sm text-slate-300">Import Bukhari Book 67 to review it offline.</Card>
    );
  }

  return <HadithClient items={content} />;
}
