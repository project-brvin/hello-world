# Security policy

- Keep Cloudflare deployment credentials in GitHub Actions Secrets only. Never commit tokens or paste them into issues or model prompts.
- Store the Groq `GROQ_API_KEY` only as a Cloudflare Worker secret. It is not a GitHub Actions secret and must never appear in browser code, the repository, CI logs, or chat.
- Use a dedicated Cloudflare API token with only the account-level Workers Scripts edit permission required for deployment.
- Keep production deployment in a separate protected GitHub environment. Configure required reviewers and deployment branch restrictions in repository settings.
- Require pull requests and passing validation before changes reach main. Disable force pushes and branch deletion.
- The public chat API validates same-origin browser requests, caps request size/history/output, uses an approximate per-IP Cloudflare rate limit, and logs no prompt text or credentials. Provider-side free-tier limits also apply.
- Treat issue text and repository content as untrusted input. Do not expose GitHub or Cloudflare control-plane tools to the public chat API.
- Any future AI coding agent must run separately with minimal permissions, short-lived identity, path allowlists, draft-PR-only output, and human approval before merge/deploy.
