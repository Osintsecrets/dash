'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TopicCard } from '@/components/TopicCard';
import { Card, GlowBorderCard, SearchInput } from '@/components/ui';
import type { TopicBundle } from '@/lib/types';

export function TopicsClient({ topics }: { topics: TopicBundle[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return topics;
    return topics.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(trimmed) ||
        topic.description.toLowerCase().includes(trimmed) ||
        (topic.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(trimmed))
      );
    });
  }, [topics, query]);

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white">Topic bundles</h1>
          <p className="text-sm text-slate-300">
            Bundles present primary passages, authenticated narrations, and recognized tafsīr excerpts. Descriptions remain
            neutral and context-focused.
          </p>
        </div>
        <SearchInput value={query} onChange={setQuery} placeholder="Filter topics" />
      </Card>
      <Card className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Featured topics</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/topics/jizya-covenants/" className="focus:outline-none">
            <GlowBorderCard heading="Jizya & Covenants" lines={["Curated refs", "Open"]} />
          </Link>
          <Link href="/topics/marital-discord-reconciliation/" className="focus:outline-none">
            <GlowBorderCard heading="Marital Discord" lines={["Q 4:34", "Open"]} />
          </Link>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
      {filtered.length === 0 ? <p className="text-sm text-slate-400">No topics match that query.</p> : null}
    </div>
  );
}
