import type { SourceMeta } from '@/lib/types';

interface ProvenanceListProps {
  sources: Array<SourceMeta & { work?: string; notes?: string }>;
}

export function ProvenanceList({ sources }: ProvenanceListProps) {
  return (
    <dl className="grid gap-4 text-sm text-slate-200">
      {sources.map((source) => (
        <div key={`${source.source_id}-${source.canonical_uri ?? ''}`} className="rounded-xl border border-slate-800/70 p-4">
          <dt className="font-semibold text-slate-100">{source.work ?? source.attribution ?? source.source_id}</dt>
          <dd className="mt-2 space-y-1 text-slate-300">
            <p>Attribution: {source.attribution ?? '—'}</p>
            {source.canonical_uri && (
              <p>
                Canonical URL:{' '}
                <a href={source.canonical_uri} className="underline" target="_blank" rel="noreferrer">
                  {source.canonical_uri}
                </a>
              </p>
            )}
            {source.license && <p>License: {source.license}</p>}
            {source.notes && <p className="text-xs text-slate-400">{source.notes}</p>}
            {source.retrieved_at && <p className="text-xs text-slate-500">Retrieved: {source.retrieved_at}</p>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
