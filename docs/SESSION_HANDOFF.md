# gogoiTV — New Chat Handoff

Use this prompt when this conversation expires. Repository documentation is the durable project memory.

## Canonical documentation links

- Handbook index: https://github.com/project-brvin/hello-world/blob/main/docs/README.md
- Project charter: https://github.com/project-brvin/hello-world/blob/main/docs/PROJECT_CHARTER.md
- Roadmap: https://github.com/project-brvin/hello-world/blob/main/docs/ROADMAP.md
- Architecture decisions: https://github.com/project-brvin/hello-world/blob/main/docs/ARCHITECTURE_DECISIONS.md
- Test plan: https://github.com/project-brvin/hello-world/blob/main/docs/TEST_PLAN.md
- Progress log: https://github.com/project-brvin/hello-world/blob/main/docs/PROGRESS_LOG.md
- Handoff prompt: https://github.com/project-brvin/hello-world/blob/main/docs/SESSION_HANDOFF.md

Repository: https://github.com/project-brvin/hello-world  
Default branch: main  
Cloudflare Worker name: gogoitv  
Expected Worker URL from the previous setup: https://gogoitv.projectbrvin.workers.dev  
Health route: https://gogoitv.projectbrvin.workers.dev/api/health  
Media manifest: https://gogoitv.projectbrvin.workers.dev/api/media/manifest  
Media resolver example: https://gogoitv.projectbrvin.workers.dev/api/media/resolve?type=movie&id=1

The Worker URL is an expected address, not proof that the endpoint is currently healthy.

Latest verified snapshot (2026-11-09): deployment `11c85ccc-ed72-43fa-a018-dd3250eb87a0` routes 100% to Worker version `34c75251-aa1c-4ef1-9e5a-1bce997dfb07` (v0.3.0); the active version retains `TMDB_API_READ_ACCESS_TOKEN` as a `secret_text` binding; workers.dev is enabled; logs and 10%-sampled traces are enabled. Cloudflare Browser Rendering observed HTTP 200 for homepage, health, popular movies, movie genres, search for Inception and Action-genre discovery. The user confirms the manifest and unmapped resolver return their required JSON. Search returned 13 results and discovery returned 20. Some detail/TV genre checks remain unverified because the inspection API rate-limited or failed to provide a parseable body; these are not confirmed Worker failures.

Daily smoke monitoring: the `Monitor gogoiTV Worker health` automation is active at 12:30 PM Asia/Kolkata. It checks the health, manifest and unmapped-resolver endpoints and distinguishes target HTTP failures from probe-tool/network failures.

## Copy/paste prompt for a fresh ChatGPT conversation

You are continuing development of my project **gogoiTV**. Treat the GitHub repository and its documentation as the source of truth. Do not restart the project or redesign its architecture without a clear reason.

Repository:
https://github.com/project-brvin/hello-world

Start by reading these files from the repository:
1. https://github.com/project-brvin/hello-world/blob/main/docs/README.md
2. https://github.com/project-brvin/hello-world/blob/main/docs/PROJECT_CHARTER.md
3. https://github.com/project-brvin/hello-world/blob/main/docs/ROADMAP.md
4. https://github.com/project-brvin/hello-world/blob/main/docs/ARCHITECTURE_DECISIONS.md
5. https://github.com/project-brvin/hello-world/blob/main/docs/TEST_PLAN.md
6. https://github.com/project-brvin/hello-world/blob/main/docs/PROGRESS_LOG.md

Then inspect the actual repository files and current main branch. If GitHub or Cloudflare integrations are available, use them to inspect and work in the connected accounts; do not assume documentation alone proves the deployment is healthy.

### Product goal
Build a premium, no-ad, free-to-viewer, mobile-first streaming discovery and playback PWA for Gen Z students. It should feel effortless: discover something, press Play, and get the most reliable playback the available network can provide. Never promise absolutely zero buffering or unlimited free capacity.

