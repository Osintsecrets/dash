export type TextType = 'quran' | 'tafsir' | 'hadith';

export interface SourceMeta {
  source_id: 'quran.com' | 'sunnah.com' | 'local';
  canonical_uri?: string;
  license?: string;
  attribution?: string;
  retrieved_at?: string;
}

export interface QuranTranslation {
  work_id: string;
  lang: string;
  text: string;
  source_url?: string;
}

export interface QuranAyah {
  id: string;
  surah: number;
  ayah: number;
  arabic: string;
  transliteration?: string;
  translations: QuranTranslation[];
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

export type HadithGradeValue = 'sahih' | 'hasan' | 'daif' | 'unknown';

export interface HadithItem {
  id: string;
  collection: string;
  book: number;
  number: number;
  arabic?: string;
  translations?: Array<{ work_id: string; lang: string; text: string }>;
  grading?: { authority?: string; value?: HadithGradeValue };
  isnad?: string;
  topics?: string[];
  sources: SourceMeta[];
}

export interface CanonRef {
  type: TextType;
  q?: { surah: number; ayah: number };
  h?: { collection: string; book: number; number: number };
  t?: { work_id: string; surah: number; ayah: number; segment_id?: string };
}

export interface TopicBundle {
  id: string;
  slug: string;
  title: string;
  description: string;
  quran: CanonRef[];
  hadith: CanonRef[];
  tafsir: CanonRef[];
  notes?: string;
  keywords?: string[];
  offline_ready?: boolean;
}

export interface SheetCite {
  ref: CanonRef;
  quote?: string;
  my_note?: string;
}

export interface Sheet {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  notes_md: string;
  cites: SheetCite[];
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
