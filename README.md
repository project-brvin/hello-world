# Hello World — Cloudflare Worker

A minimal glassy, interactive Hello World site served as static assets from a Cloudflare Worker.

## Local development

```bash
npm install
npm run dev
```

## Reproducible CI install

GitHub Actions also runs `npm ci` against the generated lockfile before validation and deployment.

## Deploy

```bash
npm ci
npm run deploy
```

Required GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with **Account / Workers Scripts / Edit** permission for this account.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.

The workflow deploys on pushes to `main` and can also be started manually from the Actions tab.
