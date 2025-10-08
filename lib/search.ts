'use client';

import MiniSearch, { type Options, type SearchResult } from 'minisearch';
import { db } from './db';

type DocType = 'quran' | 'tafsir' | 'hadith' | 'topic' | 'nav';

export interface SearchDoc {
  id: string;
  type: DocType;
  title: string;
  text: string;
  meta?: Record<string, unknown>;
}

let mini: MiniSearch<SearchDoc> | null = null;
let built = false;

const options: Options<SearchDoc> = {
  fields: ['title', 'text'],
  storeFields: ['id', 'type', 'title', 'text', 'meta'],
  searchOptions: {
    fuzzy: 0.2,
    prefix: true
  }
};

function ensureMini() {
  if (!mini) {
    mini = new MiniSearch<SearchDoc>(options);
  }
  return mini;
}

export async function buildIndex() {
  if (built) {
    return ensureMini();
  }

  const index = ensureMini();
  const docs: SearchDoc[] = [];

  const ayahs = await db.ayahs.toArray();
  for (const ayah of ayahs) {
    docs.push({
      id: ayah.id,
      type: 'quran',
      title: `Q ${ayah.surah}:${ayah.ayah}`,
      text: [
        ayah.arabic,
        ...(ayah.translations ?? []).map((t) => t.text)
      ]
        .filter(Boolean)
        .join('\n'),
      meta: { surah: ayah.surah, ayah: ayah.ayah }
    });
  }

  const tafsirSegments = await db.tafsir.toArray();
  for (const segment of tafsirSegments) {
    docs.push({
      id: segment.id,
      type: 'tafsir',
      title: `Tafsir ${segment.work_id} on ${segment.surah}:${segment.ayah}`,
      text: segment.excerpt ?? '',
      meta: { work_id: segment.work_id, surah: segment.surah, ayah: segment.ayah }
    });
  }

  const hadithItems = await db.hadith.toArray();
  for (const item of hadithItems) {
    docs.push({
      id: item.id,
      type: 'hadith',
      title: `${item.collection} ${item.book}:${item.number}`,
      text: [
        item.arabic ?? '',
        ...(item.translations ?? []).map((t) => t.text),
        item.isnad ?? ''
      ]
        .filter(Boolean)
        .join('\n'),
      meta: {
        collection: item.collection,
        book: item.book,
        number: item.number,
        grade: item.grading?.value
      }
    });
  }

  const topics = await db.topics.toArray();
  for (const topic of topics) {
    docs.push({
      id: topic.id,
      type: 'topic',
      title: `Topic: ${topic.title}`,
      text: [topic.title, topic.description, (topic.keywords ?? []).join(' ')].join('\n'),
      meta: { slug: topic.slug }
    });
  }

  index.addAll(docs);
  built = true;
  return index;
}

function createSnippet(text: string, query: string) {
  if (!text) return '';
  const needle = query.split(/\s+/)[0]?.toLowerCase();
  if (!needle) return text.slice(0, 160);
  const lower = text.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) {
    return text.slice(0, 160);
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + 120);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export async function search(query: string) {
  const index = await buildIndex();
  const results = index.search(query, { boost: { title: 2 } }) as SearchResult<SearchDoc>[];
  return results.map((result) => ({
    ...result,
    snippet: createSnippet((result as any).text ?? '', query)
  }));
}

export function clearIndex() {
  mini = null;
  built = false;
}
