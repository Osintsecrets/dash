import type { HadithItem, QuranAyah, TafsirSegment, TopicBundle } from './types';

function citeQuran(surah: number, ayah: number) {
  return `Q ${surah}:${ayah}`;
}

function citeHadith(collection: string, book: number, number: number) {
  return `${collection} ${book}:${number}`;
}

export function toMarkdown(options: {
  title: string;
  ayat: QuranAyah[];
  tafsir: TafsirSegment[];
  hadith: HadithItem[];
  notes?: string;
  topics?: TopicBundle[];
}) {
  const { title, ayat, tafsir, hadith, notes, topics } = options;
  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');

  if (notes) {
    lines.push(notes, '');
  }

  if (topics && topics.length > 0) {
    lines.push('## Topics');
    for (const topic of topics) {
      lines.push(`- ${topic.title}`);
    }
    lines.push('');
  }

  if (ayat.length > 0) {
    lines.push('## Qur’an');
    for (const ayah of ayat) {
      lines.push(`**${citeQuran(ayah.surah, ayah.ayah)}**`);
      lines.push('');
      lines.push(`<blockquote lang="ar" dir="rtl">${ayah.arabic}</blockquote>`);
      lines.push('');
      const translations = ayah.translations.slice(0, 3);
      for (const translation of translations) {
        lines.push(`> ${translation.work_id}: ${translation.text}`);
      }
      lines.push('');
    }
  }

  if (tafsir.length > 0) {
    lines.push('## Tafsīr (excerpts)');
    for (const segment of tafsir) {
      lines.push(`**${segment.work_id} on ${segment.surah}:${segment.ayah}**`);
      lines.push('');
      lines.push(segment.excerpt);
      lines.push('');
    }
  }

  if (hadith.length > 0) {
    lines.push('## Hadith');
    for (const item of hadith) {
      const grade = item.grading?.value ? ` — grading: ${item.grading.value}` : '';
      lines.push(`**${citeHadith(item.collection, item.book, item.number)}**${grade}`);
      if (item.arabic) {
        lines.push('');
        lines.push(`<blockquote lang="ar" dir="rtl">${item.arabic}</blockquote>`);
      }
      if (item.translations?.length) {
        for (const translation of item.translations) {
          lines.push(`> ${translation.text}`);
        }
      }
      lines.push('');
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('Generated for neutral study and comparison.');

  return lines.join('\n');
}

export async function toPDF(markdown: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  let y = margin;
  const fontSize = 11;
  const lines = markdown.split('\n');
  const pageWidth = doc.internal.pageSize.getWidth();

  const wrap = (text: string) => doc.splitTextToSize(text, pageWidth - margin * 2);

  for (const rawLine of lines) {
    let text = rawLine;
    if (text.startsWith('# ')) {
      doc.setFontSize(18);
      text = text.replace('# ', '');
    } else if (text.startsWith('## ')) {
      doc.setFontSize(14);
      text = text.replace('## ', '');
    } else {
      doc.setFontSize(fontSize);
    }

    const wrapped = wrap(text.replace(/^>\s?/, ''));
    for (const line of wrapped) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y, { align: 'left' });
      y += 16;
    }
    y += 8;
  }

  return doc.output('blob');
}
