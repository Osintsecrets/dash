import Link from 'next/link';
import { Badge, Card } from '@/components/ui';
import type { TopicBundle } from '@/lib/types';

interface TopicCardProps {
  topic: TopicBundle;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70"
    >
      <Card className="group h-full space-y-3 transition hover:-translate-y-1 hover:shadow-brand-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
          {topic.offline_ready ? <Badge variant="success">Offline</Badge> : null}
        </div>
        <p className="text-sm text-slate-300">{topic.description}</p>
        {topic.keywords && topic.keywords.length > 0 ? (
          <p className="text-xs uppercase tracking-wide text-slate-500">{topic.keywords.join(' · ')}</p>
        ) : null}
      </Card>
    </Link>
  );
}
