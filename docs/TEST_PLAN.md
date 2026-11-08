# gogoiTV — Test and Release Plan

**Last updated:** 2026-11-09  
**Rule:** A feature is complete only when the test is run and the result is recorded.

## Test environments

- Local development with Wrangler.
- Deployed Cloudflare Worker / PWA.
- Current desktop Chrome-based browser.
- Android Chrome on a representative phone.
- Safari/iOS where a suitable device is available.
- Network profiles: fast Wi-Fi, ordinary mobile data, throttled/slow network and brief connectivity loss.

Record browser/device, date, test asset, network profile and result for important playback tests.

## Latest remote inspection — 2026-11-08

- Cloudflare control plane confirms Worker `gogoitv` deployment `11c85ccc-ed72-43fa-a018-dd3250eb87a0` routes 100% of traffic to version `34c75251-aa1c-4ef1-9e5a-1bce997dfb07` (version number 6).
- The active version's resource metadata includes `TMDB_API_READ_ACCESS_TOKEN` with type `secret_text`; the value was not read.
- Workers.dev is enabled. Worker logs are enabled and traces are enabled with 10% head sampling.
- Static checks: `src/index.js` contains the six catalogue handlers and both media handlers; `docs/media-manifest.schema.json` parses as JSON; `src/media-manifest.js` still has an empty `items` array; no token-shaped credential literal was found in `src/index.js`. These checks do not replace runtime/API or full secret-exposure testing.

## Live public checks — 2026-11-09

- Cloudflare Browser Rendering fetched the homepage and observed origin HTTP 200. The returned rendered document showed populated, live TMDB movie and series shelves.
- `GET /api/health`: origin HTTP 200; JSON fields included `ok: true`, `app: "gogoiTV"`, `version: "0.3.0"`, `tmdbConfigured: true`, `mediaManifestCount: 0`, and `mediaManifestInvalidCount: 0`.
- `GET /api/catalog/popular?type=movie`: origin HTTP 200; JSON contained TMDB movie results.
- `GET /api/catalog/genres?type=movie`: origin HTTP 200; JSON contained 19 genres.
- `GET /api/catalog/search?q=Inception`: origin HTTP 200; 13 results; first result movie ID `27205` (Inception).
- `GET /api/catalog/discover?type=movie&genre=28`: origin HTTP 200; 20 movie results.
- `GET /api/media/resolve?type=bad&id=x`: origin HTTP 400; JSON `code: "INVALID_PARAMS"` (expected validation response).
- User independently confirmed the health, media-manifest and unmapped-movie resolver pages show the required JSON. This is user-confirmed evidence; HTTP statuses for the manifest and unmapped resolver were not captured by this run.
- The movie-details attempt returned no parseable body and the TV-genres attempt was blocked by HTTP 429 from the **Cloudflare Browser Rendering inspection API**. Those results are NOT VERIFIED, not application failures. Search and discovery were later independently verified as HTTP 200.
- The user tried the Big Buck Bunny candidate URLs through both `ipfs.io` and `dweb.link`; each click downloaded an empty file. Treat this third-party CID/path as unusable for this project and do not add it to the manifest. Earlier headless probes had also received a challenge (403) and tool rate limit (429).
- The current homepage source includes TMDB's non-endorsement attribution and official logo URL. The rendered UI/logo load still needs visual review.

## M1 — Foundation

| Test | Expected result | Evidence/status |
|---|---|---|
| Cloudflare Worker upload | API accepted main/src/index.js; new version received 100% traffic | PASS — API/deployment control plane only |
| workers.dev subdomain | Enabled for gogoitv | PASS — Cloudflare settings |
| Worker observability | Logs enabled; traces enabled at 10% | PASS — Cloudflare settings |
| Open deployed root URL | App returns and renders | PASS — Cloudflare Browser Rendering observed origin HTTP 200 and populated live TMDB shelves (2026-11-09) |
| Request /api/health | Valid health JSON | PASS — origin HTTP 200; expected health fields present, `tmdbConfigured: true` (2026-11-09) |
| Run local Wrangler preview | App starts with documented command | NOT RUN — pinned CLI not installed |
| Wrangler deploy dry-run | Bundle validates | NOT RUN — pinned CLI not installed |
| Browser console | No blocking runtime errors | NOT VERIFIED — requires browser access |
| Inline app shell size | HTML/CSS/JS served inside Worker response | 13,880 UTF-8 bytes; below 5 MB target |
| Full production bundle size | Final Wrangler build output | NOT MEASURED — dry-run/build pending |

