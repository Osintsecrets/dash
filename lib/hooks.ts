'use client';

import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import {
  createSheet,
  findHadithInCollection,
  getTopicBySlug,
  listSheets,
  listTopicsDB,
  saveSheet,
  getSurah
} from './db';
import type { HadithItem, QuranAyah, Sheet, TopicBundle } from './types';

export function useSurah(surah: number) {
  const [ayahs, setAyahs] = useState<QuranAyah[] | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => getSurah(surah)).subscribe({
      next: (value) => setAyahs(value),
      error: () => setAyahs([])
    });
    return () => subscription.unsubscribe();
  }, [surah]);

  return ayahs;
}

export function useHadith(collection: string, book?: number) {
  const [items, setItems] = useState<HadithItem[] | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => findHadithInCollection(collection, book)).subscribe({
      next: (value) => setItems(value),
      error: () => setItems([])
    });
    return () => subscription.unsubscribe();
  }, [collection, book]);

  return items;
}

export function useTopic(slug: string) {
  const [topic, setTopic] = useState<TopicBundle | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => getTopicBySlug(slug)).subscribe({
      next: (value) => setTopic(value ?? null),
      error: () => setTopic(null)
    });
    return () => subscription.unsubscribe();
  }, [slug]);

  return topic;
}

export function useTopics() {
  const [topics, setTopics] = useState<TopicBundle[] | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => listTopicsDB()).subscribe({
      next: (value) => setTopics(value),
      error: () => setTopics([])
    });
    return () => subscription.unsubscribe();
  }, []);

  return topics;
}

export function useSheets() {
  const [sheets, setSheets] = useState<Sheet[] | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => listSheets()).subscribe({
      next: (value) => setSheets(value),
      error: () => setSheets([])
    });
    return () => subscription.unsubscribe();
  }, []);

  return sheets;
}

export function useCreateSheet() {
  return useCallback(async (title?: string) => createSheet(title), []);
}

export function useSaveSheet() {
  return useCallback(async (sheet: Sheet) => saveSheet(sheet), []);
}
