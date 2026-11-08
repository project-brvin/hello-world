# gogoiTV — Chrome-first peer-to-peer architecture

**Decision status:** Locked target architecture; implementation not yet delivered  
**Decision date:** 2026-11-09  
**Scope:** First public browser playback release

## Product outcome

A viewer opens gogoiTV in ordinary Google Chrome, chooses a rights-cleared title and presses Play. Playback happens inside the page. No desktop torrent client, browser extension, account or installation is required. gogoiTV does not need to own or upload every movie.

This is a **browser-first peer-assisted streaming platform**, not a promise that every title on the public internet is discoverable or always online.

## System architecture

\`\`\`text
Chrome / PWA
  ├─ UI, catalogue, local watchlist/progress
  ├─ WebTorrent browser client (WebRTC peers)
  │    ├─ fetch pieces progressively for playback
  │    └─ optional opt-in piece sharing while page is open
  ├─ IPFS client/gateway adapter (secondary transport / content-addressed source)
  └─ direct authorised HTTPS source (explicit fallback only)

Cloudflare Worker
  ├─ TMDB metadata proxy (metadata only)
  ├─ signed/static source-catalogue delivery
  ├─ rights and source-resolution API
  └─ health/diagnostics; never proxies video bytes

GitHub
  └─ versioned static source registry and rights evidence references

External WebRTC trackers/signalling
  └─ help compatible browser peers discover/connect; not a video host
\`\`\`

## Locked decisions

1. **Chrome-only playback is the primary UX.** Playback must work in a current desktop and Android Chrome without requiring a native torrent app or extension.
2. **WebTorrent/WebRTC is the primary P2P playback experiment and target transport.** Use a browser-compatible WebTorrent client and compatible WebRTC peers. Browser peers can progressively fetch pieces and may share pieces with other viewers when the user opts in.
3. **IPFS remains supported, but is no longer assumed to be the sole or automatically available source for every title.** IPFS provides content addressing and peer/block retrieval; a CID is not a movie directory, rights grant, availability guarantee or universal catalogue. Use an IPFS adapter as an additional source transport after the browser P2P vertical slice.
4. **No automatic public-torrent scraping or arbitrary magnet ingestion.** The source registry contains only rights-cleared titles and source identifiers whose distribution is authorised. A TMDB result alone never makes a title playable.
5. **No media bytes through the Worker.** The Worker provides metadata, registry and coordination APIs only. Browser clients connect to peers or approved external origins directly.
6. **No application database in the initial release.** Keep a versioned static registry in Git; use browser-local storage for watchlist, preferences and playback progress. Tracker infrastructure is a signalling dependency, not a catalogue database.
7. **No mandatory account.** Peer sharing is opt-in, visible and controllable. A viewer can watch without seeding; sharing stops when the page/session closes unless a future separately reviewed native seeder is introduced.
8. **No claim of universal peer availability.** If no compatible peer/source is online, show a clear unavailable state or use an explicitly authorised fallback. Do not imply that every computer on the internet automatically shares every movie.
9. **No unlimited-free promise.** WebRTC trackers, bootstrap/signalling, metadata, gateways, bandwidth and optional infrastructure have costs/limits. Measure and document them.
10. **HLS is not assumed to work over a single torrent automatically.** The first P2P playback slice should use a browser-supported progressive MP4 file. Later evaluate HLS segment packaging / torrent-per-rendition or a compatible streaming protocol with real seeking and ABR tests.

## Critical browser compatibility facts

- Ordinary BitTorrent TCP/µTP peers are not directly reachable from browser JavaScript. Browser WebTorrent uses WebRTC and requires compatible WebTorrent peers or a deliberate bridge.
- Browser peer discovery needs WebRTC tracker/signalling infrastructure and correct HTTPS/WSS, CORS and network behaviour. Trackers coordinate peers; they do not host video.
- Browser-based seeding is best-effort while the page is open. Sleeping tabs, mobile battery management, browser closure, NAT/firewalls and restrictive networks can stop sharing.
- P2P speed depends on peer count, peer upload capacity, piece availability, device/network conditions and codec support. P2P can be slower than a CDN when the swarm is small.
- Chrome supports the required browser APIs in principle, but the exact client/library version, codecs, MSE path, Android behaviour, range/seek and WebRTC connectivity must be verified on real Chrome devices before promising production readiness.

## Source registry model

Each playable title must have:
- stable source ID and title/TMDB type+ID;
- explicit rights basis, public HTTPS evidence, territories, verification date and any expiry;
- source transport (WebTorrent, IPFS, or approved HTTPS);
- source locator (for WebTorrent: info hash / torrent metadata reference; for IPFS: CID + relative path; for HTTPS: approved URL);
- file/rendition metadata (name, MIME, exact size, duration, codec where known);
- source verification timestamp and operational notes.

Never put private contracts, credentials, tracker secrets or personal data in the public registry. Do not publish a playable source until rights and technical checks pass. A source locator is not proof of rights or availability.

## Playback selection and fallback

1. Resolve title metadata to an authorised registry record.
2. Validate rights status and supported transport.
3. Prefer a compatible active WebTorrent swarm for a registered WebTorrent source.
4. If unavailable or unhealthy, try the registered IPFS source or approved direct HTTPS mirror only if the registry explicitly includes it.
5. Race only a small number of approved sources; measure first-frame time, throughput, errors and peer counts.
6. If all sources fail, show a useful unavailable/retry state. Never silently substitute an unverified source.

## Privacy and abuse controls

- Peer sharing is off until the user enables it; explain that their IP address is visible to peers as a normal consequence of P2P networking.
- Do not expose watch history, account identifiers or personal metadata to peers.
- Do not upload arbitrary files from the user's device. Share only pieces of the currently selected, authorised media source.
- Add per-session upload/download limits, a stop-sharing control and conservative mobile defaults.
- Avoid turning the Worker into a tracker, proxy or central media relay.
- Do not build a general-purpose public torrent search engine.

## What this means for current work

- Keep the deployed TMDB Worker and current UI; no production code or deployment is changed by this architecture decision alone.
- Keep the existing IPFS manifest empty until a verified rights-cleared asset is available. It is a legacy transport-specific manifest and will be replaced by a transport-neutral source registry before P2P production playback.
- Big Buck Bunny remains a legal test candidate; the rejected empty demo CID remains retired. It may be used only after a fresh authorised source is verified.
- Pinata folder upload is no longer the prerequisite for proving the product architecture. A controlled WebTorrent test source can validate browser P2P playback first.
- Do not add tracker credentials, source hashes or guessed torrent metadata to production until the test source's rights and connectivity are confirmed.

## Milestone exit rule

A prototype is not complete because a torrent can be parsed. The acceptance test is: two independent Chrome browser sessions can join a rights-cleared test swarm, start playback before the entire file downloads, seek, recover from a peer disconnect where another peer exists, and demonstrate opt-in sharing. Test desktop Chrome and Android Chrome on different networks. Record measured results and limitations.

## References

- WebTorrent project: https://webtorrent.io/
- WebTorrent browser documentation: https://webtorrent.io/docs
- WebTorrent GitHub: https://github.com/webtorrent/webtorrent
- IPFS concepts: https://docs.ipfs.tech/concepts/how-ipfs-works/
- Chrome WebRTC overview: https://developer.chrome.com/docs/capabilities/webrtc
