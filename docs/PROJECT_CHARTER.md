# gogoiTV — Project Charter

**Status:** Approved product direction  
**Last updated:** 2026-11-07  
**Audience:** Gen Z students and everyday viewers  
**Category:** Video-on-demand discovery and playback PWA

## 1. Product vision

Build a streaming experience that makes people say:

> "Where has this website been? It looks premium, costs me nothing, has no ads, and is genuinely easy to watch on."

The technology should stay invisible. People should not need to understand IPFS, CIDs, gateways, HLS, pinning or edge caching. They should open gogoiTV, discover something good, press Play and get a dependable experience.

## 2. Product promise

The product will aim to provide:
- No advertisements in the product experience.
- No mandatory account for the first release.
- Free viewer access at launch.
- Fast discovery and fast playback start.
- Adaptive playback that responds to device and network conditions.
- A polished, responsive, installable PWA.
- Clear handling when content is unavailable.

"Free to viewers" is a product policy, not a guarantee that the operator has zero costs forever. Free-tier quotas, pinning, storage, metadata services and traffic limits must be monitored. Do not promise unlimited capacity or absolutely zero buffering.

## 3. Product principles, in priority order

1. **Playback reliability:** a beautiful catalogue is not useful if Play does not work.
2. **Fast first frame:** minimise time between pressing Play and seeing the first frame.
3. **Effortless discovery:** browse, search by title, filter and eventually describe a mood or request in natural language.
4. **No interruptions:** no ads, intrusive popups or unnecessary registration gates.
5. **Mobile-first quality:** design and test for ordinary Android phones and variable student mobile networks, then desktop and iOS.
6. **Honest status:** distinguish metadata availability, gateway reachability, pinning evidence and actual playback health.
7. **Lean infrastructure:** avoid a self-managed video origin, application database and always-on server in the initial release.
8. **Legal content:** only distribute media for which gogoiTV has the right to do so.

## 4. Target experience

### First visit
- Home page loads quickly and has useful content immediately.
- Visual hierarchy is cinematic and easy to scan.
- Users can explore without registering.
- Search is prominent and responsive.

### Discovery
- Featured content, trending/popular rows, genres and useful collections.
- Detail view with synopsis, release information, rating and artwork.
- Clear distinction between catalogue metadata and whether a playable, authorised source exists.

### Playback
- One obvious Play action.
- Adaptive HLS where an HLS rendition exists.
- MP4 fallback for supported direct-file assets.
- Quality selection, subtitles when available, seeking, volume, full-screen and keyboard support.
- Retry and source switching when a gateway or rendition fails.
- Low-data mode and restrained preloading.

### Return visit
- Locally saved watchlist and continue-watching state.
- No account required for local state.
- Offline support for the application shell only in the first release; do not cache video offline unless rights explicitly permit it.

## 5. Locked first-release scope

### Included
- PWA shell and installability.
- TMDB-backed metadata discovery and title search.
- Curated, rights-cleared content manifest mapping catalogue records to IPFS CIDs and media paths.
- IPFS gateway racing and failover.
- HLS-first adaptive player with MP4 compatibility.
- Local watchlist and playback progress.
- Responsive, accessible streaming interface.
- Basic operational and playback diagnostics.

### Deferred until the core works
- Natural-language AI search and mood-based discovery.
- Cross-device accounts and cloud sync.
- Social/watch-party features.
- Behavioural recommendation profiles.
- Offline video downloads.
- Live TV, live sports and restreaming.
- Large-scale open upload platform.

## 6. Explicit non-goals

- Recreating Netflix's licensed catalogue.
- Finding or indexing unauthorised copies, magnet links or piracy sources.
- Guaranteeing that every TMDB title has a playable stream.
- Guaranteeing zero buffering on every device, ISP or gateway.
- Guaranteeing unlimited free hosting, pinning or bandwidth.
- Running an always-on video server or full IPFS node for the initial release.

## 7. Technical constraints

- Keep the shipped frontend below the 5 MB target from the source specification; measure the real production build.
- No application database in the first release.
- Keep TMDB credentials in Cloudflare Worker secrets, never in frontend code or Git.
- Keep video bytes off the Worker request path. Browsers fetch media directly from approved origins/gateways, subject to CORS and range support.
- Do not assume public gateways support every media format, byte ranges, CORS or sustained throughput.
- Check current provider plans, free-tier allowances and terms before release.

## 8. Definition of product success

**A user searches a real title, opens its details, presses Play, and watches a rights-cleared asset referenced by an IPFS CID using adaptive or compatible playback, with a graceful recovery path if the first gateway fails.**

This flow must work on a representative Android phone and a normal, imperfect network before the MVP is called ready.


## 9. Updated locked playback architecture — 2026-11-09

This section supersedes any earlier statement that every title must first be uploaded and pinned by the project operator or that IPFS alone is the primary playback transport.

- **Viewer promise:** anyone with a supported current Google Chrome browser can open gogoiTV and watch in-page, without a desktop torrent app, extension or installation.
- **Primary P2P transport:** browser WebTorrent over WebRTC, using compatible browser peers and progressive media-piece delivery.
- **IPFS:** retained as an additional content-addressed source transport. It is not assumed to automatically contain or discover every film.
- **Source registry:** versioned, static, transport-neutral, and rights-gated. It records approved WebTorrent, IPFS and explicitly approved HTTPS sources. No application database is required initially.
- **No operator upload requirement for every title:** a title can be served by authorised participating peers. The project still needs a lawful source and a compatible peer/provider for that title.
- **Chrome limitation:** ordinary BitTorrent TCP/µTP peers are not directly browser-compatible. WebTorrent peers need WebRTC support or a deliberate bridge. Browser sharing is best-effort while the page is active.
- **Fallback:** use only other sources explicitly registered and rights-cleared. If no compatible source is online, show unavailable; never silently search for unauthorised copies.
- **Privacy:** P2P sharing is opt-in, visible and stoppable. Explain that peer IP addresses are visible to other peers.
- **First implementation target:** progressive MP4 P2P playback in desktop Chrome, then Android Chrome. HLS/ABR over P2P is a later research milestone.

Detailed specification: [P2P architecture](P2P_ARCHITECTURE.md).
