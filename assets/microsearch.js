/* Tiny fallback search (no dependencies) */
export function searchItems(items, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return items;
  const terms = q.split(/\s+/).filter(Boolean);
  return items.filter(it => {
    const blob = [it.title, it.excerpt, (it.tags||[]).join(' '), it.source].join(' ').toLowerCase();
    return terms.every(t => blob.includes(t));
  });
}
