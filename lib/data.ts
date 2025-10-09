import type { DownloadAsset, HadithItem, QuranAyah, TafsirSegment, TopicBundle } from './types';

export async function fetchSurah(surah: number): Promise<QuranAyah[]> {
  const res = await fetch(`data/quran/surah-${String(surah).padStart(3, '0')}.json`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.ayahs as QuranAyah[];
}

export async function fetchTafsir(work: string, surah: number): Promise<TafsirSegment[]> {
  const res = await fetch(`data/tafsir/${work}/${String(surah).padStart(3, '0')}.json`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.segments as TafsirSegment[];
}

export async function fetchHadith(collection: string, book: number): Promise<HadithItem[]> {
  const res = await fetch(`data/hadith/${collection}/book-${book}.json`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as HadithItem[];
}

export async function fetchTopicIndex(): Promise<TopicBundle[]> {
  const res = await fetch('data/topics/index.json');
  if (!res.ok) return [];
  const data = await res.json();
  return data.topics as TopicBundle[];
}

export async function fetchManifest(): Promise<{ assets: DownloadAsset[] }> {
  const res = await fetch('data/manifest.json');
  if (!res.ok) {
    throw new Error(`Failed to load manifest (status ${res.status})`);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.assets)) {
    throw new Error('Manifest payload is malformed.');
  }

  return data as { assets: DownloadAsset[] };
}
