# Hello World Live architecture and deployment

## Current application architecture

- GitHub Actions validates pull requests and deploys only validated pushes to main.
- Cloudflare Worker is the public same-origin API gateway and applies security headers, request validation and rate limits.
- Cloudflare Durable Objects provide one stateful, SQLite-backed session per opaque browser conversation ID.
- Durable Object hibernating WebSockets accept control/text events and replay recent events after reconnect. The event journal is bounded to the latest 1,000 events per session.
- Cloudflare D1 database `hello-world-memory` stores compact cross-session summaries. It is located in APAC with automatic read replication.
- The browser persists the full transcript locally; older turns are periodically summarized and synchronized to D1.
- **Raw audio chunks are not currently streamed to the Durable Object or persisted.** The current speech layer still uses browser speech recognition and speech synthesis. The WebSocket currently coordinates completed transcript/assistant/interrupt/status events and prepares the session layer for a future full-duplex audio transport.
- The Worker supports FreeLLMAPI first (when configured), then Groq as fallback. Provider credentials stay in Cloudflare Worker Secrets.

## Session and memory endpoints

- `GET /api/live/{sessionId}` upgrades to the Durable Object WebSocket. Session IDs are random UUIDs generated per conversation. The browser sends completed transcript, assistant, interruption, route, and status events; the DO writes them to its embedded SQLite journal.
- The DO replays up to 100 events after the client's last acknowledged sequence on reconnect. Its journal retains at most 1,000 recent events; the browser remains the canonical full transcript store.
- `GET /api/memory/{memoryId}` retrieves a compact user memory summary from D1.
- `PUT /api/memory/{memoryId}` writes an updated summary. The browser stores its random memory ID locally and sends summaries only; it does not save every audio chunk or generated token to D1.
- The workflow applies D1 schema migrations before Worker deployment; Wrangler applies the Durable Object SQLite class migration as part of deploy.

The random UUIDs are high-entropy capability identifiers, not user accounts or a complete multi-user authentication system. Treat browser data as personal and do not share session or memory identifiers.

## Current voice limitations

This is a persistent conversation across browser speech-recognition segments, not a native full-duplex audio engine yet. Speech input/output are still supplied by browser/device APIs. The Durable Object currently journals completed text/control events, not raw audio. Keep Chrome in the foreground and the phone awake. Android can still suspend a background tab or microphone when the screen is locked.

## Model provider configuration

### Groq fallback

Store `GROQ_API_KEY` as a Cloudflare Worker Secret in Workers & Pages → hello-world → Settings → Variables and Secrets.

### FreeLLMAPI primary provider

FreeLLMAPI is a self-hosted Node/Docker gateway. The official public container image is `ghcr.io/tashfeenahmed/freellmapi:v0.16.20`. Follow `infra/railway/README.md` to deploy it through the Railway browser dashboard with a persistent volume at `/app/server/data`.

After deployment:
- Set `FREELLMAPI_BASE_URL` as a Cloudflare Worker text variable, using the Railway HTTPS origin with `/v1` appended. See `infra/railway/README.md` for the exact browser steps.
- Set its unified API key as Cloudflare Worker Secret `FREELLMAPI_API_KEY`.
- Keep `GROQ_API_KEY` as the fallback secret.

The Worker sends `auto:balanced` requests to FreeLLMAPI first and tries Groq if the gateway request fails. FreeLLMAPI itself tracks provider/key quotas, health and fallback chains. Its advertised aggregate token capacity is not a guaranteed allowance; it depends on eligible provider API keys and their independent quotas.

## Railway hosting choice

Railway is selected because it supports public GHCR images, managed persistent volumes and browser-based service configuration. Prefer the upstream Docker image and mount the persistent volume at `/app/server/data`. Avoid unofficial deployment templates that mount `/tmp` without clearly validating persistence.

Railway's Free plan currently has a 0.5 GB volume and 0.5 GB RAM limit; the pricing page says its initial $5 trial credits last 30 days and the Free plan then costs $1/month. Hobby is $5/month minimum including $5 of resource usage credit, with up to 5 GB volume. See https://railway.com/pricing before upgrading.

No Railway service has been created by this repository change. The Railway deployment action is not exposed in this automation session, so service creation, volume attachment and first-run admin setup remain browser steps in `infra/railway/README.md`. No paid Railway resource is started automatically.

## Security boundaries

- All provider keys remain in Cloudflare Worker Secrets or FreeLLMAPI's encrypted key store.
- Only the unified FreeLLMAPI key is given to the Worker; upstream provider keys never reach the browser.
- FreeLLMAPI's dashboard has its own administrator login. The public `/v1` route requires its unified bearer key.
- The Worker never logs prompt text or provider credentials.
- The voice/session APIs do not expose GitHub or Cloudflare control-plane tools.