## M2 — TMDB discovery

| Test | Expected result | Evidence/status |
|---|---|---|
| Worker secret configured | TMDB_API_READ_ACCESS_TOKEN exists as secret_text binding | PASS — active Worker version metadata confirms the binding exists; value remains hidden (2026-11-08) |
| Live homepage shelves | Movie and series tiles render from TMDB | USER-CONFIRMED PASS — user reports tiles now appear |
| Search/details/genres/error states | All expected responses and fallbacks | PARTIAL — homepage loads live shelves; popular movies (200), movie genres (200), search `Inception` (200/13 results) and Action discovery (200/20 results) verified. Movie details, TV genres, no-result/invalid-search and upstream/unknown-route paths remain NOT VERIFIED; inspection API 429s are not Worker failures |
| Credential exposure | No token in frontend/source/query strings | PARTIAL — static source scan found no token-shaped literal in `src/index.js`; inspect the served frontend and network requests before sign-off |
| TMDB attribution/logo | Attribution visible and logo loads | SOURCE PASS for attribution text and official logo reference; actual logo image load/visual prominence still pending |

## M3 — Content and IPFS

| Test | Expected result | Evidence/status |
|---|---|---|
| Cloudflare Worker upload | Both ES modules uploaded and v0.3.0 deployment receives 100% traffic | PASS — Cloudflare control plane |
| Existing TMDB secret binding | TMDB_API_READ_ACCESS_TOKEN remains a secret_text binding after upload | PASS — Cloudflare settings checked immediately after deployment |
| Manifest endpoint | Returns schema/version/count and a valid items array | USER-CONFIRMED JSON PASS — user opened the endpoint and confirmed the required JSON; status not independently captured |
| Empty manifest behaviour | Count is 0; no title is assumed playable | PASS — health JSON reports `mediaManifestCount: 0` and `mediaManifestInvalidCount: 0`; source manifest has `items: []` |
| Unmapped TMDB title | Resolver returns playable:false and NO_RIGHTS_CLEARED_SOURCE | USER-CONFIRMED JSON PASS for movie ID 27205; HTTP status not independently captured |
| Invalid resolver parameters | HTTP 400 with INVALID_PARAMS | PASS — origin HTTP 400 with `INVALID_PARAMS` for `type=bad&id=x` |
| Rights/CID/path validation | Invalid, expired, duplicate or non-worldwide records are excluded | Implemented; requires fixture-based runtime tests |
| Real authorised content | At least one TMDB mapping resolves to a real pinned CID/path | BLOCKED — Big Buck Bunny rights candidate (TMDB movie 10378; CC BY 3.0); third-party demo CID rejected after user obtained empty downloads from both gateways. Need a new project-pinned rendition |
| Multi-gateway retrieval | Same asset is retrievable through two independent gateways | BLOCKED — user reports the candidate playlist links at both gateways downloaded empty files. The candidate CID/path is not usable; repeat only with a new project-controlled CID |

## M4 — Player

- MP4 starts, pauses, resumes, seeks and enters/exits full screen.
- HLS starts and switches quality on a multi-rendition test asset.
- Corrupted playlist/segment produces a recoverable error.
- Subtitle track renders and can be toggled.
- Memory and data use remain reasonable on mobile.
- Player never reports "playing" before media actually starts.

## M5 — Gateway resilience

- Gateways are tested in parallel with bounded timeout and small requests.
- A slow or failing first gateway is not selected over a healthy alternative without reason.
- Simulated first-gateway failure triggers an alternate-source attempt.
- Range support is verified before promising reliable seeking.
- Browser CORS blocks are not mislabelled as content absence.
- Probe timing is not presented as a guarantee of sustained playback speed.
- Gateway success is not labelled proof of permanent pinning.

