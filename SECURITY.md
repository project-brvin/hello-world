# Security policy

- Keep Cloudflare credentials in GitHub Actions Secrets only. Never commit tokens or paste them into issues or model prompts.
- Use a dedicated Cloudflare API token with only the account-level Workers Scripts edit permission required for deployment.
- Keep production deployment in a separate protected GitHub environment. Configure required reviewers and deployment branch restrictions in repository settings.
- Require pull requests and passing validation before changes reach main. Disable force pushes and branch deletion.
- Do not run model-generated shell commands, workflows, or deployment scripts.
- Treat issue text and repository content as untrusted input. Keep any future AI agent on a separate workflow with minimal permissions, short-lived identity, path allowlists, draft-PR-only output, and human approval before merge/deploy.
