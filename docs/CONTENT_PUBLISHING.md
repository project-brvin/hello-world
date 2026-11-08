# gogoiTV — Rights-cleared IPFS publishing guide

This document describes the v1 publishing path. gogoiTV is a hybrid decentralised VOD platform: TMDB supplies metadata, while this separate manifest decides whether a title has an authorised media source.

## Important rules

- Only add a title when you own the media, it is public domain in the territories where gogoiTV operates, or you have a licence that explicitly permits the distribution and streaming you plan to provide.
- A TMDB result, trailer, search result, magnet link or CID is **not** proof of distribution rights.
- The v1 Worker only publishes entries marked `active: true` with `rights.status: "cleared"`, an HTTPS evidence URL, a `verifiedAt` timestamp and `territories: ["worldwide"]`.
- Territory-limited rights are not accepted by this first global manifest. Do not add them until territory enforcement exists.
- One active media entry per TMDB `type + id` is supported in v1.
- Use VOD assets only. No unauthorised torrents, magnet links, live TV or sports restreams.

## Investigated first-title candidate — NOT YET APPROVED FOR THE ACTIVE MANIFEST

**Big Buck Bunny** is a promising rights-cleared candidate, but its IPFS copy must pass retrieval and completeness checks before it is published.

| Field | Investigated value | Evidence/status |
|---|---|---|
| Title | Big Buck Bunny (2008) | Official Blender project and TMDB entry |
| TMDB mapping | `type: "movie"`, `id: 10378` | [TMDB movie page](https://www.themoviedb.org/movie/10378-big-buck-bunny) |
| Rights basis | `licensed` — Creative Commons Attribution 3.0 Unported (CC BY 3.0) | [Official Blender project rights statement](https://peach.blender.org/about/) |
| Licence terms | Worldwide, royalty-free, non-exclusive, perpetual licence that permits reproduction, distribution and public performance, subject to the licence conditions | [CC BY 3.0 legal code, section 3](https://creativecommons.org/licenses/by/3.0/legalcode) |
| Candidate media | HLS, `master.m3u8` | [IPFS HLS demo identifies this CID as Big Buck Bunny](https://ipfsvideo.cc/?hash=QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K&title=Big%20Buck%20Bunny); [a separate player example loads the same CID and `master.m3u8`](https://codepen.io/ipfs/pen/XyVXRN) |
| Candidate CID | `QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K` | CID/path identity is candidate evidence only; not a pinning or availability guarantee |
| Candidate path | `master.m3u8` | Not yet retrieved/inspected by this project |
| Duration | **Unverified for this IPFS rendition** | Public references differ: TMDB lists 8 minutes, Blender Studio lists 9:56, and a Wikimedia 4K encode is 10:35. Sum the actual playlist's `#EXTINF` durations or inspect the exact asset; do not copy a catalogue runtime into the manifest. |
| Pinning provider/retention | Unknown | The third-party demo does not identify an accountable pinning provider or retention commitment |

### Rights and attribution conditions

- Blender's project page says the Peach open movie is released under CC BY 3.0, permits redistribution including commercial use with attribution, and requires the full credits roll when the entire film is screened or broadcast. Keep that original credits roll intact in the candidate rendition.
- The CC BY 3.0 legal code grants worldwide distribution/public-performance rights, but attribution and licence-link conditions still apply. Include the Blender Foundation credit and link to the licence; do not use excluded Blender/Creative Commons logos or imply endorsement.
- The public rights evidence URL to use in the eventual manifest is `https://peach.blender.org/about/`; the licence link is `https://creativecommons.org/licenses/by/3.0/`.

### Current gateway probe — 2026-11-09

- A headless Cloudflare Browser Rendering request to the candidate `ipfs.io` URL received origin HTTP 403 and a Cloudflare “Just a moment…” challenge page, not an HLS playlist. This is a bot/challenge response to the inspection browser, **not evidence that the CID is absent or broken**.
- A follow-up request through `dweb.link` was blocked by HTTP 429 from the Cloudflare Browser Rendering inspection API itself. No origin status was obtained for that gateway.
- No gateway retrieval pass is claimed. Test both gateway URLs in a normal browser and inspect the playlist plus every referenced segment.

### Required checks before publishing

1. Open the candidate playlist through at least two independent gateways, for example:
   - [ipfs.io gateway](https://ipfs.io/ipfs/QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K/master.m3u8)
   - [dweb.link gateway](https://dweb.link/ipfs/QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K/master.m3u8)
   - [Pinata public gateway](https://gateway.pinata.cloud/ipfs/QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K/master.m3u8)
2. Verify that every playlist rendition/segment is retrievable and that the HLS source is the complete film with the required credits roll, not a preview or shortened edit.
3. Record the exact playlist duration, codecs, resolutions, audio/subtitle tracks, and successful gateway responses.
4. Pin the verified content under an account or provider the project operator controls; record the provider, retention responsibility, current pricing/limits and how pin health will be monitored.
5. Only then add an `active: true` item for TMDB movie 10378. Until every check passes, keep `src/media-manifest.js` empty and the title non-playable.

## Publishing workflow

1. **Confirm the rights.** Keep a record of the licence, public-domain determination or creator permission. Put a public HTTPS URL to suitable evidence in `rights.evidenceUrl`; do not put private contracts or personal data in the public manifest.
2. **Prepare a browser-compatible rendition.** Prefer an HLS master playlist (`.m3u8`) when multiple quality renditions are available. A single MP4 (`.mp4`) is the compatibility option. The HLS playlist and every referenced segment, key and subtitle must be part of the same IPFS content tree or otherwise have a separately designed manifest mapping.
3. **Upload and pin the content to IPFS.** Use a reputable pinning provider's website or an operator-controlled IPFS node. Keep the CID and relative path. Pinning and gateway availability are separate from rights.
4. **Edit `src/media-manifest.js` in GitHub.** Add a manifest item to the `items` array. Use the exact TMDB media type and numeric ID, a valid CID and the relative path to the master playlist or MP4.
5. **Commit and deploy the Worker.** A manifest change is not live until a new Worker version is deployed. Preserve the existing `TMDB_API_READ_ACCESS_TOKEN` secret binding when creating the version.
6. **Verify both endpoints.** Open `/api/media/manifest` and `/api/media/resolve?type=movie&id=TMDB_ID` (or `type=tv`). A title without an authorised mapping must return `playable: false`.

## Manifest example

The following is a **shape example only**, not real content. Replace every placeholder with actual verified information; never deploy placeholder CIDs or invented rights evidence.

```js
{
  id: "your-content-slug",
  active: true,
  title: "Actual authorised title",
  tmdb: { type: "movie", id: 12345 },
  rights: {
    status: "cleared",
    basis: "licensed", // public-domain | creator-owned | licensed
    evidenceUrl: "https://rights-holder.example/authorisation",
    territories: ["worldwide"],
    verifiedAt: "2026-11-07T00:00:00.000Z"
  },
  media: {
    protocol: "hls", // hls | mp4
    cid: "bafy...replace-with-real-cid",
    path: "master.m3u8",
    mimeType: "application/vnd.apple.mpegurl",
    durationSeconds: 5400,
    audioLanguages: ["en"],
    subtitles: []
  }
}
```

For MP4, use `protocol: "mp4"`, `path: "video.mp4"` and `mimeType: "video/mp4"`. CIDv0 and base32 CIDv1 identifiers are accepted. Paths must be relative, use safe ASCII segments and must not contain `.` or `..` traversal segments, query strings or fragments. Duration must be between 1 second and 24 hours.

The Worker validates entries at request time. Invalid entries, expired rights windows, duplicate active TMDB mappings and entries without worldwide clearance are excluded from the public manifest.

## API

- `GET /api/media/manifest` — returns the validated, versioned media manifest and count.
- `GET /api/media/resolve?type=movie&id=12345` — maps a TMDB movie to an authorised media item.
- `GET /api/media/resolve?type=tv&id=12345` — maps a TMDB series to an authorised media item.

These endpoints do not require the TMDB secret. Unmapped titles return `200` with `playable: false`; this is an intentional distinction between discoverable metadata and authorised playable media.

The manifest resolver returns an `ipfs://` URI. Browser gateway selection and actual HLS/MP4 playback are separate M4/M5 milestones and are not claimed to work yet.
