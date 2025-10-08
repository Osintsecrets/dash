'use client';

import { useState } from 'react';
import ExportButtons from '@/components/ExportButtons';
import { SheetEditor } from '@/components/SheetEditor';
import { toMarkdown } from '@/lib/export';

export default function SheetsPage() {
  const [title, setTitle] = useState('Evidence Sheet');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4">
      <header className="card space-y-3">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-slate-100">Evidence sheets</h1>
          <p className="text-sm text-slate-300">
            Draft neutral study notes, attach citations, and export Markdown or PDF. Sheets stay local by default; optional sync
            can come later.
          </p>
        </div>
        <input
          className="w-full rounded-xl bg-slate-800 p-2 text-base text-slate-100"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Sheet title"
        />
        <textarea
          className="h-48 w-full rounded-xl bg-slate-800 p-3 text-sm text-slate-100"
          placeholder="Your neutral notes…"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          aria-label="Sheet notes"
        />
        <ExportButtons
          getData={async () => {
            const md = toMarkdown({ title, ayat: [], tafsir: [], hadith: [], notes });
            return { title, md };
          }}
        />
      </header>
      <SheetEditor />
    </div>
  );
}
