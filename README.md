# gogoiTV

A minimalist, dark glass-inspired streaming interface built around IPFS content addressing.

## Architecture

- Cloudflare Worker serves the static application (no application database).
- Browser checks multiple public IPFS HTTP gateways in parallel using a small HTTP Range request.
- The fastest responding gateway is used for native HTML5 video playback.
- No self-managed VPS, origin video server, or database is required.

## Run locally

Use Wrangler 4 (already familiar to this repository):

```sh
npx wrangler dev
```

## Deploy

```sh
npx wrangler deploy
```

Worker name: `gogoitv`

## Important limitations

- Public gateways are best-effort. A fast one-byte probe does not guarantee sustained throughput or seek support.
- IPFS content must be pinned by one or more providers to remain available.
- Gateway CORS and HTTP Range support vary.
- This first release accepts IPFS CIDs and media paths directly; it does not include a TMDB catalogue or HLS transcoding.
- Use only public-domain, creator-owned, or properly licensed media.

## Health

`GET /api/health`
