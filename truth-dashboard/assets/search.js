import { renderCard } from './ui.js';

async function boot() {
  const spinner = document.getElementById('spinner');
  const emptyEl = document.getElementById('empty');
  const notice = document.getElementById('notice');
  spinner.hidden = false;
  // Load meta & full-text index
  const [metaRes, res] = await Promise.all([
    fetch('./data/meta.json', { cache: 'no-cache' }).catch(() => null),
    fetch('./data/search_index.json', { cache: 'no-cache' })
  ]);
  const data = await res.json();
  const items = data.items;
  if (metaRes && metaRes.ok) {
    const meta = await metaRes.json();
    if (meta.sunnah_status === 'skipped') {
      notice.hidden = false;
      notice.textContent = "Heads up: Hadith results may be limited because the Sunnah API key is not configured.";
    }
  }

  // MiniSearch is provided via assets/vendor/minisearch.min.js (global)
  const mini = new MiniSearch({
    fields: ['title', 'content', 'tags', 'source'],
    storeFields: ['id', 'title', 'url', 'source', 'published', 'excerpt'],
    searchOptions: { boost: { title: 6, tags: 3, source: 1, content: 1 }, prefix: true, fuzzy: 0.1 },
    tokenize: t => (t || '').toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []
  });
  mini.addAll(items);

  // UI elements
  const q     = document.getElementById('q');
  const src   = document.getElementById('src');
  const surah = document.getElementById('surah');
  const list  = document.getElementById('list');
  const count = document.getElementById('count');
  const copyLinkBtn = document.getElementById('copyLink');

  // Populate source filter
  [...new Set(items.map(i => i.source))].sort().forEach(s => {
    const o = document.createElement('option'); o.value = s; o.textContent = s; src.appendChild(o);
  });

  // Populate surah filter from tags like "Surah N"
  [...new Set(items.flatMap(i => i.tags || []).filter(t => /^Surah /.test(t)))]
    .sort((a, b) => parseInt(a.replace(/\D+/g, ''), 10) - parseInt(b.replace(/\D+/g, ''), 10))
    .forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; surah.appendChild(o); });

  function stateToQuery() {
    const params = new URLSearchParams();
    if (q.value.trim()) params.set('q', q.value.trim());
    if (src.value) params.set('src', src.value);
    if (surah.value) params.set('surah', surah.value);
    return params.toString();
  }
  function loadFromQuery() {
    const u = new URL(window.location.href);
    const get = (k)=>u.searchParams.get(k) || '';
    q.value = get('q');
    src.value = get('src');
    surah.value = get('surah');
  }
  function apply(push=true) {
    const query = q.value.trim();
    const s = src.value;
    const su = surah.value;

    let results = query ? mini.search(query) : items;
    // MiniSearch results are objects; raw items are plain. Normalize.
    if (query) results = results.map(r => ('id' in r ? items.find(i => i.id === r.id) : r));

    if (s)  results = results.filter(r => r.source === s);
    if (su) results = results.filter(r => (r.tags || []).includes(su));

    count.textContent = results.length;
    list.innerHTML = results.map(renderCard(query)).join('');
    emptyEl.hidden = results.length !== 0;
    // Update URL (shareable)
    if (push) {
      const qs = stateToQuery();
      const url = qs ? `?${qs}` : window.location.pathname;
      history.replaceState(null, '', url);
    }
  }

  // Events
  q.addEventListener('input', () => apply(true));
  src.addEventListener('change', () => apply(true));
  surah.addEventListener('change', () => apply(true));

  // Preset queries (buttons under the search bar)
  const presets = document.getElementById('presets');
  if (presets) {
    presets.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-q]');
      if (!btn) return;
      q.value = btn.dataset.q || '';
      apply(true);
    });
  }

  // Copy citation (event delegation)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button.copy');
    if (!b) return;
    const cite = b.dataset.cite || '';
    navigator.clipboard.writeText(cite).then(() => {
      const prev = b.textContent;
      b.textContent = 'Copied';
      setTimeout(() => { b.textContent = prev || 'Copy citation'; }, 1200);
    });
  });

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const qs = stateToQuery();
      const url = qs ? `${window.location.origin}${window.location.pathname}?${qs}` : window.location.href.split('?')[0];
      navigator.clipboard.writeText(url).then(() => {
        const prev = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied link!';
        setTimeout(() => { copyLinkBtn.textContent = prev || 'Copy link'; }, 1200);
      });
    });
  }

  // Init from URL, then render
  loadFromQuery();
  apply(false);
  spinner.hidden = true;
}
boot();
