'use client';

import { useMemo, useState } from 'react';
import { Button, Input, Textarea, Card } from '@/components/ui';
import { useToast } from '@/components/ToastProvider';
import type { Sheet } from '@/lib/types';

interface SheetEditorProps {
  initialSheet?: Sheet;
}

export function SheetEditor({ initialSheet }: SheetEditorProps) {
  const { push } = useToast();
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
    push({ title: 'Markdown exported', description: `${sheet.title} downloaded.` });
  }

  function printSheet() {
    window.print();
    push({ title: 'Print dialog opened', description: 'Use your browser to save as PDF or print.' });
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sheet-title" className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
            Title
          </label>
          <Input
            id="sheet-title"
            value={sheet.title}
            onChange={(event) => setSheet((prev) => ({ ...prev, title: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="sheet-notes" className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
            Notes (Markdown)
          </label>
          <Textarea
            id="sheet-notes"
            value={sheet.notes_md}
            onChange={(event) => setSheet((prev) => ({ ...prev, notes_md: event.target.value }))}
            rows={12}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={downloadMarkdown}>
            Export Markdown
          </Button>
          <Button type="button" variant="outline" onClick={printSheet}>
            Print / Save PDF
          </Button>
        </div>
      </Card>
      <Card className="space-y-3">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-white">Citations</h3>
          <p className="text-xs text-slate-400">Add texts via “Add to sheet” actions throughout the app.</p>
        </header>
        {sheet.cites.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            No citations yet. Use the Read or Hadith views to queue evidence snippets.
          </p>
        ) : (
          <ul className="space-y-3 text-sm text-slate-200">
            {sheet.cites.map((cite, index) => (
              <li key={index} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <pre className="whitespace-pre-wrap text-xs text-slate-300">{JSON.stringify(cite, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
