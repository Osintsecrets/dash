# Neutral Scripture Research Platform

This repository hosts a Next.js (App Router) application that implements the MVP described in the neutral, research-first specification. The experience is optimized for transparent sourcing, neutral microcopy, and offline-first usage.

## Key capabilities

- **Command palette** with slash commands (`/q`, `/h`, `/topic`) powered by MiniSearch for Qur'an ayāt, hadith narrations, and curated topic bundles.
- **Qur'an reader** featuring Arabic text, three English translations, and tafsīr tabs with sample data.
- **Hadith navigator** with grading metadata, isnād placeholders, and copy-ready citations.
- **Topic bundles** (12 sample bundles) linking Qur'an, hadith, tafsīr, and neutral context notes stored under `public/data/topics`.
- **Evidence sheet editor** supporting Markdown notes and export, aligned with local-first privacy.
- **Download manager** that surfaces manifest information for offline caching queues.
- **About page** rendering provenance and licensing information from `public/data/provenance.json`.
- **PWA-ready** via Workbox service worker registration and web manifest in `public/manifest.json`.

## Tech stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (dark-first design language)
- Dexie (IndexedDB wrapper) for future offline persistence
- MiniSearch for local search index construction
- Workbox (`workbox-window`) for service worker registration

## Development

```bash
pnpm install # or npm install / yarn install
pnpm dev      # start the local dev server
pnpm build    # create the static export
```

The app is designed for static export (`next export`). Data files for the sample experience live under `public/data` and can be swapped with real ingestion outputs produced by the planned tooling (`/tools`).

## Data & licensing

Sample JSON stubs under `public/data` contain placeholders drawn from publicly available references (Quran.com, Sunnah.com). The About page surfaces attribution, licensing, and retrieval metadata. Replace the sample stubs with properly licensed datasets for production use.
