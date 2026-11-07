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
- Worker: gogoitv; M1 homepage/health and current live movie/series shelves are user-confirmed.
- Status: M0/M1 complete; M2 partial (live shelves confirmed; fuller endpoint and error-path tests pending); M3 in progress (manifest/schema/resolver deployed, but no playable assets yet).

## Documentation maintenance rule

After every meaningful implementation batch:
- Update milestone status in ROADMAP.md.
- Add a dated entry to PROGRESS_LOG.md.
- Record changed architecture decisions in ARCHITECTURE_DECISIONS.md.
- Update verification evidence in TEST_PLAN.md.
- Keep SESSION_HANDOFF.md aligned with the actual next action.

A milestone is not complete because code was written. It is complete only when its exit criteria have been tested and evidence recorded.
