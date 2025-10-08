'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { HadithCard } from './HadithCard';
import type { HadithItem } from '@/lib/types';

interface HadithClientProps {
  items: HadithItem[];
}

export function HadithClient({ items }: HadithClientProps) {
  if (items.length === 0) {
    return <p className="card">Sample hadith dataset not loaded.</p>;
  }

  const searchParams = useSearchParams();
  const collection = searchParams.get('collection') ?? items[0]?.collection ?? 'bukhari';
  const numberParam = Number.parseInt(searchParams.get('number') ?? `${items[0]?.number ?? 0}`, 10);

  const selected = useMemo(() => {
    return items.find((item) => item.collection === collection && item.number === numberParam) ?? items[0];
  }, [collection, numberParam, items]);

  return (
    <div className="space-y-5">
      <section className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Hadith navigator (sample)</h1>
        <p className="text-sm text-slate-300">
          Use the command palette (<span className="font-mono">/h collection number</span>) for quick access. Grading values reflect the cited authority and may differ among scholars.
        </p>
      </section>
      {selected ? <HadithCard item={selected} /> : <p className="card">Sample hadith unavailable.</p>}
      <section className="card space-y-2 text-sm text-slate-300">
        <h2 className="text-sm font-semibold text-slate-100">Available narrations (sample)</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/hadith?collection=${item.collection}&number=${item.number}`}
                className={`block rounded-xl border border-slate-800 px-3 py-2 text-sm transition ${
                  item.id === selected?.id ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.collection} {item.book}:{item.number}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
