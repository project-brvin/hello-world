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

Create a TMDB API Read Access Token in your TMDB account, then add it to the Cloudflare Worker as an encrypted secret.

### Dashboard setup (no terminal required)

1. Sign in to [TMDB](https://www.themoviedb.org/) and open Profile > Settings > API.
2. Request an API credential if needed, then copy the **API Read Access Token**.
3. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
4. Open **Workers & Pages** and select the **gogoitv** Worker.
5. Open **Settings** and find **Variables and Secrets**.
6. Select **Add**, choose type **Secret**, and enter the exact variable name `TMDB_API_READ_ACCESS_TOKEN`.
7. Paste the token into the Value field and select **Deploy** to apply the secret.

Cloudflare hides the stored secret value after saving. Never place it in Git, frontend code, public messages or project documentation. The catalogue endpoints return a clear configuration error until this secret is present.

### Optional terminal alternative

If you prefer Wrangler, run `npx wrangler secret put TMDB_API_READ_ACCESS_TOKEN` from the repository and enter the token only into its secure prompt.

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
- The TMDB catalogue and discovery UI/API routes are implemented, but live results require the Worker secret TMDB_API_READ_ACCESS_TOKEN. An authorised media manifest, HLS adaptive player and production IPFS publishing workflow are still future milestones.
- Use only public-domain, creator-owned, or properly licensed media.

## Health

GET /api/health

## Documentation

See [docs/README.md](docs/README.md) for milestones, test evidence and the continuation prompt.
