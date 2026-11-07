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

- Trending/popular endpoints return valid results.
- Search handles normal query, empty query, no results, rate limit and upstream failure.
- Detail panel shows correct item and image fallbacks.
- TMDB credential is absent from built JS, HTML, Git-tracked source and browser query strings.
- Attribution and current API terms are reviewed.

## M3 — Content and IPFS

- Manifest validates against its schema.
- TMDB ID maps to an authorised asset, not merely an arbitrary CID.
- CID/path opens on configured gateways where supported.
- Missing CID, invalid path, unavailable pin and unsupported file are reported as unavailable.
- Rights/source evidence is recorded for every playable test asset.

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
