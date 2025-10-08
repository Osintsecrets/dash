import { importHadithBookFromJson, importSurahFromJson, importTafsirWorkFromJson, importTopicFromJson } from '@/lib/loaders';

export async function seedDev() {
  await importSurahFromJson('/data/quran/surah-009.json');
  await importTafsirWorkFromJson('/data/tafsir/ibn_kathir/009.json');
  await importHadithBookFromJson('/data/hadith/bukhari/book-67.json');
  await importTopicFromJson('/data/topics/topic-jizya.json');
  await importTopicFromJson('/data/topics/topic-marital-discord.json');
}
