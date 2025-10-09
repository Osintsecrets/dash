import { SURAHS } from '@/lib/quran-meta';
import { AyahClient } from './AyahClient';

export function generateStaticParams() {
  const params: Array<{ surah: string; ayah: string }> = [];
  for (const surah of SURAHS) {
    for (let ayah = 1; ayah <= surah.ayahs; ayah += 1) {
      params.push({ surah: String(surah.n), ayah: String(ayah) });
    }
  }
  return params;
}

export default function AyahPage({ params }: { params: { surah: string; ayah: string } }) {
  return <AyahClient surahParam={params.surah} ayahParam={params.ayah} />;
}
