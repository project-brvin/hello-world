# gogoiTV — Rights-cleared IPFS publishing guide

This document describes the v1 publishing path. gogoiTV is a hybrid decentralised VOD platform: TMDB supplies metadata, while this separate manifest decides whether a title has an authorised media source.

## Important rules

- Only add a title when you own the media, it is public domain in the territories where gogoiTV operates, or you have a licence that explicitly permits the distribution and streaming you plan to provide.
- A TMDB result, trailer, search result, magnet link or CID is **not** proof of distribution rights.
- The v1 Worker only publishes entries marked `active: true` with `rights.status: "cleared"`, an HTTPS evidence URL, a `verifiedAt` timestamp and `territories: ["worldwide"]`.
- Territory-limited rights are not accepted by this first global manifest. Do not add them until territory enforcement exists.
- One active media entry per TMDB `type + id` is supported in v1.
- Use VOD assets only. No unauthorised torrents, magnet links, live TV or sports restreams.

## First-title rights candidate — Big Buck Bunny; old demo CID rejected

Big Buck Bunny remains a viable first title on rights grounds. **Do not use the third-party demo IPFS CID below.**

| Field | Current value | Evidence/status |
|---|---|---|
| Title | Big Buck Bunny (2008) | Blender Foundation open movie |
| TMDB mapping | `type: "movie"`, `id: 10378` | [TMDB movie page](https://www.themoviedb.org/movie/10378-big-buck-bunny) |
| Rights basis | `licensed` — CC BY 3.0 Unported | [Official Blender rights statement](https://peach.blender.org/about/) |
| Rights conditions | Worldwide distribution/public performance allowed subject to attribution and licence conditions; keep the complete original credits roll when showing the entire film | [CC BY 3.0 legal code, section 3](https://creativecommons.org/licenses/by/3.0/legalcode) |
| Official source | 720p H.264 MOV | [Blender official download page](https://peach.blender.org/download/) links to the old film archive; [direct 720p source](https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_720p_h264.mov) |
| Preferred initial delivery | H.264 MP4 (MP4 compatibility path) | Convert/re-wrap the official 720p source using a desktop GUI encoder; preserve every frame including the full credits roll |
| TMDB poster/metadata | metadata only | TMDB does not confer media rights |

### Retired third-party IPFS demo

- CID: `QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K`
- Path: `master.m3u8`
- The user opened both previously supplied gateway links; both actions downloaded empty files. The playlist body and media segments have not been verified. **This CID/path is rejected for gogoiTV and must never be added to the active manifest.**
- This finding is scoped to the supplied third-party rendition. It does not invalidate the film's CC BY rights or prove that every copy of the CID is absent from IPFS.

### Dashboard-only first upload path

1. Download the 720p H.264 MOV from the official Blender source above. Do not use the low-resolution 320×180 sample for the public catalogue.
2. Convert/re-wrap to H.264 MP4 in a GUI encoder such as [Shutter Encoder](https://www.shutterencoder.com/). Choose H.264 output with MP4 container and AAC audio. Do not trim, crop, speed up or remove the ending. The tool's [official documentation](https://www.shutterencoder.com/documentation/) describes the H.264 output function.
3. Inspect the finished output in the GUI's media-information panel; record the exact duration and file size. The runtime must be measured from this exact file, not copied from a TMDB page or a different Big Buck Bunny encode.
4. Create a local folder named `big-buck-bunny` containing a single file named `video.mp4`.
5. In the [Pinata dashboard](https://app.pinata.cloud/), open **Files → Upload → Folder** and upload the `big-buck-bunny` folder. Pinata's [dashboard upload guide](https://www.pinata.cloud/blog/how-to-pin-a-file-to-ipfs/) describes uploading files/folders and retrieving the resulting CID.
6. Save the returned **folder CID**, not a guessed CID. The manifest mapping will then use `protocol: "mp4"`, `path: "video.mp4"` and `mimeType: "video/mp4"`.
7. Test the new URL through at least two independent gateways, verify the file opens as a video and confirm HTTP Range/seek works. Only then record the actual CID, exact duration, size and pinning/retention responsibility for manifest review.

**Pinata cost guardrail (checked 2026-11-09):** the published Free plan lists 1 GB storage, 500 files, one gateway, 10 GB gateway bandwidth and 10,000 requests/month at $0/month; the listed Picnic plan is $20/month with 1 TB storage, 500 GB bandwidth and 5 million requests. Recheck [Pinata's live pricing](https://pinata.cloud/pricing) before signup or upload. The free plan is suitable only for the first test asset, not an unlimited public streaming promise.

### Required acceptance before manifest activation

- Official source and CC BY 3.0 rights evidence are recorded.
- Converted file retains the entire original film and credits roll.
- Exact duration, size and H.264/AAC media information are recorded.
- A new folder CID is pinned in an account controlled by the project operator.
- The same MP4 is fetched through two independent gateways and seeking/Range is verified.
- Retention responsibility and current pinning/gateway limits are documented.

Until all checks pass, keep `src/media-manifest.js` empty and Big Buck Bunny non-playable.

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
