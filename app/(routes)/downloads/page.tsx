'use client';

import { useState } from 'react';
import DownloadManager from '@/components/DownloadManager';
import { Card, GlowButton, Button } from '@/components/ui';
import { useToast } from '@/components/ToastProvider';
import {
  importHadithBookFromJson,
  importSurahFromJson,
  importTafsirWorkFromJson,
  importTopicFromJson
} from '@/lib/loaders';
import { clearIndex } from '@/lib/search';

export default function DownloadsPage() {
  const [log, setLog] = useState<string[]>([]);
  const { push: toast } = useToast();

  const push = (entry: string) => setLog((prev) => [entry, ...prev]);

  const importAll = async () => {
    try {
      push('Importing Surah 9…');
      await importSurahFromJson('data/quran/surah-009.json');
      push('Importing Tafsir Ibn Kathīr 9…');
      await importTafsirWorkFromJson('data/tafsir/ibn_kathir/009.json');
      push('Importing Bukhari Book 67…');
      await importHadithBookFromJson('data/hadith/bukhari/book-67.json');
      push('Importing topic bundles…');
      await importTopicFromJson('data/topics/topic-jizya.json');
      await importTopicFromJson('data/topics/topic-marital-discord.json');
      push('Done.');
      clearIndex();
      toast({ title: 'Sample data imported', description: 'Surah, hadith, tafsīr, and topics loaded into IndexedDB.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      push(`Error: ${message}`);
      toast({ title: 'Import failed', description: message });
    }
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-3">
        <h1 className="text-lg font-semibold text-white">Offline manager</h1>
        <p className="text-sm text-slate-300">
          Queue bundles, verify integrity via SHA-256, and manage storage using an LRU cache. Topic bundles receive priority in
          the queue.
        </p>
        <GlowButton onClick={importAll}>Import sample data into DB</GlowButton>
      </Card>
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Import log</h2>
          <Button size="sm" variant="ghost" onClick={() => setLog([])}>
            Clear log
          </Button>
        </div>
        <pre className="whitespace-pre-wrap rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-slate-300" aria-live="polite">
          {log.join('\n') || 'No imports yet.'}
        </pre>
      </Card>
      <DownloadManager />
    </div>
  );
}
