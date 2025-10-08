import { TopicsClient } from '@/components/TopicsClient';
import { loadTopics } from '@/lib/server-data';

export default async function TopicsPage() {
  const topics = await loadTopics();
  return <TopicsClient topics={topics} />;
}
