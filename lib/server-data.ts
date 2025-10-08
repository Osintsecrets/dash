import { promises as fs } from 'fs';
import path from 'path';
import type { HadithItem, QuranAyah, SourceMeta, TafsirSegment, TopicBundle } from './types';

const dataRoot = path.join(process.cwd(), 'public', 'data');

export async function loadTopics(): Promise<TopicBundle[]> {
  const file = path.join(dataRoot, 'topics', 'index.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw) as { topics: TopicBundle[] };
  return data.topics;
}

export async function loadSampleAyahs(): Promise<QuranAyah[]> {
  try {
    const file = path.join(dataRoot, 'quran', 'surah-009.json');
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw) as { ayahs: QuranAyah[] };
    return data.ayahs;
  } catch (error) {
    return [];
  }
}

export async function loadSampleHadith(): Promise<HadithItem[]> {
  try {
    const file = path.join(dataRoot, 'hadith', 'bukhari', 'book-67.json');
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw) as { items: HadithItem[] };
    return data.items;
  } catch (error) {
    return [];
  }
}

export async function loadTafsir(work: string, surah: number): Promise<TafsirSegment[]> {
  try {
    const file = path.join(dataRoot, 'tafsir', work, `${String(surah).padStart(3, '0')}.json`);
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw) as { segments: TafsirSegment[] };
    return data.segments;
  } catch (error) {
    return [];
  }
}

export async function loadProvenance(): Promise<(SourceMeta & { work?: string; notes?: string })[]> {
  const file = path.join(dataRoot, 'provenance.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw) as { sources: Array<SourceMeta & { work?: string; notes?: string }> };
  return data.sources;
}
