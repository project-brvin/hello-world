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

## ADR-012 — Describe the product as a hybrid decentralised streaming platform

**Decision:** gogoiTV's first release is a hybrid decentralised streaming platform, not a fully decentralised application.

**Decentralised component:**
- Video assets are content-addressed by IPFS CIDs.
- IPFS can locate providers through distributed routing and retrieve content from peers.
- Content can be replicated across independent pinning providers and IPFS nodes.
- Content identity is not tied to one fixed origin URL.

**Centralised or provider-dependent components in the first release:**
- The website/app shell is published through GitHub/Cloudflare.
- Application API routing and protected secrets use a Cloudflare Worker.
- Discovery metadata comes from TMDB.
- The first-release catalogue manifest is maintained in the Git repository.
- Browser playback uses public HTTP gateways, which are individual service operators and can become availability or performance dependencies.
- Optional R2 acceleration is a centralised edge/storage service.

**Reason:** This hybrid model prioritises a simple, fast, installable experience for ordinary mobile browsers while retaining IPFS as the canonical content-addressed media layer.

**Consequences:**
- Do not market the first release as "fully decentralised" or claim that every component is peer-to-peer.
- Describe it as "IPFS-powered" or "hybrid decentralised" and explain that app hosting, catalogue discovery and HTTP gateway access still depend on service providers.
- Multiple independent pinning providers and gateways reduce reliance on any one provider but do not eliminate all trust or availability dependencies.
- A future, separately scoped enhancement may evaluate a browser-native IPFS client such as Helia to retrieve content over peer-to-peer protocols without relying exclusively on HTTP gateways. This is not part of the initial MVP and must be tested for browser connectivity, performance, mobile data/battery use and user experience before adoption.
- Full decentralisation of catalogue updates, naming, discovery and application hosting would require additional design (for example, distributed naming/indexing and a community-operated content/provider ecosystem); it is not implied by using IPFS CIDs.

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


## ADR-013 — Versioned IPFS media manifest with rights-gated resolution

**Decision:** Maintain a versioned, static media manifest in `src/media-manifest.js`; use a Worker resolver to map a TMDB movie/TV ID to a validated IPFS asset. No database or media-byte proxy is added.

**Validation rules:** A v1 playable item must be active, have a unique TMDB type/ID mapping, a supported CID and safe relative path, an HLS master playlist or MP4 MIME/path match, a bounded VOD duration, HTTPS rights evidence, a supported rights basis, worldwide rights territory, and a valid rights verification window. Invalid or expired records are omitted. Unmatched titles are explicitly non-playable.

**Reason:** TMDB metadata and IPFS content addressing do not grant distribution rights. A server-side resolver prevents the frontend from treating arbitrary CIDs or guesses as authorised sources. Keeping the manifest static preserves the no-database first-release design.

**Consequences:** The first manifest is intentionally empty until a real rights-cleared asset is supplied, prepared and pinned. Browser gateway retrieval and playback remain separate milestones. v1 does not serve territory-limited rights; worldwide clearance is required until geographic entitlement enforcement is designed and tested.


## ADR-014 — Chrome-first WebTorrent P2P playback; transport-neutral authorised sources

**Date:** 2026-11-09  
**Status:** LOCKED TARGET ARCHITECTURE; implementation pending  
**Supersedes:** The transport choices in ADR-001, ADR-002 and ADR-003 where they conflict. Other decisions remain in force.

**Decision:** gogoiTV's primary viewer experience is direct playback in ordinary Chrome without a native torrent client or extension. The primary P2P playback transport to prototype is browser WebTorrent over WebRTC. IPFS remains a supported secondary content-addressed transport, not the sole canonical delivery mechanism. A transport-neutral, rights-gated static source registry replaces the assumption that every title must first be uploaded and pinned by the project operator.

**Reason:** The product goal is to let viewers receive authorised media from other participating computers without requiring the operator to upload every title. Browser WebTorrent is designed for browser-compatible WebRTC peers and progressive piece delivery.

**Non-negotiable technical constraints:**
- Browser WebTorrent peers cannot directly connect to ordinary BitTorrent TCP/µTP peers. They need compatible WebTorrent/WebRTC peers or a deliberately operated bridge.
- WebRTC tracker/signalling services help peers discover/connect; they do not host the media. This is an external availability and operational dependency.
- Browser seeding is best-effort while a page is open; browser closure, mobile suspension, NAT/firewalls and network policy can interrupt it.
- P2P availability and speed depend on live peers, upload capacity and piece availability. No peer/source means no stream.
- First vertical slice uses a rights-cleared progressive MP4 torrent. HLS-over-P2P and adaptive rendition packaging are later experiments, not assumed capabilities.
- The source registry admits only public-domain, creator-owned or explicitly licensed distribution sources. No public-torrent scraping, arbitrary magnet ingestion or unauthorised source discovery.
- Sharing is opt-in, visible and stoppable. Explain peer IP visibility; do not share watch history or unrelated local files.
- Worker remains control plane only; never proxy video bytes. No app database or mandatory account in the first release.

**Consequences:** Create `docs/P2P_ARCHITECTURE.md` as the implementation specification. Keep the existing IPFS manifest empty and do not deploy a guessed torrent hash or tracker configuration. Replace it with a transport-neutral rights-cleared registry before production P2P playback. The existing Worker/UI stay unchanged until a tested implementation batch is ready.

**Acceptance evidence:** Two independent Chrome sessions on different networks join a rights-cleared test swarm, start before full download, seek, survive a peer disconnect when another peer is available, and demonstrate opt-in sharing. Repeat on desktop Chrome and Android Chrome. Record startup, peer count, throughput, rebuffering, data usage and limitations.

**Trade-offs:** This better matches browser P2P but introduces WebRTC tracker/signalling, peer-availability and privacy complexity. It does not provide universal access to all internet computers or guarantee faster playback than a CDN.
