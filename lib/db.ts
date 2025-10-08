import Dexie, { Table } from 'dexie';
import type {
  DownloadAsset,
  HadithItem,
  QuranAyah,
  Sheet,
  TafsirSegment,
  TopicBundle
} from './types';

export class SRDB extends Dexie {
  ayahs!: Table<QuranAyah, string>;
  tafsir!: Table<TafsirSegment, string>;
  hadith!: Table<HadithItem, string>;
  topics!: Table<TopicBundle, string>;
  sheets!: Table<Sheet, string>;
  downloads!: Table<DownloadAsset, string>;

  constructor() {
    super('scripture-research');
    this.version(1).stores({
      ayahs: 'id, surah, ayah',
      tafsir: 'id, work_id, [surah+ayah]',
      hadith: 'id, collection, [collection+book+number]'
    });
    this.version(2)
      .stores({
        topics: 'id, slug',
        sheets: 'id, title, updated_at',
        downloads: 'id, status, priority'
      })
      .upgrade(() => {
        // Initial datasets already conform; no migration required yet.
      });
  }
}

export const db = new SRDB();

// ---------- CRUD HELPERS ----------
// Qur'an
export async function upsertAyahs(list: QuranAyah[]) {
  return db.ayahs.bulkPut(list);
}

export async function getAyah(surah: number, ayah: number) {
  return db.ayahs.get(`q-${surah}-${ayah}`);
}

export async function getSurah(surah: number) {
  return db.ayahs.where('surah').equals(surah).sortBy('ayah');
}

// Tafsir
export async function upsertTafsir(list: TafsirSegment[]) {
  return db.tafsir.bulkPut(list);
}

export async function getTafsir(work_id: string, surah: number, ayah: number) {
  return db.tafsir.get(`t-${work_id}-${surah}-${ayah}`);
}

export async function getTafsirByAyah(surah: number, ayah: number) {
  return db.tafsir.where('[surah+ayah]').equals([surah, ayah]).toArray();
}

// Hadith
export async function upsertHadith(list: HadithItem[]) {
  return db.hadith.bulkPut(list);
}

export async function getHadith(collection: string, book: number, number: number) {
  return db.hadith.get(`h-${collection}-${book}-${number}`);
}

export async function findHadithInCollection(collection: string, book?: number) {
  const items = await db.hadith.where('collection').equals(collection).toArray();
  return typeof book === 'number' ? items.filter((item) => item.book === book) : items;
}

// Topics
export async function upsertTopics(list: TopicBundle[]) {
  return db.topics.bulkPut(list);
}

export async function getTopicBySlug(slug: string) {
  return db.topics.where('slug').equals(slug).first();
}

export async function listTopicsDB() {
  return db.topics.toArray();
}

// Sheets
function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export async function createSheet(title = 'Evidence Sheet') {
  const now = new Date().toISOString();
  const sheet: Sheet = {
    id: createId(),
    title,
    created_at: now,
    updated_at: now,
    notes_md: '',
    cites: []
  };
  await db.sheets.put(sheet);
  return sheet;
}

export async function saveSheet(sheet: Sheet) {
  sheet.updated_at = new Date().toISOString();
  await db.sheets.put(sheet);
  return sheet;
}

export async function getSheet(id: string) {
  return db.sheets.get(id);
}

export async function listSheets() {
  return db.sheets.orderBy('updated_at').reverse().toArray();
}

// Downloads
export async function upsertDownloads(list: DownloadAsset[]) {
  return db.downloads.bulkPut(list);
}

export async function listDownloads() {
  return db.downloads.orderBy('priority').toArray();
}
