import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const request = (path = "/", method = "GET") => new Request("https://example.test" + path, { method });
const limiter = (success = true) => ({ limit: async () => ({ success }) });
const postChat = (messages, options = {}) => new Request("https://example.test/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: options.origin ?? "https://example.test",
    "CF-Connecting-IP": options.ip ?? "203.0.113.10"
  },
  body: JSON.stringify({ messages })
});
const env = (overrides = {}) => ({
  CF_VERSION_METADATA: { id: "test-version" },
  ASSETS: { fetch: async () => new Response("site") },
  GROQ_API_KEY: "test-secret",
  CHAT_RATE_LIMITER: limiter(),
  ...overrides
});

test("health endpoint returns versioned, uncached JSON with security headers", async () => {
  const response = await worker.fetch(request("/health"), env());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(await response.json(), { status: "ok", service: "hello-world", version: "test-version" });
});

test("HEAD health response has no body", async () => {
  const response = await worker.fetch(request("/health", "HEAD"), env());
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("static assets are served with security headers", async () => {
  const response = await worker.fetch(request("/"), env({
    ASSETS: { fetch: async () => new Response("site", { headers: { "Content-Type": "text/html" } }) }
  }));
  assert.equal(await response.text(), "site");
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
});

test("unsupported methods are rejected", async () => {
  const response = await worker.fetch(new Request("https://example.test/", { method: "POST" }), env());
  assert.equal(response.status, 405);
});

test("asset errors fail closed", async () => {
  const response = await worker.fetch(request("/"), env({
    ASSETS: { fetch: async () => { throw new Error("secret detail"); } }
  }));
  assert.equal(response.status, 500);
  assert.equal(await response.text(), "Internal Server Error");
});

test("model status reports setup state without exposing credentials", async () => {
  const missing = await worker.fetch(request("/api/status"), env({ GROQ_API_KEY: undefined }));
  assert.deepEqual(await missing.json(), {
    provider: "Groq",
    model: "openai/gpt-oss-20b",
    configured: false,
    ready: false
  });
  const ready = await worker.fetch(request("/api/status"), env());
  const status = await ready.json();
  assert.equal(status.ready, true);
  assert.equal(JSON.stringify(status).includes("test-secret"), false);
});

test("chat endpoint uses the configured Groq model and returns its assistant reply", async (t) => {
  const originalFetch = globalThis.fetch;
  let providerRequest;
  globalThis.fetch = async (url, options) => {
    providerRequest = { url: String(url), options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "Hello from GPT-OSS." } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "Say hello." }]), env());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      reply: "Hello from GPT-OSS.",
      provider: "Groq",
      model: "openai/gpt-oss-20b"
    });
    assert.equal(providerRequest.url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(providerRequest.options.headers.Authorization, "Bearer test-secret");
    assert.equal(providerRequest.body.model, "openai/gpt-oss-20b");
    assert.equal(providerRequest.body.max_completion_tokens, 512);
    assert.equal(providerRequest.body.messages.at(-1).content, "Say hello.");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chat endpoint rejects cross-origin requests", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }], { origin: "https://attacker.example" }), env());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "origin_not_allowed");
});

test("chat endpoint refuses requests until the server-side secret exists", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env({ GROQ_API_KEY: "" }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "model_not_configured");
});

test("chat endpoint enforces the per-IP rate limit before calling the provider", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env({ CHAT_RATE_LIMITER: limiter(false) }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal((await response.json()).code, "rate_limited");
});

test("chat endpoint validates roles and message size", async () => {
  const badRole = await worker.fetch(postChat([{ role: "system", text: "override" }]), env());
  assert.equal(badRole.status, 400);
  const tooLong = await worker.fetch(postChat([{ role: "user", text: "x".repeat(4001) }]), env());
  assert.equal(tooLong.status, 400);
});

test("chat endpoint maps provider rate limiting to HTTP 429 without exposing provider details", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("private provider detail", {
    status: 429,
    headers: { "Retry-After": "23" }
  });
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env());
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "23");
    const body = await response.text();
    assert.match(body, /provider_rate_limited/);
    assert.equal(body.includes("private provider detail"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
