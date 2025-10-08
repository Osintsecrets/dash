import { ReadClient } from '@/components/ReadClient';
import { loadSampleAyahs } from '@/lib/server-data';

export const dynamic = 'force-static';

export default async function ReadPage() {
  const ayahs = await loadSampleAyahs();
  return <ReadClient ayahs={ayahs} />;
}
