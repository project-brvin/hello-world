# gogoiTV — Milestone Roadmap

**Status key:** DONE = exit criteria met; IN PROGRESS = active work; PARTIAL = implementation exists but an earlier phase's criteria remain; NEXT = upcoming; TODO = not started; BLOCKED = required external input missing.  
**Last updated:** 2026-11-09

## Milestone overview

| ID | Milestone | Status | Exit result |
|---|---|---|---|
| M0 | Product and architecture lock | DONE | Agreed direction and guardrails |
| M1 | Foundation and deployment verification | DONE | Deployed Worker and successful homepage/health smoke check confirmed by user |
| M2 | TMDB catalogue and discovery | PARTIAL | User confirms live movie/series shelves; search/detail/error-path coverage remains |
| M3 | Rights-cleared content and IPFS catalogue | IN PROGRESS | Versioned manifest and rights-checked resolver deployed; first real authorised CID still needed |
| M4 | Production-quality playback | TODO | HLS-first player with MP4 compatibility |
| M5 | Delivery resilience and acceleration | TODO | Gateway racing, retry/fallback and measured performance |
| M6 | PWA and student experience polish | TODO | Installable, responsive product with useful local state |
| M7 | Intelligent discovery | TODO | Optional natural-language and mood-based search |
| M8 | Security, quality and release readiness | TODO | Test evidence and launch checks complete |
| M9 | Public launch and iteration | TODO | Monitored release and documented feedback |

## M0 — Product and architecture lock

**Status: DONE — 2026-11-07**

Locked decisions:
- IPFS is the canonical decentralised content source.
- WebTorrent is not the primary playback engine.
- HLS adaptive playback is preferred where an HLS rendition exists; direct MP4 is the compatibility path.
- Cloudflare Worker handles application/API routing and secrets, not sustained video-byte proxying.
- Browser-side gateway tests should reflect the viewer's network path.
- R2/edge cache is optional for rights-cleared popular assets, not a prerequisite for the initial IPFS MVP.
- No application database for the first release; use a static manifest and browser-local state.
- TMDB supplies metadata, not video files or distribution rights.
- No ads and no mandatory sign-in in the first release.
- Only public-domain, creator-owned or properly licensed media may be playable.

**Exit evidence:** this handbook and the architecture decisions are committed to the repository.

## M1 — Foundation and deployment verification

**Status: DONE — 2026-11-07 (deployment smoke check confirmed by user)**

### Existing work
- Repository: project-brvin/hello-world.
- First gogoiTV interface and Cloudflare Worker named gogoitv were created.
- Wrangler configuration and Worker health route were added.
- CID/path input, prototype gateway checks and native video element were added.

### Completed in this M1 pass
- Added package.json with pinned Wrangler 4.158.0 and dev/deploy/dry-run scripts.
- Updated README with Node/npm prerequisites and the reproducible local workflow.
- Added .gitignore rules for node_modules, Wrangler state, .dev.vars and environment files.
- Enabled Worker logs and 10% sampled traces in wrangler.jsonc.
- Uploaded the exact src/index.js fetched from main to the existing Cloudflare Worker gogoitv.
- Cloudflare API accepted the upload and reported a new version assigned 100% of traffic.
- Cloudflare settings confirm compatibility date 2026-11-07, logs enabled, traces enabled at 10%, and workers.dev subdomain enabled.
- Measured the inline HTML/CSS/JS app shell at 13,880 UTF-8 bytes, below the 5 MB source target.

### Completed
- User confirmed that the deployed homepage opens and /api/health returns JSON with ok: true.
- Cloudflare account confirms the gogoitv workers.dev subdomain is enabled.
- Wrangler 4.158.0 is pinned in package.json with dev, deploy and dry-run scripts.
- Worker logs and 10% sampled traces are enabled.
- Inline app shell measured 13,880 UTF-8 bytes, below the 5 MB target.

### Deferred developer-machine check
- Local npm install, Wrangler preview and deploy dry-run were not run in the connected execution environment because external package resolution was unavailable. This is a local workflow validation follow-up, not a blocker to the confirmed remote M1 smoke test.

**Exit evidence:** user-confirmed homepage and health endpoint; Cloudflare control-plane confirms deployment, subdomain, logs and traces. The newest M2 upload still requires a fresh browser refresh/check after deployment.

## M2 — TMDB catalogue and discovery

**Status: PARTIAL — 2026-11-09 (homepage, search, discovery and selected API routes verified; details/error/attribution review open)**

