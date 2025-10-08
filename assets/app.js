export async function readJSON(path, fallback = null) {
  try { const r = await fetch(path, {cache:'no-cache'}); if (!r.ok) return fallback; return await r.json(); }
  catch { return fallback; }
}
export function mdEscape(s=''){ return s.replace(/[<>*_`~|]/g, m => '\\'+m); }
