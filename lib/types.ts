export type TextType = 'quran' | 'tafsir' | 'hadith';

export interface CanonRef {
  type: TextType;
  q?: { surah: number; ayah: number };
  h?: { collection: string; book: number; number: number };
  t?: { work_id: string; surah: number; ayah: number; segment_id?: string };
}

export interface SourceMeta {
  source_id: string;
  canonical_uri?: string;
  license?: string;
  attribution: string;
  retrieved_at?: string;
}

export interface QuranAyah {
  id: string;
  surah: number;
  ayah: number;
  arabic: string;
  transliteration?: string;
  translations: Array<{ work_id: string; lang: string; text: string }>;
  roots?: string[];
  tafsir_refs?: string[];
  sources: SourceMeta[];
}

export interface TafsirSegment {
  id: string;
  work_id: string;
  surah: number;
  ayah: number;
  excerpt: string;
  sources: SourceMeta[];
}

export interface HadithItem {
  id: string;
  collection: string;
  book: number;
  number: number;
  arabic?: string;
  translations?: Array<{ work_id: string; lang: string; text: string }>;
  grading?: { authority?: string; value?: 'sahih' | 'hasan' | 'daif' | 'unknown' };
  isnad?: string;
  topics?: string[];
  sources: SourceMeta[];
}

export interface TopicBundle {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  quran: CanonRef[];
  hadith: CanonRef[];
  tafsir: CanonRef[];
  notes?: string;
  offline_ready?: boolean;
}

export interface Sheet {
  id: string;
  title: string;
  created_at: string;
  notes_md: string;
  cites: Array<{ ref: CanonRef; quote?: string; my_note?: string }>;
}

export interface DownloadAsset {
  id: string;
  type: 'quran' | 'tafsir' | 'hadith' | 'audio' | 'index';
  version: string;
  bytes: number;
  sha256: string;
  status: 'idle' | 'queued' | 'downloading' | 'done' | 'error';
  priority: number;
}