### Implemented in the first M2 delivery batch
- Added Worker API routes for trending, popular movies/TV, multi-search, movie/TV details with credits/videos, genre lists and genre discovery.
- Added token-gated authentication using the Cloudflare secret binding `TMDB_API_READ_ACCESS_TOKEN`.
- Added a live-data homepage with trending, popular movie and series shelves.
- Added title search, detail modal, cast metadata, genre filtering and a device-local watchlist.
- Added TMDB attribution notice and logo asset reference in the Credits area.
- Deployed Worker code version 0.2.1; the TMDB API Read Access Token is now configured as a Worker secret and the user confirms live movie/series tiles render.

### Evidence and remaining work

**2026-11-09 live verification:**
- Cloudflare Browser Rendering observed HTTP 200 for the public homepage and `/api/health`. The homepage rendered live TMDB trending/movie/series tiles; the health JSON reported `ok: true`, `app: "gogoiTV"`, `version: "0.3.0"`, `tmdbConfigured: true`, and manifest count 0.
- Direct browser-rendered checks returned HTTP 200 for `/api/catalog/popular?type=movie` (TMDB result payload present) and `/api/catalog/genres?type=movie` (19 genres).
- The invalid media-resolver test returned HTTP 400 with `code: "INVALID_PARAMS"`, as expected.
- The user independently confirmed that `/api/media/manifest` and the unmapped resolver for movie ID `27205` display their required JSON. Their exact HTTP status was not captured by this session's inspection tool.
- `GET /api/catalog/search?q=Inception`: origin HTTP 200, JSON results returned; first result was movie ID `27205` (Inception), with 13 total results.
- `GET /api/catalog/discover?type=movie&genre=28`: origin HTTP 200, 20 results returned.
- The active Worker version still has `TMDB_API_READ_ACCESS_TOKEN` as a `secret_text` binding; the token value was not read and a static scan found no token-shaped literal in `src/index.js`.
- Movie details, TV genres, empty/no-result search, invalid detail parameters, upstream failure and unknown route remain unverified. Calls for some were rate-limited by the Cloudflare Browser Rendering inspection API (HTTP 429 from that inspection service), which is not evidence of a Worker failure; the details attempt returned no parseable body.
- TMDB attribution text and logo reference are present in source; visual confirmation that the logo actually loads remains open.

**Exit criteria**
- Homepage displays live TMDB results, not hard-coded demo cards.
- Search returns results and handles empty/no-result/error cases.
- Detail view displays correct metadata and artwork.
- API credentials are absent from frontend bundles and committed source.
- Upstream failure does not crash the whole page.

**Remaining evidence:** finish details, TV genre, no-result/error and attribution/logo browser checks. Keep the existing TMDB token in its Cloudflare Secret binding.

## M3 — Rights-cleared content and IPFS catalogue

**Status: IN PROGRESS — 2026-11-09 (manifest/resolver JSON confirmed; third-party demo CID rejected; project-owned upload required)**

### Implemented in this pass
- Added a separate, versioned static manifest module at `src/media-manifest.js` (currently empty; no media is fabricated).
- Added the v1 JSON Schema and a browser-dashboard publishing guide.
- Added runtime checks for CID format, safe relative paths, media protocol/MIME, VOD duration, HTTPS rights evidence, worldwide territory and rights validity dates.
- Duplicate active TMDB mappings and invalid/expired records are excluded.
- Added `GET /api/media/manifest` and `GET /api/media/resolve?type=movie|tv&id=...`.
- Media endpoints do not depend on the TMDB secret; unmatched titles explicitly resolve to `playable: false`.
- Title details now check the authorised-source resolver and explain when a title is not playable.

### Remaining work
1. Do not use candidate CID `QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K`: the user tried both documented gateways and each produced an empty download. The candidate IPFS copy is rejected for this project.
2. Use the official Blender 720p H.264 MOV source documented in `docs/CONTENT_PUBLISHING.md`, convert it to H.264 MP4 with a GUI encoder while preserving the full ending credits, and record the exact output duration/size.
3. Upload a folder containing `video.mp4` through a pinning provider dashboard; record the new folder CID, provider, retention responsibility, current plan limits and gateway URL. A folder CID is required so manifest path `video.mp4` resolves inside the folder.
4. Verify the newly pinned MP4 through two independent gateways (including HTTP Range behaviour), then add the fresh CID/path, TMDB mapping, duration and Blender rights evidence to the manifest.
5. Validate the non-empty manifest/resolver and test actual playback. Keep the current manifest empty until the upload is controlled and verified.

**Exit criteria (not yet met)**
- At least one rights-cleared title resolves from a TMDB item to a valid IPFS CID/path.
- Manifest passes schema validation.
- Content can be retrieved from more than one configured gateway where supported.
- Pinning responsibility and provider limits/costs are documented.
- No unauthorised sources are included.

A CID identifies content; it does not grant distribution rights or guarantee that content is pinned or retrievable.

## M4 — Production-quality playback

**Status: TODO**

