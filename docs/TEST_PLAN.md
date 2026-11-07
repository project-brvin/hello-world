# gogoiTV — Test and Release Plan

**Last updated:** 2026-11-07  
**Rule:** A feature is complete only when the test is run and the result is recorded.

## Test environments

- Local development with Wrangler.
- Deployed Cloudflare Worker / PWA.
- Current desktop Chrome-based browser.
- Android Chrome on a representative phone.
- Safari/iOS where a suitable device is available.
- Network profiles: fast Wi-Fi, ordinary mobile data, throttled/slow network and brief connectivity loss.

Record browser/device, date, test asset, network profile and result for important playback tests.

## M1 — Foundation

| Test | Expected result | Evidence/status |
|---|---|---|
| Cloudflare Worker upload | API accepted main/src/index.js; new version received 100% traffic | PASS — API/deployment control plane only |
| workers.dev subdomain | Enabled for gogoitv | PASS — Cloudflare settings |
| Worker observability | Logs enabled; traces enabled at 10% | PASS — Cloudflare settings |
| Open deployed root URL | App returns and renders | NOT VERIFIED — network/browser tool could not resolve/reach hostname |
| Request /api/health | Valid health JSON | NOT VERIFIED — network/browser tool could not resolve/reach hostname |
| Run local Wrangler preview | App starts with documented command | NOT RUN — pinned CLI not installed |
| Wrangler deploy dry-run | Bundle validates | NOT RUN — pinned CLI not installed |
| Browser console | No blocking runtime errors | NOT VERIFIED — requires browser access |
| Inline app shell size | HTML/CSS/JS served inside Worker response | 13,880 UTF-8 bytes; below 5 MB target |
| Full production bundle size | Final Wrangler build output | NOT MEASURED — dry-run/build pending |

## M2 — TMDB discovery

| Test | Expected result | Evidence/status |
|---|---|---|
| Worker secret configured | TMDB_API_READ_ACCESS_TOKEN exists as secret_text binding | PASS — Cloudflare secret list confirms binding exists; value remains hidden |
| Live homepage shelves | Movie and series tiles render from TMDB | USER-CONFIRMED PASS — user reports tiles now appear |
| Search/details/genres/error states | All expected responses and fallbacks | PENDING — not independently exercised in this session |
| Credential exposure | No token in frontend/source/query strings | REVIEW PENDING |
| TMDB attribution/logo | Attribution visible and logo loads | BROWSER REVIEW PENDING |

## M3 — Content and IPFS

| Test | Expected result | Evidence/status |
|---|---|---|
| Manifest endpoint | Returns schema/version/count and a valid items array | DEPLOYED; public HTTP check pending |
| Empty manifest behaviour | Count is 0; no title is assumed playable | EXPECTED initial state; verify in browser |
| Unmapped TMDB title | Resolver returns playable:false and NO_RIGHTS_CLEARED_SOURCE | DEPLOYED; public HTTP check pending |
| Invalid resolver parameters | HTTP 400 with INVALID_PARAMS | DEPLOYED; public HTTP check pending |
| Rights/CID/path validation | Invalid, expired, duplicate or non-worldwide records are excluded | Implemented; requires fixture-based runtime tests |
| Real authorised content | At least one TMDB mapping resolves to a real pinned CID/path | BLOCKED — no rights-cleared test asset supplied/published |
| Multi-gateway retrieval | Same asset is retrievable through two independent gateways | BLOCKED — requires a real pinned asset; M5 selection is not implemented yet |

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

**Implementation status:** Initial feature slice deployed; live API verification blocked pending secret configuration.

### Configuration
- Cloudflare secret name: `TMDB_API_READ_ACCESS_TOKEN`.
- Secret must be added through Wrangler's secure prompt or the Cloudflare dashboard.
- Never place the token in Git, browser code, query strings or chat messages.
- Current Cloudflare secret-list response showed no Worker secrets configured.

### Endpoint tests (run after secret is configured)

| Test | Expected result | Status |
|---|---|---|
| `GET /api/catalog/trending?type=all&window=week` | Trending payload with results | BLOCKED — token missing |
| `GET /api/catalog/popular?type=movie` | Popular movies | BLOCKED — token missing |
| `GET /api/catalog/popular?type=tv` | Popular series | BLOCKED — token missing |
| `GET /api/catalog/search?q=...` | Matching movie/TV results | BLOCKED — token missing |
| `GET /api/catalog/details?type=movie&id=...` | Detail, credits and videos | BLOCKED — token missing |
| `GET /api/catalog/genres?type=movie` | Genre list | BLOCKED — token missing |
| `GET /api/catalog/discover?type=movie&genre=...` | Genre-filtered titles | BLOCKED — token missing |
| Missing token behaviour | HTTP 503 with TMDB_NOT_CONFIGURED | Implemented; runtime check pending |
| Invalid query/id/type | HTTP 400 with safe error | Implemented; runtime check pending |

### UI tests (run after secret is configured)
- Home shelves render real trending, popular movies and series.
- Search results show movie and TV entries only.
- Detail modal shows synopsis, metadata, backdrop and cast where supplied.
- Genre chips load and return filtered titles.
- My List persists on the current browser/device after reload.
- TMDB attribution notice is visible; approved logo asset is loaded and not more prominent than gogoiTV.
- No title is presented as playable until a rights-cleared media manifest is connected.