### Locked architecture
- IPFS is the canonical source for rights-cleared video assets.
- Do not use WebTorrent as the primary playback engine.
- Prefer adaptive HLS; retain direct MP4 compatibility.
- Cloudflare Worker is for app/API routing, metadata orchestration and secrets, not proxying all video bytes.
- Use TMDB for metadata only; TMDB does not provide video distribution rights.
- Use a versioned static catalogue manifest mapping TMDB IDs to authorised CIDs/paths.
- No application database and no mandatory account in the first release.
- Use browser-local storage for first-release watchlist, preferences and playback progress.
- Browser-side gateway racing/failover should measure the viewer's actual network path.
- R2/edge-cache acceleration is optional and must be evaluated only after IPFS playback works and current pricing/limits are checked.
- PWA offline support is app-shell-first; no offline video caching by default.
- Only public-domain, creator-owned or properly licensed media may be playable. No piracy indexing, unauthorised torrents or magnet-link discovery; no live TV/sports restreaming in the first release.

### How to continue
1. Identify the first incomplete milestone in docs/ROADMAP.md.
2. Verify dependencies and inspect relevant code before editing.
3. Implement the smallest complete vertical slice for that milestone.
4. Run the applicable tests in docs/TEST_PLAN.md.
5. Report exactly what changed, what was tested, what passed, what failed and what remains.
6. Update docs/ROADMAP.md, append a dated entry to docs/PROGRESS_LOG.md, and update other docs if a decision or test changed.
7. Commit code and documentation when authorised by the connected tools.
8. Do not mark a milestone DONE until its exit criteria have evidence.

### Working style
- Be proactive and make reasonable implementation choices without repeatedly asking me to restate decisions already recorded.
- Ask only for essential credentials or content-rights information that cannot safely be inferred.
- Never put secrets in Git, frontend code or documentation.
- Do not claim deployment is verified merely because an upload API succeeded; test the public URL.
- Do not add features that compromise reliability, privacy, legality or the free-to-viewer promise.
- At the end of the session, leave the repository docs ready for the next chat, with one clear next action.

Current status (reinspected 2026-11-09): M0 and M1 are complete. M2 is PARTIAL: homepage, health, popular movies, movie genres, search and Action discovery are verified; user confirms manifest and unmapped-resolver JSON. Movie detail, TV genres, error paths and attribution/logo visual review remain open. The active v0.3.0 Worker version retains `TMDB_API_READ_ACCESS_TOKEN` as a protected `secret_text` binding. M3 is IN PROGRESS: manifest v1, schema and resolver are deployed; manifest remains empty. Big Buck Bunny (TMDB movie 10378, CC BY 3.0) remains a rights candidate, but the third-party HLS CID `QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K` is rejected because the user obtained empty downloads from both provided gateways. Next use the official Blender 720p H.264 MOV, convert to H.264 MP4 in a GUI, and upload a `big-buck-bunny/video.mp4` folder to Pinata (or another operator-controlled pinning service). Do not add any source to the active manifest until the new folder CID is verified through two gateways and exact duration/credits are checked.

Candidate update (2026-11-09): the user opened both the old `ipfs.io` and `dweb.link` HLS candidate links and each downloaded an empty file. Retire that CID; do not ask the user to retry it. The next publishing path is documented in `docs/CONTENT_PUBLISHING.md`: convert Blender's official 720p H.264 MOV to an MP4 in a GUI, upload a folder containing `video.mp4` to Pinata, then verify the fresh CID/path via two gateways.

Your first task in a new chat: read the docs, inspect the repository and latest Cloudflare deployment, then continue from docs/ROADMAP.md. The next action is to prepare and upload the official Blender 720p H.264 MP4 as a folder to Pinata's dashboard, then verify the returned new CID/path, full credits, duration and Range support through two gateways. Keep the active manifest empty until this evidence is recorded; do not use the rejected demo CID. The user prefers dashboard-only workflows and no terminals. Preserve the TMDB_API_READ_ACCESS_TOKEN secret binding on every Worker version upload by inheriting the existing binding; never ask the user to paste the token into chat.
