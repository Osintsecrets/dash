import { renderCard } from './ui.js';

async function boot(){
  const idxRes = await fetch('./data/search_index.json',{cache:'no-cache'});
  const data = await idxRes.json();
  const items = data.items;

  const mini = new MiniSearch({
    fields:['title','content','tags','source'],
    storeFields:['id','title','url','source','published','excerpt'],
    searchOptions:{ boost:{title:6,tags:3,source:1,content:1}, prefix:true, fuzzy:0.1 },
    tokenize: t => (t||'').toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[]
  });
  mini.addAll(items);

  const q = document.querySelector('#q');
  const src = document.querySelector('#src');
  const surah = document.querySelector('#surah');
  const list = document.querySelector('#list');
  const count = document.querySelector('#count');

  // populate source filter
  [...new Set(items.map(i=>i.source))].sort().forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; src.appendChild(o); });
  // populate surah filter from tags like "Surah N"
  [...new Set(items.flatMap(i=>i.tags||[]).filter(t=>/^Surah /.test(t)))].sort((a,b)=>{
    const na = parseInt(a.replace(/\D+/g,''),10); const nb = parseInt(b.replace(/\D+/g,''),10); return na-nb; }).forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; surah.appendChild(o); });

  function apply(){
    const query = q.value.trim();
    const s = src.value; const su = surah.value;
    let results = query? mini.search(query).map(r=>r) : items;
    if(s) results = results.filter(r => (r.source===s) || (r._src && r._src.source===s));
    if(su) results = results.filter(r => (r.tags||[]).includes(su));
    count.textContent = results.length;
    list.innerHTML = results.map(renderCard(query)).join('');
  }

  q.addEventListener('input', apply);
  src.addEventListener('change', apply);
  surah.addEventListener('change', apply);
  apply();
}
boot();
