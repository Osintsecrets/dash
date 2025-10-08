import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AyahCard } from '@/components/AyahCard';
import { HadithCard } from '@/components/HadithCard';
import { loadSampleAyahs, loadSampleHadith, loadTafsir, loadTopics } from '@/lib/server-data';

interface TopicPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const topics = await loadTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topics = await loadTopics();
  const topic = topics.find((item) => item.slug === params.slug);
  if (!topic) return notFound();

  const [ayahs, hadith] = await Promise.all([loadSampleAyahs(), loadSampleHadith()]);

  const ayahCards = topic.quran
    .map((ref) => (ref.q ? ayahs.find((ayah) => ayah.surah === ref.q?.surah && ayah.ayah === ref.q?.ayah) : undefined))
    .filter(Boolean);

  const hadithCards = topic.hadith
    .map((ref) =>
      ref.h ? hadith.find((item) => item.collection === ref.h?.collection && item.number === ref.h?.number) : undefined
    )
    .filter(Boolean);

  const tafsirEntries = await Promise.all(
    topic.tafsir.map(async (ref) => {
      if (!ref.t) return null;
      const segments = await loadTafsir(ref.t.work_id, ref.t.surah);
      return segments.find((segment) => segment.ayah === ref.t?.ayah) ?? null;
    })
  );

  return (
    <div className="space-y-6">
      <header className="card space-y-2">
        <Link href="/topics" className="text-xs text-accent">
          ← All topics
        </Link>
        <h1 className="text-2xl font-semibold text-slate-100">{topic.title}</h1>
        <p className="text-sm text-slate-300">{topic.description}</p>
        <p className="text-xs text-slate-500">Keywords: {topic.keywords.join(', ')}</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Qur’an references</h2>
        {ayahCards.length > 0 ? (
          <div className="space-y-3">
            {ayahCards.map((ayah) => (
              <AyahCard key={ayah!.id} ayah={ayah!} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            No Qur’an samples available in the development dataset.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Hadith references</h2>
        {hadithCards.length > 0 ? (
          <div className="space-y-3">
            {hadithCards.map((item) => (
              <HadithCard key={item!.id} item={item!} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            Hadith text unavailable in the sample dataset; canonical links remain accessible.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Tafsīr excerpts</h2>
        {tafsirEntries.filter(Boolean).length > 0 ? (
          <div className="space-y-3">
            {tafsirEntries.filter(Boolean).map((segment) => (
              <article key={segment!.id} className="card space-y-2 text-sm text-slate-200">
                <p>{segment!.excerpt}</p>
                <p className="text-xs text-slate-400">Source: {segment!.sources.map((src) => src.attribution).join(' | ')}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            Tafsīr excerpts pending for this topic within the development dataset.
          </p>
        )}
      </section>
      {topic.notes && (
        <section className="card text-sm text-slate-200">
          <h2 className="text-lg font-semibold text-slate-100">Context notes</h2>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: topic.notes }} />
        </section>
      )}
    </div>
  );
}
