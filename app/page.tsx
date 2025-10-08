import Link from 'next/link';
import { TopicCard } from '@/components/TopicCard';
import { GlowButton, Card } from '@/components/ui';
import { loadTopics } from '@/lib/server-data';

export default async function HomePage() {
  const topics = await loadTopics();

  return (
    <div className="space-y-8">
      <Card className="grid gap-6 bg-gradient-to-br from-brand-surface/80 via-brand-card/80 to-brand-surface/80 p-8 shadow-brand-md lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">Research-first workspace</p>
          <h1 className="text-3xl font-semibold text-white">Primary texts, provenance, and context in one command palette.</h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Neutral Scripture Research helps you investigate Qur’an ayāt, hadith narrations, and tafsīr commentary with
            offline-ready bundles and transparent metadata. Navigate quickly with Cmd/Ctrl + K and build evidence sheets from
            source material.
          </p>
          <div className="flex flex-wrap gap-3">
            <GlowButton asChild>
              <Link href="/read">Start reading</Link>
            </GlowButton>
            <GlowButton asChild>
              <Link href="/hadith">Explore hadith</Link>
            </GlowButton>
            <GlowButton asChild>
              <Link href="/topics">Browse topics</Link>
            </GlowButton>
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-6 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-white">Why neutral?</h2>
          <p>
            We prioritize primary documents, cite recognized interpretations, and expose provenance so you can verify context.
            Offline bundles include integrity checks and respect licensing.
          </p>
          <p>
            Accessibility matters: Arabic text renders with dedicated typefaces, focus states are visible, and the layout is tuned
            for side-by-side comparison work.
          </p>
        </div>
      </Card>
      <section className="space-y-3">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white">Topic bundles</h2>
          <p className="text-xs text-slate-400">Curated references, offline indicators, neutral descriptions.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
      <Card className="space-y-2 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">Offline status</h2>
        <p>Downloaded bundles live in the browser cache with SHA-256 verification and smart purging.</p>
        <p>Use Downloads to audit queued assets, pause/resume, and adjust storage caps.</p>
      </Card>
    </div>
  );
}
