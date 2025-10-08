# Truth Dashboard (v2.0)
Static, citation-first reference hub (GitHub Pages). Phase 1 focuses on Islam sources using official APIs (Quran.com v4 and Sunnah.com). Includes:
- **Islam Search**: full-text local search over Qur’an (selected translation) + hadith (if Sunnah API key set).
- **Arguments**: curated “argument packs” you author in `data/collections/arguments.json` that point to scriptural citations and render exportable lists.

**Data pipeline**: `.github/workflows/fetch.yml` calls `scripts/build_corpus.py` → writes `data/search_index.json`, `data/feed.json`, `data/meta.json`.

**Set secret**: Settings → Secrets → Actions → `SUNNAH_API_KEY`.

Run locally: any static server (`python -m http.server`), then open `/index.html`.

Editorial policy: citation-first. We aggregate IDs, excerpts, and canonical links; readers are sent to original sources. No scraping.
