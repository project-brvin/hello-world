# Morrow — independent AI company landing page

A standalone, responsive landing-page concept for a fictional AI company named **Morrow**. This is intentionally separate from the gogoiTV application.

## Preview

https://morrow-ai-preview.projectbrvin.workers.dev

Health check: https://morrow-ai-preview.projectbrvin.workers.dev/health

## Design

- Minimal, editorial layout inspired by contemporary AI product websites without reusing another company's name, logo, copy, or proprietary brand assets.
- Responsive navigation and three product pillars: Morrow Chat, Morrow Studio, and Morrow API.
- System-font stack and inline CSS/SVG; no external font, image, JavaScript, analytics, or UI dependencies.
- Reduced-motion support and basic security response headers.

## Deploy

The preview is deployed as an independent Cloudflare Worker named `morrow-ai-preview`. Its entry point is `worker.js`. It does not alter the production `gogoitv` Worker or the repository's default branch.
