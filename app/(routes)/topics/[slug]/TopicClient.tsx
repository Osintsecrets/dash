'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AyahCard } from '@/components/AyahCard';
import { HadithCard } from '@/components/HadithCard';
import { Card } from '@/components/ui';
import { useTopic } from '@/lib/hooks';
import { getAyah, getHadith, getTafsir } from '@/lib/db';
import type { HadithItem, QuranAyah, TafsirSegment, TopicBundle } from '@/lib/types';
import { seedDev } from '@/tools/seed-dev';

interface TopicClientProps {
  slug: string;
  initialTopic: TopicBundle | null;
}

export function TopicClient({ slug, initialTopic }: TopicClientProps) {
  const topicFromDb = useTopic(slug);
  const topic = topicFromDb ?? initialTopic;
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [hadith, setHadith] = useState<HadithItem[]>([]);
  const [tafsir, setTafsir] = useState<TafsirSegment[]>([]);

  useEffect(() => {
    seedDev().catch(() => {
      /* noop */
    });
  }, []);

  useEffect(() => {
    if (!topic) {
      setAyahs([]);
      setHadith([]);
      setTafsir([]);
      return;
    }
    let cancelled = false;

    const load = async () => {
      const verseResults = await Promise.all(
        topic.quran.map(async (ref) => {
          if (!ref.q) return null;
          const { surah, ayah } = ref.q;
          const existing = await getAyah(surah, ayah);
          if (existing) return existing;
          try {
            const response = await fetch(`data/quran/surah-${String(surah).padStart(3, '0')}.json`);
            if (!response.ok) return null;
            const payload = await response.json();
            const match = (payload.ayahs ?? []).find((item: any) => item.ayah === ayah);
            if (!match) return null;
            return {
              id: match.id ?? `q-${surah}-${ayah}`,
              surah,
              ayah,
              arabic: match.arabic ?? '',
              transliteration: match.transliteration,
              translations: match.translations ?? [],
              roots: match.roots ?? [],
              tafsir_refs: match.tafsir_refs ?? [],
              sources: match.sources ?? []
            } satisfies QuranAyah;
          } catch {
            return null;
          }
        })
      );

      const hadithResults = await Promise.all(
        topic.hadith.map(async (ref) => {
          if (!ref.h) return null;
          const { collection, book, number } = ref.h;
          const existing = await getHadith(collection, book, number);
          if (existing) return existing;
          try {
            const response = await fetch(`data/hadith/${collection}/book-${book}.json`);
            if (!response.ok) return null;
            const payload = await response.json();
            const match = (payload.items ?? []).find((item: any) => item.number === number);
            if (!match) return null;
            return {
              id: match.id ?? `h-${collection}-${book}-${number}`,
              collection,
              book,
              number,
              arabic: match.arabic,
              translations: match.translations ?? [],
              grading: match.grading,
              isnad: match.isnad,
              topics: match.topics ?? [],
              sources: match.sources ?? []
            } satisfies HadithItem;
          } catch {
            return null;
          }
        })
      );

      const tafsirResults = await Promise.all(
        topic.tafsir.map(async (ref) => {
          if (!ref.t) return null;
          const { work_id, surah, ayah, segment_id } = ref.t;
          const existing = await getTafsir(work_id, surah, ayah);
          if (existing) return existing;
          try {
            const response = await fetch(`data/tafsir/${work_id}/${String(surah).padStart(3, '0')}.json`);
            if (!response.ok) return null;
            const payload = await response.json();
            const match = (payload.segments ?? []).find((item: any) => {
              if (segment_id) return item.id === segment_id;
              return item.ayah === ayah;
            });
            if (!match) return null;
            return {
              id: match.id ?? `t-${work_id}-${surah}-${ayah}`,
              work_id,
              surah,
              ayah,
              excerpt: match.excerpt ?? '',
              sources: match.sources ?? []
            } satisfies TafsirSegment;
          } catch {
            return null;
          }
        })
      );

      if (!cancelled) {
        setAyahs(verseResults.filter(Boolean) as QuranAyah[]);
        setHadith(hadithResults.filter(Boolean) as HadithItem[]);
        setTafsir(tafsirResults.filter(Boolean) as TafsirSegment[]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [topic]);

  if (!topic) {
    return <Card>Topic not found.</Card>;
  }

  const keywords = topic.keywords?.join(', ');

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <Link href="/topics" className="text-xs text-brand-accent">
          ← All topics
        </Link>
        <h1 className="text-2xl font-semibold text-white">{topic.title}</h1>
        <p className="text-sm text-slate-300">{topic.description}</p>
        {keywords ? <p className="text-xs text-slate-500">Keywords: {keywords}</p> : null}
      </Card>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Qur’an references</h2>
        {ayahs.length > 0 ? (
          <div className="space-y-3">
            {ayahs.map((ayah) => (
              <AyahCard key={ayah.id} ayah={ayah} />
            ))}
          </div>
        ) : (
          <Card className="text-sm text-slate-400">Import this topic’s source Surah via Downloads to view verses offline.</Card>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Hadith references</h2>
        {hadith.length > 0 ? (
          <div className="space-y-3">
            {hadith.map((item) => (
              <HadithCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="text-sm text-slate-400">Hadith text unavailable locally. Use Downloads to import the referenced collection.</Card>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Tafsīr excerpts</h2>
        {tafsir.length > 0 ? (
          <div className="space-y-3">
            {tafsir.map((segment) => (
              <Card key={segment.id} className="space-y-2 text-sm text-slate-200">
                <p>{segment.excerpt}</p>
                {segment.sources.length > 0 && (
                  <p className="text-xs text-slate-400">
                    Source: {segment.sources.map((src) => src.attribution ?? src.source_id).join(' | ')}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-sm text-slate-400">Tafsīr excerpts will appear once the relevant work is imported.</Card>
        )}
      </section>
      {topic.notes && (
        <Card className="text-sm text-slate-200">
          <h2 className="text-lg font-semibold text-slate-100">Context notes</h2>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: topic.notes }} />
        </Card>
      )}
    </div>
  );
}
