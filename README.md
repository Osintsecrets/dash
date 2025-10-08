# Truth Dashboard

Truth Dashboard is a static, citation-first research aid that collates primary religious sources with respectful context. The current focus is the Islam module, which lets you search curated Qur'an verses and authentic hadith with fast client-side filtering.

## Repository Layout
- `index.html`, `islam.html`, `assets/`, `data/`: Deployed static site.
- `truth-dashboard/`: Source tree containing documentation, build scripts, and vendor libraries.
- `AUDIT.md`: Continuous-improvement checklist produced from a full project audit.

## Quick Start
1. Install Python 3.11+ and Node.js 18+.
2. Create and activate a virtual environment, then install Python deps:
   ```bash
   pip install -r requirements.txt
   ```
3. Export your Sunnah API key (required for hadith content):
   ```bash
   export SUNNAH_API_KEY=your_key
   ```
4. Generate fresh data:
   ```bash
   python truth-dashboard/scripts/build_corpus.py
   ```
5. Serve the site locally, e.g.:
   ```bash
   python -m http.server 8000
   ```
   and open `http://localhost:8000/index.html`.

## Deployment
The site is optimized for static hosting (e.g., GitHub Pages, Netlify). Ensure the `data/` directory is refreshed before publishing. Automate regeneration via CI/CD to keep the corpus current.

## Contributing
- Review `AUDIT.md` for prioritized improvements (testing, accessibility, security).
- Run formatting and tests before opening a PR.
- Respect the editorial policy: cite primary sources, keep language neutral, and honor publisher guidelines.

## License
MIT. See [`truth-dashboard/LICENSE`](truth-dashboard/LICENSE).
