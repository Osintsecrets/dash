'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

function formatBytes(bytes: number): string {
  if (Number.isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DownloadManager() {
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
  };

  const onRunQueue = async () => {
    await run();
    setQueue(getQueue());
  };

  const onPurgeCache = async () => {
    await clearAllCached();
    setQueue(getQueue());
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

  return (
    <section className="card space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Offline downloads</h2>
          <p className="text-sm text-slate-300">Queue assets, verify hashes, and store them in Cache API.</p>
          <p className="text-xs text-slate-400">Storage cap enforced via LRU. Cache namespace: sr-cache-v2.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Cap</span>
          <input
            type="number"
            className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right"
            value={capMb}
            onChange={(event) => onCapChange(Number(event.target.value) * 1024 * 1024)}
            min={10}
          />
          <span>MB</span>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={onEnqueueAll} disabled={!assets.length}>
          Download all from manifest
        </button>
        <button type="button" className="btn" onClick={onRunQueue}>
          Run queue
        </button>
        <button type="button" className="btn" onClick={onPurgeCache}>
          Clear cache
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading manifest…</p>}
      {error && <p className="text-sm text-amber-300">Manifest error: {error}</p>}

      <ul className="divide-y divide-slate-800">
        {queue.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="badge capitalize">{item.status}</span>
              <span className="font-medium">{item.id}</span>
              <span className="text-slate-400">{formatBytes(item.bytes)}</span>
              {item.error && <span className="text-amber-300">{item.error}</span>}
              {item.updatedAt && (
                <span className="ml-auto text-xs text-slate-500">
                  Updated {new Date(item.updatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-slate-800">
              <div className="h-2 bg-sky-400" style={{ width: `${Math.round((item.progress ?? 0) * 100)}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {(item.status === 'paused' || item.status === 'error' || item.status === 'canceled') && (
                <button type="button" className="btn" onClick={() => handleResume(item.id)}>
                  Resume
                </button>
              )}
              {item.status === 'queued' && (
                <button type="button" className="btn" onClick={() => handlePause(item.id)}>
                  Pause
                </button>
              )}
              {(item.status === 'queued' || item.status === 'downloading') && (
                <button type="button" className="btn" onClick={() => handleCancel(item.id)}>
                  Cancel
                </button>
              )}
              {(item.status === 'done' || item.status === 'error' || item.status === 'paused' || item.status === 'canceled') && (
                <button type="button" className="btn" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
        {!queue.length && !loading && (
          <li className="py-4 text-sm text-slate-400">Queue is empty. Load the manifest to add offline bundles.</li>
        )}
      </ul>
    </section>
  );
}
