'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCommandPalette, useSearch } from '@/lib/hooks';
import { parseSlashCommand, pathForCommand } from '@/lib/utils';

interface PaletteResult {
  id: string;
  title: string;
  type: string;
  snippet?: string;
  meta?: Record<string, unknown>;
}

const HELP_RESULT: PaletteResult = {
  id: 'cmd-help',
  title: 'Usage: /q <surah>:<ayah> • /h <collection> <number> • /topic <slug>',
  type: 'help'
};

export default function CommandPalette() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const slashCommand = useMemo(() => parseSlashCommand(query), [query]);
  const searchQuery = slashCommand ? '' : query;
  const rawResults = useSearch(searchQuery);

  const slashResults = useMemo(() => {
    if (!slashCommand) return null;
    const path = pathForCommand(slashCommand.cmd, slashCommand.args);
    if (path) {
      return [
        {
          id: `nav-${slashCommand.cmd}-${slashCommand.args.join('-')}`,
          title: `Go: ${query}`,
          type: 'nav',
          meta: { path }
        }
      ] satisfies PaletteResult[];
    }
    return [HELP_RESULT];
  }, [slashCommand, query]);

  const results: PaletteResult[] = useMemo(() => {
    if (slashResults) return slashResults;
    if (!searchQuery) return [];
    return (rawResults ?? []).slice(0, 12).map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      snippet: item.snippet,
      meta: item.meta
    }));
  }, [rawResults, slashResults, searchQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, slashResults]);

  function closePalette() {
    setOpen(false);
  }

  function handlePick(result: PaletteResult) {
    closePalette();
    if (result.type === 'nav' && result.meta?.path) {
      router.push(String(result.meta.path));
      return;
    }

    switch (result.type) {
      case 'quran': {
        const surah = Number(result.meta?.surah ?? result.meta?.q?.surah ?? 0);
        const ayah = Number(result.meta?.ayah ?? result.meta?.q?.ayah ?? 0);
        if (surah && ayah) {
          router.push(`/read?surah=${surah}&ayah=${ayah}`);
        } else {
          router.push('/read');
        }
        break;
      }
      case 'tafsir': {
        const surah = Number(result.meta?.surah ?? 0);
        const ayah = Number(result.meta?.ayah ?? 0);
        router.push(surah && ayah ? `/read?surah=${surah}&ayah=${ayah}` : '/read');
        break;
      }
      case 'hadith': {
        const collection = result.meta?.collection as string | undefined;
        const number = result.meta?.number as number | undefined;
        const book = result.meta?.book as number | undefined;
        if (collection && typeof number === 'number') {
          const params = new URLSearchParams({ collection, number: String(number) });
          if (typeof book === 'number') params.set('book', String(book));
          router.push(`/hadith?${params.toString()}`);
        } else {
          router.push('/hadith');
        }
        break;
      }
      case 'topic': {
        const slug = result.meta?.slug as string | undefined;
        router.push(slug ? `/topics/${slug}` : '/topics');
        break;
      }
      default:
        break;
    }
  }

  if (!open) return null;

  const formatMeta = (result: PaletteResult) => {
    switch (result.type) {
      case 'quran': {
        const surah = result.meta?.surah ?? result.meta?.q?.surah;
        const ayah = result.meta?.ayah ?? result.meta?.q?.ayah;
        return surah && ayah ? `${surah}:${ayah}` : undefined;
      }
      case 'hadith': {
        const collection = result.meta?.collection;
        const book = result.meta?.book;
        const number = result.meta?.number;
        if (collection && number) {
          return `${collection}${book ? ` ${book}` : ''}:${number}`;
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter') {
      const current = results[activeIndex];
      if (current) {
        handlePick(current);
      }
    } else if (event.key === 'Escape') {
      closePalette();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={closePalette}>
      <div className="mx-auto mt-24 w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="rounded-3xl border border-white/10 bg-brand-surface/95 p-4 shadow-brand-md">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or type / for commands… (Cmd/Ctrl+K)"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70"
          />
          <ul
            className="mt-3 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-brand-card/80"
            role="listbox"
            aria-activedescendant={results[activeIndex]?.id}
          >
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-400">
                Type to search Qur’an ayāt, tafsīr excerpts, hadith, or run /commands.
              </li>
            )}
            {results.map((result, index) => (
              <li key={result.id} id={result.id} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  className={`flex w-full flex-col gap-1 rounded-2xl px-4 py-3 text-left text-sm transition ${
                    index === activeIndex ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-200'
                  }`}
                  onClick={() => handlePick(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                      {result.type}
                    </span>
                    <span className="font-medium text-white">{result.title}</span>
                    {formatMeta(result) ? <span className="text-xs text-brand-muted">{formatMeta(result)}</span> : null}
                  </div>
                  {result.snippet ? <p className="text-xs text-slate-400">{result.snippet}</p> : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Use ↑ ↓ to navigate · Enter to open</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
