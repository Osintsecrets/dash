import { db } from './db';
import type { CanonRef, HadithItem, TafsirSegment } from './types';

export async function resolveCanonRef(ref: CanonRef) {
  if (ref.q) {
    const { surah, ayah } = ref.q;
    return db.ayahs.get(`q-${surah}-${ayah}`);
  }
  if (ref.t) {
    const { work_id, surah, ayah, segment_id } = ref.t;
    return db.tafsir.get(segment_id ?? `t-${work_id}-${surah}-${ayah}`);
  }
  if (ref.h) {
    const { collection, book, number } = ref.h;
    return db.hadith.get(`h-${collection}-${book}-${number}`);
  }
  return null;
}

export async function relatedForAyah(
  surah: number,
  ayah: number
): Promise<{ tafsir: TafsirSegment[]; hadith: HadithItem[] }> {
  const tafsir = await db.tafsir.where('[surah+ayah]').equals([surah, ayah]).toArray();
  const hadithAll = await db.hadith.toArray();
  const hadith = hadithAll.filter((item) => (item.topics ?? []).some((topic) => topic.includes(`${surah}:${ayah}`)));
  return { tafsir, hadith };
}
