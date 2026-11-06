# Hello World Live — all-day voice assistant

A glassy, browser-based AI chat and voice assistant served by a Cloudflare Worker. The current voice experience uses the device browser's built-in speech recognition and speech synthesis, with a server-side model router for responses.

## What the voice experience does

- Start a hands-free conversation from **Live voice**.
- See live speech transcription and the assistant's reply.
- Hear responses spoken aloud; tap **Interrupt / listen** to stop speech and return to listening.
- Automatically restart speech recognition when the browser ends a recognition segment or a connection drops.
- Choose English (India), Hindi, Bengali, Assamese, or English (US).
- Keep the transcript in the chat history saved in this browser.
- Periodically compact older turns into a rolling memory summary, while retaining the full transcript locally, so later turns do not need to resend the entire conversation.

### Important device/browser limits

This is a persistent conversation, not one permanent audio connection. Browsers and speech services can end recognition segments, so the app restarts recognition and preserves the same chat. For the best current experience, open the site in Chrome on Android, grant microphone permission, keep the page open in the foreground, and keep the phone awake. The app requests a screen Wake Lock where the browser supports it.

A browser page cannot guarantee microphone capture after the phone is locked, the browser is backgrounded or suspended, the operating system kills the tab, or the network is unavailable. Android battery optimisation and browser policies can interrupt long sessions. Reopen the same site in the same browser to continue from its locally saved chats.

The current voice loop is turn-taking speech recognition and speech synthesis. It is not yet a low-latency, full-duplex native audio model like Gemini Live. The assistant prompt is designed for general understanding and natural responses rather than fixed scripted answers. Groq GPT-OSS uses medium reasoning effort with reasoning output excluded from the user-facing answer. On Android, playback selects the best available device voice for the chosen language; if no voice starts, the UI displays a troubleshooting message. Check Android Settings → System → Languages & input → Text-to-speech output, and make sure media volume is turned up. Speech recognition and playback are supplied by the browser/device; availability and handling of speech data depend on the browser and its configured speech service. Avoid speaking passwords, payment details, or other sensitive information.

## Model providers

The Worker can use these providers in order:

1. **FreeLLMAPI**, when both `FREELLMAPI_BASE_URL` and `FREELLMAPI_API_KEY` are configured.
2. **Groq GPT-OSS 20B**, when `GROQ_API_KEY` is configured.

If the first provider is unavailable or throttled, the Worker tries the next provider. The browser never receives provider credentials.

### Configure Groq

Store `GROQ_API_KEY` as a **Cloudflare Worker Secret** for the `hello-world` Worker:

Cloudflare Dashboard → Workers & Pages → hello-world → Settings → Variables and Secrets → Add → Secret.

### Optional: connect a private FreeLLMAPI gateway

[FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) is a self-hosted gateway that aggregates separate providers' free tiers behind an OpenAI-compatible API. Its README advertises approximately 7.4 billion monthly tokens across provider quotas. This is the project's aggregate estimate, not a guaranteed personal allowance or a quota automatically granted to this Worker. To access the pool, the gateway owner must provision and maintain the respective provider API credentials and observe each provider's terms and limits.

FreeLLMAPI is a private single-user Node/Docker service, not a public hosted free API. It needs an always-on host, persistent database storage, an encryption key, and a secure route to the Worker. Do not expose its dashboard/API to the public internet. A Cloudflare Container is not deployed by this project; Cloudflare Containers require the Workers Paid plan and are billed separately. Do not provision one unless you have reviewed its cost and storage requirements.

Once you have a secure, reachable FreeLLMAPI host and its unified API key:

- Set `FREELLMAPI_BASE_URL` as a Cloudflare Worker **text variable**, including the `/v1` suffix, for example `https://your-private-gateway.example/v1`.
- Set `FREELLMAPI_API_KEY` as a Cloudflare Worker **Secret** containing the unified key from the FreeLLMAPI dashboard.
- Keep `GROQ_API_KEY` configured as the secondary provider.

The Worker then sends `auto:balanced` requests to FreeLLMAPI first and uses Groq as fallback. The URL and key are read only by the Worker and are not returned by `/api/status`.

### Usage and cost

Provider quotas are independent and can change. The router can fail over between configured providers, but cannot make a provider's quota unlimited or guarantee the advertised aggregate capacity. Monitor each provider's terms, rate limits, and billing. Do not create extra accounts or rotate identities to bypass limits.

## API routes

- `GET /api/status` reports configured provider names, model identifiers, and browser voice capabilities; it never returns API keys.
- `POST /api/chat` accepts recent user/assistant messages plus optional rolling memory and returns a reply.
- `POST /api/summarize` compacts an older conversation segment for later context.
- `GET /health` returns the deployed Worker version.

The chat and summary routes validate input, restrict browser-origin requests, use the Cloudflare per-IP rate limiter (10 requests per 60 seconds, per Cloudflare location), cap the model output, use a provider timeout, and do not log prompt content or credentials.

## Reproducible CI and deploy

```bash
npm ci
npm test
npm run check
npm run deploy
```

Required GitHub Actions repository secrets for deployment:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with the minimum Workers Scripts edit permission required by the deploy workflow.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.

The workflow validates pull requests and deploys only validated pushes to `main`. A production deployment is followed by live checks of `/health`, the homepage, model/voice status, and baseline security headers.
