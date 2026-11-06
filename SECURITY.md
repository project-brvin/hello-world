# Security policy

- Keep Cloudflare deployment credentials in GitHub Actions Secrets only. Never commit tokens or paste them into issues or model prompts.
- Store `GROQ_API_KEY` and any `FREELLMAPI_API_KEY` only as Cloudflare Worker Secrets. They must never appear in browser code, the repository, CI logs, or chat.
- Treat `FREELLMAPI_BASE_URL` as a trusted administrator-controlled Worker variable. Use HTTPS and keep the gateway private; its dashboard and unified API key are single-user service credentials.
- Use a dedicated Cloudflare API token with only the account-level Workers Scripts edit permission required for deployment.
- Keep production deployment in a separate protected GitHub environment. Configure required reviewers and deployment branch restrictions in repository settings.
- Require pull requests and passing validation before changes reach main. Disable force pushes and branch deletion.
- The public chat and summary APIs validate browser origins, cap request size/history/output, use a per-IP Cloudflare rate limiter, and log no prompt text or provider credentials.
- Live Durable Object WebSockets require a same-origin upgrade, use a separate per-IP reconnect limiter, validate event types and payload sizes, and persist only completed text/control events (not raw audio chunks). D1 memory is limited to compact summaries. Session and memory IDs are opaque UUID capability identifiers, not full account authentication.
- Voice input and output use browser/device speech APIs. Users should understand the browser/provider's own speech data handling and avoid dictating secrets.
- Treat issue text and repository content as untrusted input. Do not expose GitHub or Cloudflare control-plane tools to the public chat API.
- Any future AI coding agent must run separately with minimal permissions, short-lived identity, path allowlists, draft-PR-only output, and human approval before merge/deploy.
