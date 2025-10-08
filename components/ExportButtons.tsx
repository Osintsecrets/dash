'use client';

import { toPDF } from '@/lib/export';

type ExportGetter = () => Promise<{ title: string; md: string }>;

export default function ExportButtons({ getData }: { getData: ExportGetter }) {
  async function handleMarkdown() {
    const { md } = await getData();
    await navigator.clipboard.writeText(md);
    alert('Markdown copied to clipboard');
  }

  async function handlePDF() {
    const { title, md } = await getData();
    const blob = await toPDF(md);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9_-]+/gi, '-')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <button type="button" className="btn" onClick={handleMarkdown}>
        Copy as Markdown
      </button>
      <button type="button" className="btn" onClick={handlePDF}>
        Download PDF
      </button>
    </div>
  );
}
