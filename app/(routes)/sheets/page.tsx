'use client';

import { useState } from 'react';
import ExportButtons from '@/components/ExportButtons';
import { SheetEditor } from '@/components/SheetEditor';
import { Card, Input, Textarea } from '@/components/ui';
import { toMarkdown } from '@/lib/export';

export default function SheetsPage() {
  const [title, setTitle] = useState('Evidence Sheet');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white">Evidence sheets</h1>
          <p className="text-sm text-slate-300">
            Draft neutral study notes, attach citations, and export Markdown or PDF. Sheets stay local by default; optional sync can come later.
          </p>
        </div>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Sheet title" />
        <Textarea
          rows={6}
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
      </Card>
      <SheetEditor />
    </div>
  );
}
