'use client';

import { useEffect, useState } from 'react';
import type { DownloadAsset } from '@/lib/types';
import { fetchManifest } from '@/lib/data';

export function DownloadManagerPanel() {
  const [assets, setAssets] = useState<DownloadAsset[]>([]);

  useEffect(() => {
    fetchManifest().then((data) => setAssets(data.assets));
  }, []);

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Offline downloads</h2>
        <span className="badge bg-slate-800 text-slate-300">Queue priority: topic bundles first</span>
      </header>
      <div className="grid gap-3">
        {assets.map((asset) => (
          <div key={asset.id} className="card flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">{asset.id}</p>
              <p className="text-xs text-slate-400">
                {asset.type} • {Math.round(asset.bytes / 1024)} KB • version {asset.version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-slate-800 text-slate-200">{asset.status}</span>
              <button type="button" className="btn bg-slate-800/60">Queue</button>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
            Manifest not loaded yet. Offline data becomes available after fetching the manifest.
          </p>
        )}
      </div>
    </section>
  );
}
