import { SheetEditor } from '@/components/SheetEditor';

export default function SheetsPage() {
  return (
    <div className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Evidence sheets</h1>
        <p className="text-sm text-slate-300">
          Draft neutral study notes, attach citations, and export Markdown/PDF. Sheets stay local by default; optional sync can
          be added later.
        </p>
      </header>
      <SheetEditor />
    </div>
  );
}