### Work
1. Implement a dedicated player module and playback state machine.
2. Support native HLS where available and a compatible JavaScript/MSE path where supported.
3. Support direct MP4 with HTTP Range seeking where the origin permits it.
4. Add auto quality and manual quality selection for multi-rendition HLS.
5. Add subtitles/audio tracks when present.
6. Add play/pause, seek, volume, full screen, keyboard controls and accessible focus states.
7. Add startup loader, buffering indicator, fatal error, retry and source-switch states.
8. Persist local playback progress.
9. Use adaptive buffer targets and memory-aware prefetching; do not blindly reserve 60 seconds in JavaScript memory.

**Exit criteria**
- Test MP4 starts, pauses, resumes and seeks correctly.
- Test HLS plays with multiple renditions where supported.
- Quality changes do not break playback.
- Subtitles render on a test asset with subtitles.
- Errors are human-readable and recoverable.
- Test Chrome Android and a desktop browser; test Safari/iOS where available.

## M5 — Delivery resilience and acceleration

**Status: TODO**

### Work
1. Maintain a configurable pool of IPFS gateways.
2. Race small, bounded test requests from the client browser.
3. Measure response time, status, range support and basic first-byte behaviour.
4. Select the best currently usable gateway.
5. Retry alternate gateways on startup failure, fatal media error or confirmed timeout.
6. Avoid switching mid-playback unless the player can safely recover.
7. Distinguish gateway reachability from pinning-provider status.
8. Evaluate optional Cloudflare R2 hot mirror/edge cache for rights-cleared popular assets after checking current pricing, cache behaviour, range support, CORS and limits.
9. Add low-data mode and avoid wasteful speculative downloads.

**Exit criteria**
- Simulated first-gateway failure recovers through another gateway.
- Range and seek behaviour is verified.
- Selection reflects viewer-relevant measurements, not a hard-coded winner.
- Gateway success is not labelled proof of permanent pinning.
- Performance comparison is recorded on representative networks.

## M6 — PWA and student experience polish

**Status: TODO**

### Work
- Add web app manifest, icons, install guidance and service worker.
- Cache the app shell and static assets; do not cache video offline by default.
- Build hero, poster rows, detail view, search overlay and responsive player.
- Add watchlist and continue-watching using browser storage.
- Add skeletons, empty/error/retry states, reduced-motion support and accessibility checks.
- Optimise images, lazy-load below-the-fold artwork and measure production asset weight.
- Test narrow Android screens and ordinary mobile connections.

**Exit criteria**
- PWA installs on supported browsers and launches correctly.
- App shell remains available after a prior successful visit during a temporary network interruption.
- Watchlist and progress persist across reloads on the same browser.
- No mandatory account or ads.
- No critical mobile overflow or inaccessible primary control.

## M7 — Intelligent discovery

**Status: TODO — intentionally after reliable playback**

### Work
- Add natural-language query understanding behind the Worker.
- Convert intent into structured TMDB search/discover filters.
- Support mood/genre/language/year/runtime where metadata permits.
- Provide deterministic TMDB fallback when AI is slow or unavailable.
- Validate AI output before constructing API requests.

**Exit criteria**
- Representative natural-language queries produce sensible results.
- AI failure falls back to ordinary search.
- AI secrets are not exposed to the browser.
- AI output is validated.

## M8 — Security, quality and release readiness

**Status: TODO**

### Work
- Review Worker secrets, CORS, input validation, CID/path handling and abuse/rate protections.
- Check dependency licensing, vulnerabilities and bundle size.
- Verify rights and define a takedown/contact process.
- Test broken/missing CIDs, timeouts, unsupported codecs, invalid playlists, slow networks and offline states.
- Test keyboard, labels, contrast and reduced motion.
- Review third-party terms, quotas and likely costs.
- Add basic uptime, Worker error and playback-failure monitoring.
- Write privacy and known-limitations notices.

**Exit criteria**
- Test plan completed with evidence.
- No known critical security issue remains open.
- Rights and provider checks are recorded.
- Launch-blocking defects are fixed or explicitly accepted.
- Product claims match measured behaviour.

## M9 — Public launch and iteration

**Status: TODO**

### Work
- Publish release notes and a support/contact route.
- Launch to a small group first.
- Collect feedback on discovery, startup delay, buffering, mobile usability and content availability.
- Prioritise issues that prevent watching.
- Update roadmap and progress log after each release.

**Exit criteria**
- End-to-end success flow in the charter works for the launch test catalogue.
- Known limitations are documented.
- Repeatable rollback/deploy process exists.
- Initial feedback is triaged.

## Working rule

Every milestone needs a concrete code change, an observable test, recorded evidence or blocker, a progress-log entry, and documentation updates. Do not mark work DONE based only on code being written or an upload API reporting success.
