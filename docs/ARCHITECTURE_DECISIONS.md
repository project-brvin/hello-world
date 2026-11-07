# gogoiTV — Architecture Decision Records

**Status:** Locked baseline for the first release  
**Last updated:** 2026-11-07

This file records decisions that should not be silently changed. A reversal requires a new dated decision with rationale, trade-offs and migration impact.

## System shape

    Browser / PWA
      ├── Cloudflare Worker: app APIs, metadata orchestration, secrets
      ├── TMDB: catalogue metadata and artwork
      ├── Static versioned manifest: TMDB ID → authorised media CID/path
      ├── IPFS gateways: playlists, segments and/or direct media
      └── Browser storage: watchlist, preferences, playback progress

    Optional later acceleration:
      rights-cleared popular media → R2 hot mirror / edge cache
      IPFS remains the canonical content-addressed source of record.

## ADR-001 — IPFS is the canonical media source

**Decision:** Use IPFS CIDs for canonical locations of rights-cleared media assets.

**Reason:** This follows the selected Option 3 direction and avoids operating a traditional always-on video origin.

**Consequences:**
- Video must be published to IPFS and pinned by a provider or node.
- A CID alone does not guarantee availability.
- Gateways differ in latency, CORS, Range support and throughput.
- The product needs unavailable-content handling and gateway fallback.

## ADR-002 — Do not use WebTorrent as the primary player

**Decision:** WebTorrent is not part of the primary playback path.

**Reason:** Browser WebTorrent relies on WebRTC-compatible peers. Peer availability is unpredictable and introduces a second delivery model.

**Consequence:** Do not implement magnet-link ingestion, trackers or WebTorrent as the first-release playback path. Reconsider only through a separate decision for a clear, rights-compliant use case.

## ADR-003 — Prefer HLS adaptive playback; retain MP4 compatibility

**Decision:** HLS is preferred when multiple renditions are prepared. Direct MP4 is a compatibility path.

**Reason:** Adaptive renditions can respond to network/device capacity. A single high-bitrate 4K file is unsuitable for every student connection.

**Consequences:**
- HLS playlists and referenced segments must be published and pinned.
- Support native HLS where available and a compatible JavaScript/MSE path where supported.
- MP4 seeking depends on correct HTTP Range and cross-origin behaviour.
- Codec compatibility must be tested, not assumed.

## ADR-004 — Worker is an API/control layer, not the video pipe

**Decision:** Worker serves app/API requests, protects secrets, normalises metadata and returns structural data. Browser playback fetches directly from an approved media origin or IPFS gateway.

**Reason:** Proxying all video bytes through a Worker adds a bottleneck and consumes request/compute allowances.

**Consequence:** Do not send large or long-lived media responses through the Worker by default.

## ADR-005 — Gateway tests are viewer-side and multi-signal

**Decision:** Run bounded gateway probes in the viewer's browser. Consider response time, status and Range support, not latency alone.

**Reason:** A Worker-side probe measures the Worker location's network path, which can differ from the viewer's. A browser probe is more representative of the device that will play the media.

**Consequences:**
- Use small requests and timeouts.
- Check CORS and Range behaviour.
- A successful probe does not prove sustained throughput or permanent pinning.
- Re-test or switch on meaningful playback failure, not every minor fluctuation.

## ADR-006 — Optional edge acceleration, not a mandatory R2 dependency

**Decision:** Keep IPFS as canonical source. Evaluate R2 as an optional hot mirror/cache for popular, rights-cleared assets after the IPFS path works.

**Reason:** A hybrid path may improve predictability for popular content without making R2 mandatory from day one.

**Consequences:**
- Verify current pricing, cache semantics, Range support, CORS and plan limits first.
- Any mirrored asset must remain rights-cleared.
- Catalogue may resolve an approved accelerated source and fall back to IPFS.
- Do not claim this makes operation unlimited or cost-free.

## ADR-007 — No application database in the first release

**Decision:** Use a version-controlled static catalogue manifest and browser-local state.

**Reason:** Avoid a managed database and keep the architecture small.

**Consequences:**
- Catalogue changes are published with code/data deployments.
- Watchlist and playback progress are local to the current browser/device.
- Cross-device sync and accounts are deferred because they require a trusted synchronisation/storage design.

## ADR-008 — TMDB is metadata, never the video source

**Decision:** Use TMDB for search, discovery, descriptions, artwork and related metadata only.

**Reason:** Metadata does not grant rights to distribute the underlying title.

**Consequences:**
- A TMDB result is playable only when a separate authorised manifest entry exists.
- Keep TMDB credentials in Worker secrets.
- Review current TMDB attribution, branding and API terms before public release.

## ADR-009 — Adaptive, memory-aware buffering

**Decision:** Do not implement a fixed rule to download 60 seconds into JavaScript memory.

**Reason:** This may waste mobile data and memory, especially on lower-memory phones. Use the browser media pipeline and controlled buffering instead.

**Consequences:**
- Use adaptive bitrate and bounded buffer settings where supported.
- Preload metadata or a small initial amount rather than large upcoming segments.
- Measure startup time, rebuffer ratio and data consumption.

## ADR-010 — PWA offline support is shell-first

**Decision:** Cache the app shell, icons and safe static resources. Do not cache video for offline playback in the first release.

**Reason:** Shell caching improves launch resilience without unbounded storage, rights or data-consumption problems.

**Consequences:**
- Watchlist/preferences/progress may use browser-local storage.
- Offline video is deferred and requires explicit rights, storage management and user controls.

## ADR-011 — Rights-cleared VOD only

**Decision:** Only public-domain, creator-owned or properly licensed media may be catalogued. No live TV or sports restreaming in the first release.

**Reason:** The product must be lawful and sustainable; the supplied specifications describe VOD rather than live restreaming.

**Consequences:**
- Record rights/source evidence for every playable asset.
- Do not build scrapers or features to locate unauthorised streams, torrents or magnet links.
- A metadata entry without an authorised media source remains non-playable.

## Change procedure

When a decision changes, append a new ADR with ID/date, previous and new decision, reason/evidence, trade-offs, security/cost implications and migration plan.
