import { loadTopics } from '@/lib/server-data';
import type { TopicBundle } from '@/lib/types';
import { TopicClient } from './TopicClient';

interface TopicPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const topics = await loadTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topics = await loadTopics();
  const topic: TopicBundle | null = topics.find((item) => item.slug === params.slug) ?? null;
  return <TopicClient slug={params.slug} initialTopic={topic} />;
}
