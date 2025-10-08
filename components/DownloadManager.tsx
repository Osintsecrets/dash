'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Card, GlowButton, Input, LoaderGoo, UiLoaderDots } from '@/components/ui';
import type { Asset, DataManifest } from '@/lib/manifest';
import { getDataManifest } from '@/lib/manifest';
import {
  cancel,
  clearAllCached,
  enqueue,
  getCapBytes,
  getQueue,
  run,
  pause,
  remove,
  resume,
  setCapBytes,
  enforceCap,
  type QItem,
} from '@/lib/downloads';
import { clearIndex } from '@/lib/search';
import { useToast } from '@/components/ToastProvider';

function formatBytes(bytes: number): string {
  if (Number.isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DownloadManager() {
  const { push } = useToast();
  const [manifest, setManifest] = useState<DataManifest | null>(null);
  const [queue, setQueue] = useState<QItem[]>(() => getQueue());
  const [capBytes, setCap] = useState(() => getCapBytes());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastIndexResetRef = useRef<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void getDataManifest()
      .then((data) => {
        if (!active) return;
        setManifest(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load manifest');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQueue(getQueue());
    }, 400);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const newestDone = queue
      .filter((item) => item.status === 'done' && item.updatedAt)
      .reduce((latest, item) => Math.max(latest, item.updatedAt ?? 0), 0);
    if (newestDone && newestDone > lastIndexResetRef.current) {
      clearIndex();
      lastIndexResetRef.current = newestDone;
    }
  }, [queue]);

  const assets = useMemo<Asset[]>(() => manifest?.assets ?? [], [manifest]);

  const onEnqueueAll = async () => {
    if (!assets.length) return;
    enqueue(assets.map((asset) => ({ id: asset.id, path: asset.path, bytes: asset.bytes, sha256: asset.sha256 })));
    setQueue(getQueue());
    await run();
    push({ title: 'Download queue started', description: `${assets.length} assets enqueued.` });
  };

  const onRunQueue = async () => {
    await run();
    setQueue(getQueue());
    push({ title: 'Queue running', description: 'Fetching offline bundles.' });
  };

  const onPurgeCache = async () => {
    await clearAllCached();
    setQueue(getQueue());
    push({ title: 'Cache cleared', description: 'All offline bundles removed.' });
  };

  const onCapChange = async (value: number) => {
    const next = Number.isFinite(value) ? value : capBytes;
    setCap(next);
    setCapBytes(next);
    await enforceCap();
    setQueue(getQueue());
  };

  const handlePause = (id: string) => {
    pause(id);
    setQueue(getQueue());
  };

  const handleResume = (id: string) => {
    resume(id);
    setQueue(getQueue());
  };

  const handleCancel = (id: string) => {
    cancel(id);
    setQueue(getQueue());
  };

  const onRemove = (id: string) => {
    remove(id);
    setQueue(getQueue());
  };

  const capMb = Math.floor(capBytes / 1024 / 1024);
  const isRunning = queue.some((item) => item.status === 'downloading');

  return (
    <Card className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Offline downloads</h2>
          <p className="text-sm text-slate-300">Queue assets, verify hashes, and store them in Cache API.</p>
          <p className="text-xs text-slate-500">Storage cap enforced via LRU. Cache namespace: sr-cache-v2.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <span>Cap</span>
          <Input
            type="number"
            className="w-24 text-right"
            value={capMb}
            onChange={(event) => onCapChange(Number(event.target.value) * 1024 * 1024)}
            min={10}
            aria-label="Offline storage cap in megabytes"
          />
          <span>MB</span>
        </label>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <GlowButton onClick={onEnqueueAll} disabled={!assets.length}>
          Download all from manifest
        </GlowButton>
        <GlowButton onClick={onRunQueue}>
          Run queue
        </GlowButton>
        <Button variant="outline" onClick={onPurgeCache}>
          Clear cache
        </Button>
      </div>

      {loading ? <UiLoaderDots label="Loading manifest" /> : null}
      {error ? <p className="text-sm text-amber-300">Manifest error: {error}</p> : null}
      {isRunning ? <LoaderGoo label="Fetching bundles" /> : null}

      <ul className="divide-y divide-white/5">
        {queue.map((item) => {
          const progress = Math.round((item.progress ?? 0) * 100);
          return (
            <li key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge className="capitalize">{item.status}</Badge>
                <span className="font-medium text-white">{item.id}</span>
                <span className="text-slate-400">{formatBytes(item.bytes)}</span>
                {item.error ? <span className="text-amber-300">{item.error}</span> : null}
                {item.updatedAt ? (
                  <span className="ml-auto text-xs text-slate-500">Updated {new Date(item.updatedAt).toLocaleTimeString()}</span>
                ) : null}
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-2 bg-gradient-to-r from-brand-accent to-brand-accent2" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {item.status === 'paused' || item.status === 'error' || item.status === 'canceled' ? (
                  <Button size="sm" onClick={() => handleResume(item.id)}>
                    Resume
                  </Button>
                ) : null}
                {item.status === 'queued' ? (
                  <Button size="sm" variant="outline" onClick={() => handlePause(item.id)}>
                    Pause
                  </Button>
                ) : null}
                {item.status === 'queued' || item.status === 'downloading' ? (
                  <Button size="sm" variant="outline" onClick={() => handleCancel(item.id)}>
                    Cancel
                  </Button>
                ) : null}
                {item.status === 'done' || item.status === 'error' || item.status === 'paused' || item.status === 'canceled' ? (
                  <Button size="sm" variant="ghost" onClick={() => onRemove(item.id)}>
                    Remove
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
        {!queue.length && !loading ? (
          <li className="py-4 text-sm text-slate-400">Queue is empty. Load the manifest to add offline bundles.</li>
        ) : null}
      </ul>
    </Card>
  );
}
