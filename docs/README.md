# gogoiTV Project Handbook

This directory is the durable source of truth for the gogoiTV product direction, architecture, milestones, verification criteria and session handoff.

## Start here

1. [Project charter](PROJECT_CHARTER.md) — vision, non-negotiables, scope and constraints.
2. [Milestone roadmap](ROADMAP.md) — delivery plan, statuses, deliverables and exit criteria.
3. [Architecture decisions](ARCHITECTURE_DECISIONS.md) — technical choices locked for the first release.
4. [Test and release plan](TEST_PLAN.md) — how milestones are verified.
5. [Content publishing guide](CONTENT_PUBLISHING.md) — how to add rights-cleared IPFS media.
6. [Progress log](PROGRESS_LOG.md) — implemented work, verified evidence, blockers and next action.
7. [New-chat handoff prompt](SESSION_HANDOFF.md) — copy/paste instructions to resume work.

## Current snapshot

- Product: a no-ad, student-friendly, mobile-first video-on-demand discovery and playback PWA.
- Delivery: IPFS is the canonical content source; HLS is preferred for adaptive playback; MP4 is the compatibility path.
- Application: static frontend plus Cloudflare Worker for API routing and protected secrets.
- Data: no application database in the first release; use a versioned static catalogue manifest and browser-local state.
- Acceleration: optional R2/edge-cache path for authorised popular assets, evaluated only after IPFS playback works.
- Content: only public-domain, creator-owned or properly licensed media.
- Worker: `gogoitv` v0.3.0 is active at 100% traffic (version `34c75251-aa1c-4ef1-9e5a-1bce997dfb07`; deployment `11c85ccc-ed72-43fa-a018-dd3250eb87a0`); the `TMDB_API_READ_ACCESS_TOKEN` secret binding remains present.
- Live checks on 2026-11-09: Cloudflare Browser Rendering observed HTTP 200 for the homepage, health, popular-movie and movie-genre endpoints; the homepage rendered live TMDB shelves. The health response reported `tmdbConfigured: true` and manifest count 0. The invalid media-resolver test returned the expected HTTP 400 `INVALID_PARAMS`. The user independently confirmed the manifest and unmapped-resolver endpoints display the expected JSON.
- Runtime caveat: some additional Browser Rendering requests were rate-limited by the inspection API itself; search/detail/TV-genre/discovery and some error paths remain unverified, not failed.
- Status: M0/M1 complete; M2 partial (homepage and selected APIs verified; remaining search/detail/error/attribution review open); M3 in progress (manifest/resolver deployed and empty; first rights-cleared IPFS candidate researched but not yet gateway/pinning verified or playable).

## Documentation maintenance rule

After every meaningful implementation batch:
- Update milestone status in ROADMAP.md.
- Add a dated entry to PROGRESS_LOG.md.
- Record changed architecture decisions in ARCHITECTURE_DECISIONS.md.
- Update verification evidence in TEST_PLAN.md.
- Keep SESSION_HANDOFF.md aligned with the actual next action.

A milestone is not complete because code was written. It is complete only when its exit criteria have been tested and evidence recorded.
