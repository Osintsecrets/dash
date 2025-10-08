'use client';

import { Button } from '@/components/ui';
import { useToast } from '@/components/ToastProvider';
import { toPDF } from '@/lib/export';

type ExportGetter = () => Promise<{ title: string; md: string }>;

export default function ExportButtons({ getData }: { getData: ExportGetter }) {
  const { push } = useToast();

  async function handleMarkdown() {
    const { md, title } = await getData();
    try {
      await navigator.clipboard.writeText(md);
      push({ title: 'Markdown copied', description: `${title} exported to clipboard.` });
    } catch (error) {
      push({ title: 'Clipboard unavailable', description: 'Copy failed. Try again or use manual selection.' });
    }
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
    push({ title: 'PDF downloaded', description: `${title} saved to your device.` });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" onClick={handleMarkdown}>
        Copy as Markdown
      </Button>
      <Button type="button" variant="outline" onClick={handlePDF}>
        Download PDF
      </Button>
    </div>
  );
}
