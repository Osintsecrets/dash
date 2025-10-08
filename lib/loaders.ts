import type { HadithItem, QuranAyah, TafsirSegment, TopicBundle } from './types';
import { upsertAyahs, upsertHadith, upsertTafsir, upsertTopics } from './db';

function toAyahId(surah: number, ayah: number) {
  return `q-${surah}-${ayah}`;
}

export async function importSurahFromJson(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path} (${response.status})`);
  }
  const payload = await response.json();
  const ayahs: QuranAyah[] = (payload.ayahs ?? []).map((item: any) => ({
    id: item.id ?? toAyahId(item.surah, item.ayah),
    surah: item.surah,
    ayah: item.ayah,
    arabic: item.arabic,
    transliteration: item.transliteration,
    translations: item.translations ?? [],
    roots: item.roots ?? [],
    tafsir_refs: item.tafsir_refs ?? [],
    sources: item.sources ?? []
  }));
  await upsertAyahs(ayahs);
  return ayahs.length;
}

export async function importTafsirWorkFromJson(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path} (${response.status})`);
  }
  const payload = await response.json();
  const work_id = payload.work_id as string;
  const surah = payload.surah as number;
  const segments: TafsirSegment[] = (payload.segments ?? []).map((segment: any) => ({
    id: segment.id ?? `t-${work_id}-${surah}-${segment.ayah}`,
    work_id,
    surah,
    ayah: segment.ayah,
    excerpt: segment.excerpt,
    sources: segment.sources ?? []
  }));
  await upsertTafsir(segments);
  return segments.length;
}

export async function importHadithBookFromJson(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path} (${response.status})`);
  }
  const payload = await response.json();
  const collection = payload.collection as string;
  const book = payload.book as number;
  const items: HadithItem[] = (payload.items ?? []).map((item: any) => ({
    id: item.id ?? `h-${collection}-${book}-${item.number}`,
    collection,
    book,
    number: item.number,
    arabic: item.arabic,
    translations: item.translations ?? [],
    grading: item.grading,
    isnad: item.isnad,
    topics: item.topics ?? [],
    sources: item.sources ?? []
  }));
  await upsertHadith(items);
  return items.length;
}

export async function importTopicFromJson(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path} (${response.status})`);
  }
  const payload = (await response.json()) as TopicBundle;
  await upsertTopics([payload]);
  return payload.slug;
}
