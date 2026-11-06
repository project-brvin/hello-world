# GitHub ↔ ChatGPT ↔ Cloudflare workflow

## Current application

- GitHub Actions validates pull requests and deploys only validated pushes to main.
- The Worker exposes a secure same-origin chat endpoint and provider-status endpoint.
- **Live voice** uses the browser's speech recognition and speech synthesis APIs, with recognition restart after ordinary browser recognition-segment endings.
- Conversation transcripts are saved in browser local storage. Older turns are periodically summarized into a compact memory that is sent with recent turns.
- The Worker supports FreeLLMAPI first (when configured), then Groq as fallback.
- API credentials are server-side Cloudflare Worker secrets; they are never returned to the browser.
- Per-IP rate limiting, request limits, output limits, provider timeouts, safe error handling, security headers and structured logs are enabled.

## Voice-session behavior and limitations

This application keeps one ongoing conversation across multiple short-lived browser speech-recognition sessions. It does not depend on a single WebSocket or speech-recognition process staying alive for an entire day. The browser restarts recognition when a segment ends, and the app retains the conversation and rolling summary locally.

For best results, use Chrome on Android, grant microphone permission, keep the page in the foreground and keep the phone awake. Screen Wake Lock is requested when supported. The browser/OS can still suspend a page, stop microphone use in the background, or terminate a tab. The current implementation is a turn-taking STT/TTS interface, not full-duplex native audio. Browser speech recognition may use a browser/platform speech service; follow the browser's privacy controls and do not dictate sensitive credentials or payment details.

## Provider configuration

### Groq

Store `GROQ_API_KEY` as a Cloudflare Worker Secret in Workers & Pages → hello-world → Settings → Variables and Secrets.

### Optional FreeLLMAPI gateway

FreeLLMAPI is a self-hosted Node/Docker gateway, not a free hosted inference API. Its repository advertises an aggregate estimate of about 7.4B tokens/month across multiple providers' separate free tiers. That estimate depends on provider quotas, keys, restrictions, model availability, and account eligibility; it is not a guaranteed personal allowance.

To connect an independently hosted, secured FreeLLMAPI instance:

- Store `FREELLMAPI_BASE_URL` as a Worker text variable, using its OpenAI-compatible base URL ending in `/v1`.
- Store the gateway's unified API key as Worker Secret `FREELLMAPI_API_KEY`.
- Keep `GROQ_API_KEY` as the fallback secret.

The Worker sends `auto:balanced` requests to FreeLLMAPI first, then attempts Groq if the gateway request fails. Never expose the FreeLLMAPI service publicly without authentication and an access-control layer.

FreeLLMAPI needs an always-on host, persistent SQLite data, and an encryption key. Its Docker Compose defaults to localhost-only. Hosting it in a Cloudflare Container is not part of this deployment: Containers require Workers Paid and have separate resource costs; their local disk is temporary and database persistence must be configured separately.

## What this is not

This is a user-initiated voice assistant. The public chat endpoint has no GitHub or Cloudflare control-plane tools and cannot merge code or deploy. A future autonomous coding agent must have its own identity, narrowly scoped permissions, budget controls, validation and human approval boundaries.

## Production settings still requiring a repository administrator

- Protect main: require pull requests, require the Validate application check, require at least one approval, dismiss stale approvals, and block force pushes/deletion.
- Protect the production environment with required reviewers and main-only deployment branches.
- Keep deployment credentials separate from model-provider credentials.
