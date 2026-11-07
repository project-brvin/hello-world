# gogoiTV — Rights-cleared IPFS publishing guide

This document describes the v1 publishing path. gogoiTV is a hybrid decentralised VOD platform: TMDB supplies metadata, while this separate manifest decides whether a title has an authorised media source.

## Important rules

- Only add a title when you own the media, it is public domain in the territories where gogoiTV operates, or you have a licence that explicitly permits the distribution and streaming you plan to provide.
- A TMDB result, trailer, search result, magnet link or CID is **not** proof of distribution rights.
- The v1 Worker only publishes entries marked `active: true` with `rights.status: "cleared"`, an HTTPS evidence URL, a `verifiedAt` timestamp and `territories: ["worldwide"]`.
- Territory-limited rights are not accepted by this first global manifest. Do not add them until territory enforcement exists.
- One active media entry per TMDB `type + id` is supported in v1.
- Use VOD assets only. No unauthorised torrents, magnet links, live TV or sports restreams.

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
