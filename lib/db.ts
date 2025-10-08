import Dexie, { type EntityTable } from 'dexie';
import type {
  DownloadAsset,
  HadithItem,
  QuranAyah,
  Sheet,
  TafsirSegment,
  TopicBundle
} from './types';

export interface AppDatabase extends Dexie {
  ayahs: EntityTable<QuranAyah, 'id'>;
  tafsir: EntityTable<TafsirSegment, 'id'>;
  hadith: EntityTable<HadithItem, 'id'>;
  topics: EntityTable<TopicBundle, 'id'>;
  sheets: EntityTable<Sheet, 'id'>;
  downloads: EntityTable<DownloadAsset, 'id'>;
}

const db = new Dexie('neutral-scripture-db') as AppDatabase;

db.version(1).stores({
  ayahs: 'id, surah, ayah',
  tafsir: 'id, work_id, surah, ayah',
  hadith: 'id, collection, book, number',
  topics: 'id, slug, title',
  sheets: 'id, created_at',
  downloads: 'id, type, status'
});

export async function seedSampleData() {
  const ayahCount = await db.ayahs.count();
  if (ayahCount > 0) return;

  const res = await fetch('/data/quran/surah-009.json');
  if (!res.ok) return;
  const surahData = await res.json();
  await db.transaction('rw', db.ayahs, db.topics, async () => {
    await db.ayahs.bulkAdd(surahData.ayahs);
    const topicsRes = await fetch('/data/topics/index.json');
    if (topicsRes.ok) {
      const { topics } = await topicsRes.json();
      await db.topics.bulkAdd(topics);
    }
  });
}

export default db;
