# Truth Dashboard Repository Audit

This document captures the current state of the repository and the highest-impact opportunities to bring it to a “pure perfection” standard. Findings are grouped by theme and include concrete remediation steps.

## 1. Repository Structure & Asset Duplication
- **Duplicated application copies.** There are two parallel copies of the frontend—one at the repo root and one under `truth-dashboard/`. Keeping both in sync doubles maintenance effort and creates risk of drift (for example, the nested copy lacks `data/meta.json` while the root copy ships a placeholder). Consolidate to a single source of truth, and if a prebuilt export is needed, automate it via a build script. 【F:index.html†L1-L28】【F:truth-dashboard/index.html†L1-L28】【F:truth-dashboard/data/search_index.json†L1-L42】
- **Broken root README.** The root `README.md` is currently just the string `# dash`, providing no onboarding guidance. Replace it with a canonical README that explains the project, local setup, deployment, and data refresh expectations. 【F:README.md†L1-L1】
- **Missing meta file in nested build.** The runtime expects `data/meta.json` for feature flags and notices, but only the root contains a placeholder. Ensure the build pipeline writes `meta.json` alongside the rest of the generated assets so both environments behave consistently. 【F:assets/search.js†L12-L24】【F:data/meta.json†L1-L4】

## 2. Documentation & Operational Knowledge
- **Lack of operator runbooks.** There is no documentation of how to run scheduled refreshes locally, manage API keys, or interpret the GitHub Actions workflow referenced in `truth-dashboard/README.md`. Extract those instructions into the root README or dedicated docs, and include troubleshooting tips for missing API keys (for example, how to recover from Sunnah API outages). 【F:truth-dashboard/README.md†L8-L44】
- **Unclear data licensing notes.** The project aggregates third-party scripture content; add a section clarifying usage terms and any attribution/licensing requirements to prevent accidental policy violations. 【F:truth-dashboard/README.md†L46-L61】
- **Spell out accessibility and editorial policies.** The nested README mentions editorial guidelines, but no accessibility checklists or translation QA processes are documented. Provide acceptance criteria for contrast, keyboard navigation, and translation accuracy reviews so contributors share the same bar for quality. 【F:truth-dashboard/README.md†L46-L61】

## 3. Data Pipeline Resilience
- **Inefficient Qur’an translation fetching.** `build_corpus.py` makes an additional HTTP request per verse per translation (`/verses/{id}/translations`). For 5 chapters with multiple translations this explodes into hundreds of calls, increasing runtime and rate-limit risk. Prefer the `include-translations` parameter on the chapter endpoint or batch translation requests when possible. 【F:truth-dashboard/scripts/build_corpus.py†L27-L44】
- **No retry/backoff handling.** The script relies on `requests` defaults and raises immediately on transient network failures. Wrap API calls with retry logic (e.g., exponential backoff on HTTP 429/5xx) and surface actionable logs so runs self-heal from temporary outages. 【F:truth-dashboard/scripts/build_corpus.py†L18-L23】【F:truth-dashboard/scripts/build_corpus.py†L71-L88】
- **Hard-coded rate limits and sleeps.** A fixed `time.sleep(0.25)` may still breach Sunnah API quotas or slow down unnecessarily if limits change. Externalize rate limits to config and pace requests based on response headers (`X-RateLimit-Remaining`). 【F:truth-dashboard/scripts/build_corpus.py†L86-L90】
- **No schema validation.** Generated JSON is written blindly from upstream responses. Introduce a schema (e.g., Pydantic or JSON Schema) to validate required fields, preventing malformed records from breaking the frontend. 【F:truth-dashboard/scripts/build_corpus.py†L92-L118】

## 4. Frontend Quality & UX
- **Accessibility gaps.** Interactive controls lack explicit labels and focus styles. Add `aria-live` to the results count, ensure buttons have discernible text, and provide focus outlines that meet WCAG 2.1. Consider contrast testing the dark theme (#0b0f14 background vs #9ab muted text) which may miss the 4.5:1 requirement. 【F:islam.html†L12-L34】【F:assets/styles.css†L1-L22】
- **Missing loading states for data fetch failures.** When network calls fail, the UI simply shows zero results. Surface error toasts that explain when data is unavailable or stale, leveraging the `meta` status. 【F:assets/search.js†L12-L56】
- **Copy citation button relies on Clipboard API without fallback.** On unsupported browsers the button silently fails. Feature-detect `navigator.clipboard` and gracefully degrade (e.g., select text, show tooltip) when unavailable. 【F:assets/search.js†L63-L82】【F:assets/ui.js†L11-L24】

## 5. Testing & Continuous Integration
- **No automated tests.** The repository lacks unit tests for the Python data pipeline and JS utilities. Add coverage for parsing, highlighting, and filtering logic to catch regressions automatically. 【F:truth-dashboard/scripts/build_corpus.py†L1-L121】【F:assets/ui.js†L1-L24】
- **Missing linting/formatting.** There are no ESLint/Prettier or Python linters configured. Adopt standard tooling (e.g., ESLint + TypeScript definitions for the frontend, Ruff/Black for Python) and enforce via CI to keep contributions consistent. 【F:assets/search.js†L1-L107】【F:truth-dashboard/scripts/build_corpus.py†L1-L121】
- **No automated accessibility/performance checks.** Integrate Lighthouse CI or Pa11y in the workflow to monitor Core Web Vitals and WCAG compliance on every commit. This ensures regressions are caught before deployment.

## 6. Security & Secrets Hygiene
- **Sunnah API key handling.** The script reads `SUNNAH_API_KEY` from the environment but provides no guidance for secure storage locally or in CI. Document usage of `.env` files (with `.gitignore`), and consider a wrapper that validates the key format before use to avoid accidental rate limiting with placeholder values. 【F:truth-dashboard/scripts/build_corpus.py†L60-L78】
- **Dependency pinning.** The repo currently relies on system `requests`/`pyyaml` versions without pinning or lock files. Add a `requirements.txt` or `pyproject.toml` that pins minimal versions and update instructions for future upgrades. 【F:truth-dashboard/scripts/build_corpus.py†L1-L4】
- **Content Security Policy.** The HTML does not define a CSP, leaving the hosted site more vulnerable to XSS if a future change introduces dynamic content. Add strict CSP headers or `<meta http-equiv="Content-Security-Policy">` with hashes for inline scripts. 【F:index.html†L1-L28】【F:islam.html†L1-L38】

## 7. Roadmap to “Pure Perfection”
1. **Unify the project structure**: choose one canonical app directory, regenerate assets via a documented build pipeline, and delete the duplicate copy.
2. **Revamp documentation**: write an authoritative README, add operator runbooks, and include accessibility + licensing guidance.
3. **Harden the data fetcher**: batch API calls, add retries/backoff, validate schemas, and ship `meta.json` every run.
4. **Polish the frontend**: improve accessibility, add resilient error states, and harden clipboard interactions.
5. **Establish quality gates**: introduce linting, automated tests, and CI checks (build, data fetch dry run, Lighthouse).
6. **Lock down security posture**: pin dependencies, formalize secret handling, and enforce a Content Security Policy.

Tackling these items will make the repository easier to maintain, safer to operate, and more welcoming to collaborators—bringing it much closer to “pure perfection.”
