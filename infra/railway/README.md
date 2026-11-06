# Deploy the FreeLLMAPI gateway on Railway (browser-only)

This guide uses the **official public FreeLLMAPI container image** and Railway's dashboard. No terminal or code editing is needed.

## Why Railway

Railway can deploy a public Docker image from GitHub Container Registry, run it as a persistent service, attach a managed volume, and configure environment variables in the browser.

- Free plan: currently 0.5 GB RAM and 0.5 GB persistent volume. Railway lists a 30-day $5 trial credit, then $1/month for the Free plan.
- Hobby plan: $5/month minimum, including $5 of resource usage credit, and up to 5 GB volume.
- Check current limits and billing before upgrading: https://railway.com/pricing

For a single-user gateway, start with the Free plan if the image and data fit its limits. Do not upgrade automatically. If the service exceeds memory or volume limits, review usage before selecting Hobby.

## 1. Create the service

1. Open https://railway.com and sign in.
2. Click **New Project**.
3. Choose **Empty Project**.
4. On the project canvas, click **Add Service**.
5. Choose **Docker Image**.
6. Enter this exact public image:

   `ghcr.io/tashfeenahmed/freellmapi:v0.16.20`

7. Confirm / Deploy the image.

The current pinned upstream release is `v0.16.20` (released 6 November 2026). Pinning a release avoids an unexpected latest-image update during initial setup. Check upstream releases before changing the tag: https://github.com/tashfeenahmed/freellmapi/releases.

Use the official GHCR image rather than the unofficial community deployment template. The community template currently mounts `/tmp` and labels its own persistence setup as uncertain. The upstream Docker guide specifies `/app/server/data` as the persistent application data directory.

## 2. Add persistent storage

1. Open the new FreeLLMAPI service.
2. Open **Volumes**.
3. Click **Add Volume**.
4. Set the mount path to exactly:

   `/app/server/data`

5. Create / attach the volume and keep it attached to this service during future redeploys.

This volume stores FreeLLMAPI's SQLite database. Do not remove it when upgrading or redeploying.

## 3. Add the required environment variables

In the service, open **Variables** and add:

| Name | Value |
|---|---|
| `PORT` | `3001` |
| `ENCRYPTION_KEY` | A newly generated 64-character hexadecimal secret (32 random bytes) |

Generate the encryption key using your password manager's secure random generator with 32 bytes / 64 hexadecimal characters. Save it in your password manager. Do not reuse a provider API key as the encryption key.

**Very important:** keep the same `ENCRYPTION_KEY` permanently. If you change it later, FreeLLMAPI will not be able to decrypt provider keys already saved in its database.

Click **Deploy** to apply the variables.

## 4. Configure the service health check and public HTTPS domain

1. Open **Settings** for the service.
2. Set the health check path to `/api/ping` if the setting is available.
3. Open **Networking** and choose **Generate Domain**.
4. Wait for Railway to mark the deployment healthy.
5. Open the generated HTTPS URL in your browser.

The Railway domain should resemble:

`https://your-service-name.up.railway.app`

Keep this URL private until the admin account is configured.

## 5. Create your FreeLLMAPI administrator and unified key

1. Open the generated Railway HTTPS URL.
2. Complete the first-run administrator setup. Use a unique, strong password and save it in your password manager.
3. Open the **Keys** page in the FreeLLMAPI dashboard.
4. Add the upstream provider API keys that you actually have permission to use (for example Groq, Google AI Studio, Cerebras, NVIDIA, Mistral, OpenRouter, and other supported providers).
5. Enable only providers/models that work for your accounts and region. Review each provider's own free-tier limits and terms.
6. Create or copy the **unified FreeLLMAPI API key** shown in the dashboard header / Keys page.
7. Save that unified key in your password manager.

FreeLLMAPI encrypts stored provider keys. Its gateway tracks per-key limits and falls through to other configured providers when supported providers return rate limits, server errors or timeouts. Its advertised aggregate token capacity is an estimate across independent provider quotas, not guaranteed monthly capacity for one account.

## 6. Connect Railway to the Cloudflare Worker

1. Open https://dash.cloudflare.com
2. Go to **Workers & Pages** → **hello-world** → **Settings** → **Variables and Secrets**.
3. Add a **Text** variable:
   - Name: `FREELLMAPI_BASE_URL`
   - Value: your Railway HTTPS domain followed by `/v1`

   Example: `https://your-service-name.up.railway.app/v1`

4. Add a **Secret**:
   - Name: `FREELLMAPI_API_KEY`
   - Value: paste the unified FreeLLMAPI key from the dashboard.

5. Keep the existing `GROQ_API_KEY` Worker secret. It remains the secondary fallback.
6. Save / Deploy the Worker if Cloudflare asks.

Do not put upstream provider keys in Cloudflare or GitHub. Only the FreeLLMAPI unified key belongs in the Worker secret.

## 7. Verify the connection

Open:

https://hello-world.projectbrvin.workers.dev/api/status

When the FreeLLMAPI gateway is connected, the response should list both `FreeLLMAPI` and `Groq` under `providers`. It will never return their credentials.

Then open https://hello-world.projectbrvin.workers.dev and try a chat.

## Security and operations

- Keep the FreeLLMAPI administrator password, the stable encryption key and unified key in a password manager.
- Keep the Railway volume mounted at `/app/server/data`.
- Do not disable the FreeLLMAPI login or publish upstream provider keys.
- The Railway service must be reachable over HTTPS from the Cloudflare Worker; the unified API key protects its `/v1` endpoint.
- Review Railway resource usage and provider quotas periodically.
- If a provider key is invalid, remove or disable it in FreeLLMAPI rather than rotating accounts or attempting to bypass provider rules.
