'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HadithCard } from './HadithCard';
import { Card, SearchInput } from '@/components/ui';
import type { HadithItem } from '@/lib/types';

interface HadithClientProps {
  items: HadithItem[];
}

export function HadithClient({ items }: HadithClientProps) {
  const [query, setQuery] = useState('');

  if (items.length === 0) {
    return <Card>Sample hadith dataset not loaded.</Card>;
  }

  const searchParams = useSearchParams();
  const collection = searchParams.get('collection') ?? items[0]?.collection ?? 'bukhari';
  const numberParam = Number.parseInt(searchParams.get('number') ?? `${items[0]?.number ?? 0}`, 10);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter((item) => {
      const idLabel = `${item.collection} ${item.book}:${item.number}`.toLowerCase();
      const translationTexts = (item.translations ?? []).map((t) => t.text);
      const text = [item.arabic ?? '', ...translationTexts].join(' ').toLowerCase();
      return idLabel.includes(trimmed) || text.includes(trimmed);
    });
  }, [items, query]);

  const selected = useMemo(() => {
    return items.find((item) => item.collection === collection && item.number === numberParam) ?? items[0];
  }, [collection, numberParam, items]);

  return (
    <div className="space-y-5">
      <Card className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white">Hadith navigator (sample)</h1>
          <p className="text-sm text-slate-300">
            Use the command palette (<span className="font-mono">/h collection number</span>) for quick access. Grading values reflect the cited authority and may differ among scholars.
          </p>
        </div>
        <SearchInput value={query} onChange={setQuery} placeholder="Search narrations" />
      </Card>
      {selected ? <HadithCard item={selected} /> : <Card>Sample hadith unavailable.</Card>}
      <Card className="space-y-3 text-sm text-slate-300">
        <h2 className="text-sm font-semibold text-white">Available narrations (sample)</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                href={`/hadith?collection=${item.collection}&number=${item.number}`}
                className={`block rounded-2xl border border-white/10 px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 ${
                  item.id === selected?.id ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.collection} {item.book}:{item.number}
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? <p className="text-xs text-slate-500">No narrations matched that search.</p> : null}
      </Card>
    </div>
  );
}
