# Truth Dashboard (Phase 1: Islam)

Truth Dashboard is a citation-first reference hub designed to surface primary sources with respectful context. Phase 1 ships the Islam module, offering neutral access to selected Qur'an verses and authentic hadith using the official APIs from [Quran.com](https://quran.com) and [Sunnah.com](https://sunnah.com).

## Architecture

- **Static frontend** served from GitHub Pages. The UI is built with vanilla HTML/CSS/JS and uses [MiniSearch](https://github.com/lucaong/minisearch) for local full-text search.
- **Automated data refresh** via a scheduled GitHub Action (`.github/workflows/fetch.yml`). The workflow runs `scripts/build_corpus.py`, which calls the Quran.com API v4 and Sunnah.com API to produce `data/feed.json` (card summaries) and `data/search_index.json` (full-text index).
- **Static assets only**: no custom servers, databases, or binaries, making it compatible with GitHub Pages hosting.

## Data sources

- **Qur'an**: Quran.com API v4, currently chapters 1–5 with Sahih International (translation ID 131). The configuration in `data/sources.yml` allows expanding to all chapters or adjusting translations.
- **Hadith**: Sunnah.com API collections `bukhari` and `muslim`, limited per collection for respectful usage. Requests require an API key and are rate-limited.

Every item links back to the canonical publisher pages. Only short excerpts, IDs, and metadata are stored in the repository.

## Search capabilities

- Full-text search across English and Arabic content with highlighting.
- Filters by source (Quran.com vs Sunnah.com collections) and Surah number for Qur'an verses.
- Results rendered as cards with copy-friendly citations and direct links to the original sources.

## Running locally

1. Clone the repository and install dependencies for the build script (`requests`, `pyyaml`).
2. Export your Sunnah API key: `export SUNNAH_API_KEY=your_key`.
3. Run `python scripts/build_corpus.py` to refresh `data/*.json`.
4. Serve the site with any static HTTP server, e.g. `python -m http.server 8000` and open `http://localhost:8000/truth-dashboard/index.html`.

## GitHub Actions setup

1. In the repository settings, add a secret `SUNNAH_API_KEY` for the Sunnah.com API.
2. Enable GitHub Pages (main branch, root).
3. The scheduled workflow (`Build data index`) runs every eight hours and on manual dispatch, committing fresh JSON data when changes are detected.

## Editorial Policy

- **Citation-first**: every card links to the original source. We store minimal excerpts and identifiers only.
- **Neutral aggregation**: content is provided without commentary or alteration. Context belongs to the publishers.
- **Respectful language**: descriptions remain factual and considerate of all audiences.
- **API-only access**: we use official APIs and abide by rate limits; no scraping of HTML or private endpoints.
- **Publisher collaboration**: we welcome feedback from original publishers regarding inclusion or removal.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).
