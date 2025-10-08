import { TopicCard } from '@/components/TopicCard';
import { loadTopics } from '@/lib/server-data';

export default async function TopicsPage() {
  const topics = await loadTopics();
  return (
    <div className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Topic bundles</h1>
        <p className="text-sm text-slate-300">
          Bundles present primary passages, authenticated narrations, and recognized tafsīr excerpts. Descriptions remain
          neutral and context-focused.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
