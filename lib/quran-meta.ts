export type SurahMeta = {
  n: number;
  name: string;
  translit: string;
  ayahs: number;
};

export const SURAHS: SurahMeta[] = [
  { n: 1, name: 'الفاتحة', translit: 'Al-Fātiḥah', ayahs: 7 },
  { n: 2, name: 'البقرة', translit: 'Al-Baqarah', ayahs: 286 },
  { n: 3, name: 'آل عمران', translit: 'Āl ʿImrān', ayahs: 200 },
  { n: 4, name: 'النساء', translit: 'An-Nisā’', ayahs: 176 },
  { n: 5, name: 'المائدة', translit: 'Al-Mā’idah', ayahs: 120 },
  { n: 6, name: 'الأنعام', translit: 'Al-Anʿām', ayahs: 165 },
  { n: 7, name: 'الأعراف', translit: 'Al-Aʿrāf', ayahs: 206 },
  { n: 8, name: 'الأنفال', translit: 'Al-Anfāl', ayahs: 75 },
  { n: 9, name: 'التوبة', translit: 'At-Tawbah', ayahs: 129 },
  { n: 10, name: 'يونس', translit: 'Yūnus', ayahs: 109 }
  // ... extend with remaining surahs as datasets become available
];

export function surahMeta(n: number) {
  return SURAHS.find((item) => item.n === n);
}
