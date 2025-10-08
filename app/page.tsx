import { CommandPalette } from '@/components/CommandPalette';
import { TopicCard } from '@/components/TopicCard';
import { loadSampleAyahs, loadSampleHadith, loadTopics } from '@/lib/server-data';

export default async function HomePage() {
  const [topics, ayahs, hadith] = await Promise.all([
    loadTopics(),
    loadSampleAyahs(),
    loadSampleHadith()
  ]);

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-2xl font-semibold text-slate-100">Neutral, research-first mission</h1>
        <p className="text-sm leading-relaxed text-slate-300">
          This platform exposes primary sources, recognized interpretations, and provenance metadata to help researchers prepare
          neutral evidence sheets. Use the command palette for quick access to Qur’an ayāt, hadith narrations, and topic bundles.
        </p>
        <CommandPalette ayahs={ayahs} hadith={hadith} topics={topics} />
      </section>
      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Topic bundles</h2>
          <p className="text-xs text-slate-400">Neutral descriptions, curated references, offline-ready indicators.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
      <section className="card space-y-2 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">Offline status</h2>
        <p>Previously downloaded bundles are available offline with integrity checks (SHA-256) and LRU purging.</p>
        <p>Use the Downloads tab to manage cached surahs, tafsīr excerpts, and hadith collections.</p>
      </section>
    </div>
  );
}
