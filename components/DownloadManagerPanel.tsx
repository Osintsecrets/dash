'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DownloadAsset } from '@/lib/types';
import { fetchManifest } from '@/lib/data';

interface ManifestState {
  assets: DownloadAsset[];
  loading: boolean;
  error: string | null;
}

const initialState: ManifestState = {
  assets: [],
  loading: true,
  error: null,
};

export function DownloadManagerPanel() {
  const [{ assets, loading, error }, setState] = useState<ManifestState>(initialState);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadManifest = useCallback(async () => {
    const data = await fetchManifest();
    return [...data.assets].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.id.localeCompare(b.id);
    });
  }, []);

  const applyManifest = useCallback(
    async (isActive: () => boolean) => {
      try {
        const sortedAssets = await loadManifest();
        if (!isActive()) return;
        setState({ assets: sortedAssets, loading: false, error: null });
      } catch (err) {
        if (!isActive()) return;
        setState({ assets: [], loading: false, error: err instanceof Error ? err.message : 'Unable to load manifest.' });
      }
    },
    [loadManifest],
  );

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    void applyManifest(() => isMountedRef.current);
  }, [applyManifest]);

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    void applyManifest(() => isMountedRef.current);
  }, [applyManifest]);

  const statusMessage = useMemo(() => {
    if (loading) return 'Fetching manifest…';
    if (error) return error;
    if (assets.length === 0) return 'No downloadable assets are listed yet.';
    return `${assets.length} offline asset${assets.length === 1 ? '' : 's'} ready.`;
  }, [assets.length, error, loading]);

  return (
    <section className="space-y-3" aria-busy={loading}>
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Offline downloads</h2>
          <p className="text-xs text-slate-400" aria-live="polite">
            {statusMessage}
          </p>
        </div>
        <span className="badge bg-slate-800 text-slate-300">Queue priority: topic bundles first</span>
      </header>
      {error && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          <p className="font-medium">Unable to retrieve the offline manifest.</p>
          <p className="mt-1 text-amber-100/80">
            Check your connection or try again. Manifest errors may also indicate that cached data is outdated.
          </p>
          <button
            type="button"
            className="btn mt-3 bg-slate-800/80 text-slate-100"
            onClick={refresh}
            aria-label="Retry loading offline manifest"
          >
            Retry
          </button>
        </div>
      )}
      <div className="grid gap-3">
        {loading && (
          <div className="animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-500">
            Loading manifest…
          </div>
        )}
        {!loading &&
          assets.map((asset) => (
            <div key={asset.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">{asset.id}</p>
                <p className="text-xs text-slate-400">
                  {asset.type} • {Math.round(asset.bytes / 1024)} KB • version {asset.version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-slate-800 text-slate-200 capitalize">{asset.status}</span>
              <button
                type="button"
                className="btn bg-slate-800/60 text-slate-200"
                disabled={asset.status === 'downloading' || asset.status === 'queued'}
              >
                {asset.status === 'done' ? 'Re-download' : 'Queue'}
              </button>
            </div>
          </div>
        ))}
        {!loading && !error && assets.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
            Manifest loaded but no downloadable assets are currently listed. Add bundles via the ingestion pipeline to expose
            them here.
          </p>
        )}
      </div>
    </section>
  );
}
