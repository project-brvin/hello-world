# GitHub ↔ ChatGPT ↔ Cloudflare workflow

## What is configured in this repository

- GitHub Actions is the CI/CD orchestrator.
- Pull requests run reproducible dependency installation, unit tests, frontend script syntax validation, and a Wrangler dry run.
- Only validated pushes to main can deploy to the Cloudflare production environment.
- Deployment is followed by live checks of /health and the homepage.
- The Worker emits an uncached, versioned health response and applies baseline browser security headers.
- The Worker exposes a same-origin chat API backed by Groq's hosted OpenAI GPT-OSS 20B model.
- The Groq credential is read only from the Cloudflare Worker secret binding GROQ_API_KEY. The browser and GitHub Actions never receive it.
- Chat requests are size-limited and rate-limited per client IP. No model tool calls or repository/Cloudflare actions are enabled by this chat endpoint.
- Cloudflare Worker logs, traces, and issue reporting are enabled in Wrangler configuration.

## One-time model credential setup

The selected initial model is `openai/gpt-oss-20b` through Groq's OpenAI-compatible API. Groq has a free tier with rate limits and provider/model availability can change.

1. Create a Groq API key at https://console.groq.com/keys.
2. Store it as a **Cloudflare Worker secret** named `GROQ_API_KEY`. Use `npx wrangler@4.158.0 secret put GROQ_API_KEY` from this repository or Cloudflare Dashboard → Workers & Pages → hello-world → Settings → Variables and Secrets → Add → Secret.
3. Verify `https://hello-world.projectbrvin.workers.dev/api/status` reports `"ready": true`.

Never send the key in ChatGPT, a GitHub issue, a commit, or a browser request. Do not add it to GitHub Actions secrets; the Worker alone needs it. For local development, use the ignored `.dev.vars` file.

The model integration in this PR is a user-initiated chat feature. It does not enable an autonomous coding agent, call GitHub APIs, or perform Cloudflare control-plane actions.

## Optional future GitHub agent identity

A future GitHub Actions agent that calls the OpenAI API would need a separate OpenAI API project/service account and GitHub Actions Workload Identity Federation (OIDC). A ChatGPT subscription is not an API identity. Do not reuse the Worker secret or grant the model workflow deployment permissions. Give a future agent only narrowly scoped model access, set project budgets, treat repository content and issue text as untrusted, validate model output, and restrict it to draft pull requests with human approval before merge/deploy.

If using Groq for a future GitHub agent instead, provision a separate narrowly scoped credential for that workflow and keep it separate from the public chat Worker credential.

## Production settings still requiring a repository administrator

- Protect main: require pull requests, require the Validate application check, require at least one approval, dismiss stale approvals, and block force pushes/deletion.
- Protect the production environment with required reviewers and main-only deployment branches.
- Keep the Cloudflare deployment token limited to Workers Scripts edit permission. Do not grant it to any LLM chat endpoint or future model-agent job.
