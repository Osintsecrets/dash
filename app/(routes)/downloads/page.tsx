'use client';

import { useState } from 'react';
import { DownloadManagerPanel } from '@/components/DownloadManagerPanel';
import {
  importHadithBookFromJson,
  importSurahFromJson,
  importTafsirWorkFromJson,
  importTopicFromJson
} from '@/lib/loaders';
import { clearIndex } from '@/lib/search';

export default function DownloadsPage() {
  const [log, setLog] = useState<string[]>([]);

  const push = (entry: string) => setLog((prev) => [entry, ...prev]);

  const importAll = async () => {
    try {
      push('Importing Surah 9…');
      await importSurahFromJson('/data/quran/surah-009.json');
      push('Importing Tafsir Ibn Kathīr 9…');
      await importTafsirWorkFromJson('/data/tafsir/ibn_kathir/009.json');
      push('Importing Bukhari Book 67…');
      await importHadithBookFromJson('/data/hadith/bukhari/book-67.json');
      push('Importing topic bundles…');
      await importTopicFromJson('/data/topics/topic-jizya.json');
      await importTopicFromJson('/data/topics/topic-marital-discord.json');
      push('Done.');
      clearIndex();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      push(`Error: ${message}`);
    }
  };

  return (
    <div className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Offline manager</h1>
        <p className="text-sm text-slate-300">
          Queue bundles, verify integrity via SHA-256, and manage storage using an LRU cache. Topic bundles receive priority in
          the queue.
        </p>
        <button type="button" className="btn" onClick={importAll}>
          Import sample data into DB
        </button>
      </header>
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-100">Import log</h2>
        <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-300">{log.join('\n')}</pre>
      </div>
      <DownloadManagerPanel />
    </div>
  );
}
