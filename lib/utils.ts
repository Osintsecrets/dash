export function parseSlashCommand(input: string): { cmd: string; args: string[] } | null {
  if (!input.startsWith('/')) return null;
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.slice(1).toLowerCase();
  if (!cmd) return null;
  return { cmd, args: parts.slice(1) };
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
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
      return `/read/${surah}/${ayah}/`;
    }
    case 'h': {
      const [collection, numberRaw] = args;
      if (!collection || !numberRaw) return null;
      return '/hadith/';
    }
    case 'topic': {
      const [slug] = args;
      if (!slug) return null;
      return `/topics/${slug}/`;
    }
    default:
      return null;
  }
}
