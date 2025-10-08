import { DownloadManagerPanel } from '@/components/DownloadManagerPanel';

export default function DownloadsPage() {
  return (
    <div className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Offline manager</h1>
        <p className="text-sm text-slate-300">
          Queue bundles, verify integrity via SHA-256, and manage storage using an LRU cache. Topic bundles receive priority in
          the queue.
        </p>
      </header>
      <DownloadManagerPanel />
    </div>
  );
}
