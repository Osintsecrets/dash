import { renderCard } from './ui.js';
import { searchItems } from './microsearch.js';

async function boot() {
  const spinner = document.getElementById('spinner');
  const emptyEl = document.getElementById('empty');
  const notice = document.getElementById('notice');
  if (spinner) spinner.hidden = false;

  const [metaJson, indexJson] = await Promise.all([
    fetch('./data/meta.json').then(r => r.ok ? r.json() : {sunnah_status:'unknown'}).catch(()=>({sunnah_status:'unknown'})),
    fetch('./data/search_index.json').then(r => r.ok ? r.json() : {items:[]}).catch(()=>({items:[]}))
  ]);

  const items = Array.isArray(indexJson.items) ? indexJson.items : [];
  if (metaJson.sunnah_status === 'skipped' && notice) {
    notice.hidden = false;
    notice.textContent = "Heads up: Hadith results may be limited because the Sunnah API key is not configured.";
  }

  const q     = document.getElementById('q');
  const src   = document.getElementById('src');
  const surah = document.getElementById('surah');
  const list  = document.getElementById('list');
  const count = document.getElementById('count');
  const copyLinkBtn = document.getElementById('copyLink');

  const sources = [...new Set(items.map(i => i.source))].sort();
  sources.forEach(s => { const o=document.createElement('option'); o.value=s; o.textContent=s; src.appendChild(o); });

  const surahs = [...new Set(items.flatMap(i => i.tags||[]).filter(t => /^Surah /.test(t)))]
    .sort((a,b)=>parseInt(a.replace(/\D+/g,''),10)-parseInt(b.replace(/\D+/g,''),10));
  surahs.forEach(t => { const o=document.createElement('option'); o.value=t; o.textContent=t; surah.appendChild(o); });

  function stateToQuery() {
    const params = new URLSearchParams();
    if (q.value.trim()) params.set('q', q.value.trim());
    if (src.value) params.set('src', src.value);
    if (surah.value) params.set('surah', surah.value);
    return params.toString();
  }
  function loadFromQuery() {
    const u = new URL(window.location.href);
    q.value = u.searchParams.get('q') || '';
    src.value = u.searchParams.get('src') || '';
    surah.value = u.searchParams.get('surah') || '';
  }

  function apply(push=true) {
    const query = q.value.trim();
    const s = src.value;
    const su = surah.value;

    let results;
    if (typeof MiniSearch !== 'undefined') {
      const mini = window.__mini || (window.__mini = new MiniSearch({
        fields:['title','content','tags','source'],
        storeFields:['id','title','url','source','published','excerpt'],
        searchOptions:{ boost:{title:6,tags:3,source:1,content:1}, prefix:true, fuzzy:0.1 },
        tokenize: t => (t||'').toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[]
      }));
      if (!window.__mini_added) { mini.addAll(items); window.__mini_added=true; }
      results = query ? mini.search(query).map(r => items.find(i=>i.id===r.id)) : items;
    } else {
      results = query ? searchItems(items, query) : items;
    }

    if (s)  results = results.filter(r => r && r.source === s);
    if (su) results = results.filter(r => r && (r.tags||[]).includes(su));

    count.textContent = results.length;
    list.innerHTML = results.map(renderCard(query)).join('');
    emptyEl.hidden = results.length !== 0;

    if (push) {
      const qs = stateToQuery();
      const url = qs ? `?${qs}` : window.location.pathname;
      history.replaceState(null, '', url);
    }
  }

  q.addEventListener('input', () => apply(true));
  src.addEventListener('change', () => apply(true));
  surah.addEventListener('change', () => apply(true));

  const presets = document.getElementById('presets');
  if (presets) {
    presets.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-q]'); if (!btn) return;
      q.value = btn.dataset.q || '';
      apply(true);
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      copyLinkBtn.textContent = 'Link copied';
      setTimeout(()=>copyLinkBtn.textContent='Copy link', 1200);
    });
  }

  loadFromQuery();
  apply(false);
  if (spinner) spinner.hidden = true;
}
boot();
