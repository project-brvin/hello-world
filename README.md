# gogoiTV

A minimalist, dark glass-inspired streaming interface built around IPFS content addressing.

## Project handbook

The durable project documentation is in [docs/README.md](docs/README.md). Start there for the approved product charter, milestone roadmap, architecture decisions, test plan, progress log and new-chat handoff prompt.

## Architecture

- Cloudflare Worker serves the static application and application APIs (no application database).
- Browser checks multiple public IPFS HTTP gateways in parallel using a small HTTP Range request.
- The fastest responding gateway is used for native HTML5 video playback in the current prototype.
- No self-managed VPS, origin video server, or database is required by the initial prototype.

## Prerequisites

- Node.js 20 or later.
- npm.

## Run locally

Install the pinned project dependencies, then run the local Worker:

    npm install
    npm run dev

## Validate the deployment bundle

    npm run dry-run

## Deploy

    npm run deploy

The project pins Wrangler in package.json so local development and deployments use the repository's declared CLI version.

Worker name: gogoitv

## TMDB configuration

Create a TMDB API Read Access Token in your TMDB account, then add it to the Cloudflare Worker as a secret named `TMDB_API_READ_ACCESS_TOKEN`. From a local repository terminal, run:

    npx wrangler secret put TMDB_API_READ_ACCESS_TOKEN

Paste the token only into Wrangler's secure prompt. Do not commit it, put it in frontend code, or paste it into project documentation. The catalogue endpoints return a clear configuration error until this secret is present.

Implemented Worker catalogue routes:
- `/api/catalog/trending?type=all&window=week`
- `/api/catalog/popular?type=movie` or `type=tv`
- `/api/catalog/search?q=...`
- `/api/catalog/details?type=movie&id=...` or `type=tv`
- `/api/catalog/genres?type=movie`
- `/api/catalog/discover?type=movie&genre=...`

## Important limitations

- Public gateways are best-effort. A fast one-byte probe does not guarantee sustained throughput or seek support.
- IPFS content must be pinned by one or more providers to remain available.
- Gateway CORS and HTTP Range support vary.
- The current first prototype accepts IPFS CIDs and media paths directly; it does not yet include the planned TMDB catalogue, authorised media manifest or HLS adaptive player.
- Use only public-domain, creator-owned, or properly licensed media.

## Health

GET /api/health

## Documentation

See [docs/README.md](docs/README.md) for milestones, test evidence and the continuation prompt.
