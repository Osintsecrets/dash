import Link from 'next/link';
import type { TopicBundle } from '@/lib/types';

interface TopicCardProps {
  topic: TopicBundle;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`} className="card block space-y-2 transition hover:-translate-y-1 hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{topic.title}</h3>
        {topic.offline_ready ? <span className="badge bg-emerald-500/20 text-emerald-300">Offline</span> : null}
      </div>
      <p className="text-sm text-slate-300">{topic.description}</p>
      {topic.keywords && topic.keywords.length > 0 && (
        <p className="text-xs uppercase tracking-wide text-slate-500">{topic.keywords.join(' · ')}</p>
      )}
    </Link>
  );
}
