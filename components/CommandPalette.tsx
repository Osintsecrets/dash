'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MiniSearch, { type SearchResult } from 'minisearch';
import type { CanonRef, HadithItem, QuranAyah, TopicBundle } from '@/lib/types';
import { buildSearchIndex } from '@/lib/search';

interface CommandPaletteProps {
  ayahs: QuranAyah[];
  hadith: HadithItem[];
  topics: TopicBundle[];
}

interface Result {
  id: string;
  title: string;
  type: string;
  ref: CanonRef;
}

const slashCommands = [
  { key: '/q', description: 'Jump to Qur’an ayah (e.g., /q 9:29)' },
  { key: '/h', description: 'Jump to hadith (e.g., /h bukhari 1234)' },
  { key: '/topic', description: 'Open topic bundle (e.g., /topic jizya)' }
];

export function CommandPalette({ ayahs, hadith, topics }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const search = useMemo(() => buildSearchIndex(ayahs, hadith, topics), [ayahs, hadith, topics]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    if (query.startsWith('/')) {
      handleSlash(query);
      return;
    }
    const raw = search.search(query) as SearchResult[];
    setResults(
      raw.slice(0, 8).map((item) => ({
        id: item.id as string,
        title: item.title as string,
        type: (item.type as string) ?? 'text',
        ref: item.ref as CanonRef
      }))
    );
  }, [query, search]);

  function handleSlash(value: string) {
    const parts = value.trim().split(/\s+/);
    const [cmd, ...rest] = parts;
    if (!cmd) return;
    switch (cmd) {
      case '/q': {
        const [loc] = rest;
        if (!loc) return setResults([]);
        const [surah, ayah] = loc.split(':').map((n) => Number.parseInt(n, 10));
        if (!surah || !ayah) return setResults([]);
        setResults([
          {
            id: `q-${surah}-${ayah}`,
            title: `Go to Q ${surah}:${ayah}`,
            type: 'quran',
            ref: { type: 'quran', q: { surah, ayah } }
          }
        ]);
        break;
      }
      case '/h': {
        const [collection, number] = rest;
        const hadithNumber = Number.parseInt(number ?? '', 10);
        if (!collection || Number.isNaN(hadithNumber)) return setResults([]);
        setResults([
          {
            id: `h-${collection}-${hadithNumber}`,
            title: `Open ${collection} ${hadithNumber}`,
            type: 'hadith',
            ref: { type: 'hadith', h: { collection, book: 0, number: hadithNumber } }
          }
        ]);
        break;
      }
      case '/topic': {
        const [slug] = rest;
        if (!slug) return setResults([]);
        const topic = topics.find((t) => t.slug === slug);
        if (!topic) return setResults([]);
        setResults([
          {
            id: topic.id,
            title: `Open topic: ${topic.title}`,
            type: 'topic',
            ref: { type: 'quran', q: topic.quran[0]?.q }
          }
        ]);
        break;
      }
      default:
        setResults([]);
    }
  }

  function handleSelect(result: Result) {
    setOpen(false);
    setQuery('');
    if (result.type === 'topic') {
      const topic = topics.find((t) => t.id === result.id);
      if (topic) router.push(`/topics/${topic.slug}`);
    } else if (result.type === 'quran' && result.ref.q) {
      router.push(`/read?surah=${result.ref.q.surah}&ayah=${result.ref.q.ayah}`);
    } else if (result.type === 'hadith' && result.ref.h) {
      router.push(`/hadith?collection=${result.ref.h.collection}&number=${result.ref.h.number}`);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn w-full justify-between bg-slate-900/70"
        onClick={() => setOpen(true)}
      >
        <span>Search or run a command (Ctrl/Cmd + K)</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 py-20">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-4 shadow-xl">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Qur’an, hadith, or type / for commands"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                className="btn bg-slate-800"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            {!query && (
              <div className="mt-4 grid gap-2 text-sm text-slate-400">
                {slashCommands.map((cmd) => (
                  <div key={cmd.key} className="rounded-xl border border-slate-800 px-3 py-2">
                    <span className="font-mono text-slate-200">{cmd.key}</span> — {cmd.description}
                  </div>
                ))}
              </div>
            )}
            {query && (
              <ul className="mt-4 space-y-2">
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      className="w-full rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-left text-sm hover:bg-slate-700"
                      onClick={() => handleSelect(result)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-100">{result.title}</span>
                        <span className="badge uppercase text-slate-300">{result.type}</span>
                      </div>
                    </button>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-6 text-center text-sm text-slate-500">
                    No matches found.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
