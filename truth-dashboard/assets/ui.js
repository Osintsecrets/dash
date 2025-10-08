export const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const highlight = (text, q) => {
  if(!q || !text) return text||'';
  const terms = [...new Set((q.toLowerCase().match(/[\p{L}\p{N}_"]+/gu)||[]).filter(t=>t!== '"' && t.length>1))];
  if(!terms.length) return text;
  const pattern = new RegExp("("+terms.map(escapeRegExp).join("|")+")","giu");
  return text.replace(pattern,'<mark>$1</mark>');
};
export const renderCard = (q) => (it) => `
  <article class="card">
    <header>
      <h3><a href="${it.url}" target="_blank" rel="noopener">${highlight(it.title,q)}</a></h3>
      <div class="meta"><span>${it.source}</span><span>•</span><time>${it.published? new Date(it.published).toLocaleString(): 'n/a'}</time></div>
    </header>
    <p>${highlight(it.excerpt||'',q)}</p>
    <footer><a href="${it.url}" target="_blank" rel="noopener">Read at source →</a></footer>
  </article>`;
