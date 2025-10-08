export function parseSlashCommand(input: string): { cmd: string; args: string[] } | null {
  if (!input.startsWith('/')) return null;
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.slice(1).toLowerCase();
  if (!cmd) return null;
  return { cmd, args: parts.slice(1) };
}

export function pathForCommand(cmd: string, args: string[]): string | null {
  switch (cmd) {
    case 'q': {
      const [ref] = args;
      if (!ref) return null;
      const [surahRaw, ayahRaw] = ref.split(':');
      const surah = Number.parseInt(surahRaw ?? '', 10);
      const ayah = Number.parseInt(ayahRaw ?? '', 10);
      if (Number.isNaN(surah) || Number.isNaN(ayah)) return null;
      return `/read?surah=${surah}&ayah=${ayah}`;
    }
    case 'h': {
      const [collection, numberRaw] = args;
      const number = Number.parseInt(numberRaw ?? '', 10);
      if (!collection || Number.isNaN(number)) return null;
      return `/hadith?collection=${collection}&number=${number}`;
    }
    case 'topic': {
      const [slug] = args;
      if (!slug) return null;
      return `/topics/${slug}`;
    }
    default:
      return null;
  }
}
