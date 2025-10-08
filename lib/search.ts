import MiniSearch, { type Options } from 'minisearch';
import type { CanonRef, HadithItem, QuranAyah, TopicBundle } from './types';

export interface SearchDocument {
  id: string;
  type: 'quran' | 'hadith' | 'topic';
  title: string;
  text: string;
  lang?: string;
  ref: CanonRef;
}

export function buildSearchIndex(
  ayahs: QuranAyah[],
  hadith: HadithItem[],
  topics: TopicBundle[]
) {
  const options: Options<SearchDocument> = {
    fields: ['title', 'text'],
    storeFields: ['type', 'title', 'text', 'ref'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2
    }
  };
  const miniSearch = new MiniSearch<SearchDocument>(options);

  const docs: SearchDocument[] = [];

  for (const ayah of ayahs) {
    docs.push({
      id: ayah.id,
      type: 'quran',
      title: `Q ${ayah.surah}:${ayah.ayah}`,
      text: [ayah.arabic, ...ayah.translations.map((t) => t.text)].join(' \n '),
      ref: { type: 'quran', q: { surah: ayah.surah, ayah: ayah.ayah } }
    });
  }

  for (const h of hadith) {
    docs.push({
      id: h.id,
      type: 'hadith',
      title: `${h.collection} ${h.book}:${h.number}`,
      text: [h.arabic ?? '', ...(h.translations?.map((t) => t.text) ?? [])].join(' \n '),
      ref: { type: 'hadith', h: { collection: h.collection, book: h.book, number: h.number } }
    });
  }

  for (const topic of topics) {
    docs.push({
      id: topic.id,
      type: 'topic',
      title: topic.title,
      text: [topic.description, topic.notes ?? '', topic.keywords.join(' ')].join(' \n '),
      ref: { type: 'quran', q: topic.quran[0]?.q }
    });
  }

  miniSearch.addAll(docs);
  return miniSearch;
}
