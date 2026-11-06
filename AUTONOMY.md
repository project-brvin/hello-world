# Autonomous GitHub ↔ ChatGPT ↔ Cloudflare workflow

## What is configured in this repository

- GitHub Actions is the CI/CD orchestrator.
- Pull requests run reproducible dependency installation, unit tests, and a Wrangler dry run.
- Only validated pushes to main can deploy to the Cloudflare production environment.
- Deployment is followed by live checks of /health and the homepage.
- The Worker emits an uncached, versioned health response and applies baseline browser security headers.
- Cloudflare Worker logs, traces, and issue reporting are enabled in Wrangler configuration.

## ChatGPT/OpenAI connection: explicit one-time prerequisite

A ChatGPT subscription and the OpenAI API are separate products. GitHub cannot use this ChatGPT conversation as a background API identity. To enable an autonomous model call from GitHub Actions, create an OpenAI API project/service account and configure GitHub Actions Workload Identity Federation (OIDC) in the OpenAI Platform. Do not use a long-lived API key in repository code.

Create a dedicated GitHub Actions environment named ai-agent and configure the exact provider/service-account identifiers and audience from the OpenAI WIF setup guide as environment variables. Restrict the identity mapping to this repository, main branch, the agent workflow, and the ai-agent environment. Give the service account only model-request permission and set an API project budget.

Until that external identity is provisioned and verified, no AI agent is enabled. Do not treat a successful Cloudflare deployment as proof that ChatGPT model access is configured.

## Production settings still requiring a repository administrator

- Protect main: require pull requests, require the Validate application check, require at least one approval, dismiss stale approvals, and block force pushes/deletion.
- Protect the production environment with required reviewers and main-only deployment branches.
- Create the ai-agent environment only after OpenAI WIF is provisioned. Do not grant it Cloudflare deployment secrets.
