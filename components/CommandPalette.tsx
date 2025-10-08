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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={closePalette}>
      <div className="mx-auto mt-24 w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="card space-y-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search or type / for commands… (Cmd/Ctrl+K)"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <ul className="max-h-80 overflow-auto rounded-xl border border-slate-800 bg-slate-900/60">
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-400">
                Type to search Qur’an ayāt, tafsīr excerpts, hadith, or run /commands.
              </li>
            )}
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left text-sm transition hover:bg-slate-800/80"
                  onClick={() => handlePick(result)}
                >
                  <div className="flex items-center gap-2">
                    <span className="badge uppercase text-slate-300">{result.type}</span>
                    <span className="font-medium text-slate-100">{result.title}</span>
                  </div>
                  {result.snippet && (
                    <p className="text-xs text-slate-400">{result.snippet}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right text-xs text-slate-500">Esc to close</div>
        </div>
      </div>
    </div>
  );
}
