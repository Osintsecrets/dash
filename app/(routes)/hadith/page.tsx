import { HadithClient } from '@/components/HadithClient';
import { loadSampleHadith } from '@/lib/server-data';

export const dynamic = 'force-static';

export default async function HadithPage() {
  const items = await loadSampleHadith();
  return <HadithClient items={items} />;
}
