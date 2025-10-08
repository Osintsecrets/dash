'use client';

import { useMemo, useState } from 'react';
import type { Sheet } from '@/lib/types';

interface SheetEditorProps {
  initialSheet?: Sheet;
}

export function SheetEditor({ initialSheet }: SheetEditorProps) {
  const [sheet, setSheet] = useState<Sheet>(
    initialSheet ?? {
      id: 'local-draft',
      title: 'Untitled evidence sheet',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes_md: '',
      cites: []
    }
  );

  const markdown = useMemo(() => {
    return `---\ntitle: ${sheet.title}\ncreated_at: ${sheet.created_at}\nrefs: [${sheet.cites
      .map((cite) => JSON.stringify(cite.ref))
      .join(', ')}]\n---\n\n${sheet.notes_md}`;
  }, [sheet]);

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheet.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
          <input
            value={sheet.title}
            onChange={(event) => setSheet((prev) => ({ ...prev, title: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes (Markdown)</label>
          <textarea
            value={sheet.notes_md}
            onChange={(event) => setSheet((prev) => ({ ...prev, notes_md: event.target.value }))}
            rows={10}
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={downloadMarkdown}>
            Export Markdown
          </button>
          <button type="button" className="btn bg-slate-800/70" onClick={() => window.print()}>
            Print / Save PDF
          </button>
        </div>
      </div>
      <section className="card space-y-2">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">Citations</h3>
          <p className="text-xs text-slate-400">Add texts via Quick-Draw actions throughout the app.</p>
        </header>
        {sheet.cites.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            No citations yet. Use “Add to sheet” buttons on ayāt or hadith to build your evidence sheet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-200">
            {sheet.cites.map((cite, index) => (
              <li key={index} className="rounded-xl border border-slate-800/70 p-3">
                <pre className="whitespace-pre-wrap text-xs text-slate-300">{JSON.stringify(cite, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