## M6 — PWA and experience

- Install prompt/steps work where supported.
- App shell opens after a prior visit during a temporary network interruption.
- No video is silently downloaded or cached in the background.
- Watchlist and progress survive reload on the same browser.
- Primary actions work with keyboard and touch.
- Reduced-motion preference is respected.
- Mobile layout has no critical overflow.

## M7 — Intelligent discovery

- Representative mood/intent prompts map into supported catalogue filters.
- Malformed or irrelevant AI output is rejected.
- AI timeout/failure falls back to ordinary search.
- No private token is exposed to the client.

## M8 — Release gate

Release is blocked by:
- Any known critical security or privacy issue.
- Any playable item without documented distribution rights.
- Exposed API secrets.
- Broken primary search-to-play flow.
- Player unable to recover from a common gateway failure.
- Misleading claims about free/unlimited access, availability or no buffering.
- Unexplained production errors or unreviewed third-party service limits.

## Performance metrics to record

- App first meaningful render.
- Search response time.
- Play click to first frame (startup time).
- Rebuffer ratio and stalls per session.
- Gateway probe and retry outcomes.
- Bytes downloaded before playback and during a representative session.
- Player failures by browser/device.
- Frontend production asset size.

Set numeric targets only after measuring a baseline on representative devices and networks. Do not invent a "zero buffering" pass result.


## M2 — TMDB catalogue and discovery

**Implementation status:** Initial feature slice and TMDB secret are deployed. Homepage, popular movie and movie-genre slices have live evidence; remaining route/UI acceptance tests are open.

### Configuration
- Cloudflare secret name: `TMDB_API_READ_ACCESS_TOKEN`.
- Secret must be added through Wrangler's secure prompt or the Cloudflare dashboard.
- Never place the token in Git, browser code, query strings or chat messages.
- Cloudflare active-version metadata confirms `TMDB_API_READ_ACCESS_TOKEN` exists as a `secret_text` binding. Its value remains hidden and must never be copied into source, logs or chat.

### Endpoint tests (live evidence as of 2026-11-09)

| Test | Expected result | Status |
|---|---|---|
| `GET /api/catalog/trending?type=all&window=week` | Trending payload with results | PASS indirectly — the live homepage rendered its trending shelf; exact route status not separately recorded |
| `GET /api/catalog/popular?type=movie` | Popular movies | PASS — origin HTTP 200 with TMDB results |
| `GET /api/catalog/popular?type=tv` | Popular series | PASS indirectly — the live homepage rendered the series shelf; exact route status not separately recorded |
| `GET /api/catalog/search?q=...` | Matching movie/TV results | NOT VERIFIED — Cloudflare Browser Rendering inspection calls were rate-limited; not evidence of Worker failure |
| `GET /api/catalog/details?type=movie&id=...` | Detail, credits and videos | NOT VERIFIED — inspection API rate limit prevented a fresh origin response |
| `GET /api/catalog/genres?type=movie` | Genre list | PASS — origin HTTP 200 with 19 genres |
| `GET /api/catalog/discover?type=movie&genre=...` | Genre-filtered titles | NOT VERIFIED — inspection API rate limit prevented a fresh origin response |
| Missing token behaviour | HTTP 503 with TMDB_NOT_CONFIGURED | NOT RUN — active Worker has the secret configured; do not remove it just to test this path |
| Invalid query/id/type | HTTP 400 with safe error | PARTIAL — invalid resolver params returned HTTP 400 `INVALID_PARAMS`; invalid search/detail and unknown-route cases remain NOT VERIFIED |

### UI tests (run after secret is configured)
- Home shelves render real trending, popular movies and series.
- Search results show movie and TV entries only.
- Detail modal shows synopsis, metadata, backdrop and cast where supplied.
- Genre chips load and return filtered titles.
- My List persists on the current browser/device after reload.
- TMDB attribution notice is visible; approved logo asset is loaded and not more prominent than gogoiTV.
- No title is presented as playable until a rights-cleared media manifest is connected.
