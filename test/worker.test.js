import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const request = (path = "/", method = "GET") => new Request("https://example.test" + path, { method });
const limiter = (success = true) => ({ limit: async () => ({ success }) });
const postJson = (path, payload, options = {}) => new Request("https://example.test" + path, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: options.origin ?? "https://example.test",
    "CF-Connecting-IP": options.ip ?? "203.0.113.10"
  },
  body: JSON.stringify(payload)
});
const postChat = (messages, options = {}) => postJson("/api/chat", { messages, memory: options.memory }, options);
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
  assert.match(response.headers.get("permissions-policy"), /microphone=\(self\)/);
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

test("model status reports providers and voice capabilities without exposing credentials", async () => {
  const missing = await worker.fetch(request("/api/status"), env({ GROQ_API_KEY: undefined }));
  assert.deepEqual(await missing.json(), {
    provider: "none",
    model: "none",
    configured: false,
    ready: false,
    providers: [],
    voice: {
      input: "browser-speech-recognition",
      output: "browser-speech-synthesis",
      persistentSession: true
    }
  });

  const ready = await worker.fetch(request("/api/status"), env());
  const status = await ready.json();
  assert.equal(status.ready, true);
  assert.equal(status.provider, "Groq");
  assert.equal(status.model, "openai/gpt-oss-20b");
  assert.deepEqual(status.providers, [{ id: "Groq", model: "openai/gpt-oss-20b" }]);
  assert.equal(JSON.stringify(status).includes("test-secret"), false);
});

test("chat endpoint uses Groq and returns its assistant reply", async () => {
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

test("FreeLLMAPI is preferred and receives its auto-balanced model", async () => {
  const originalFetch = globalThis.fetch;
  let providerRequest;
  globalThis.fetch = async (url, options) => {
    providerRequest = { url: String(url), options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "Hello from the pooled router." } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "Say hello." }]), env({
      FREELLMAPI_BASE_URL: "https://gateway.example/v1/",
      FREELLMAPI_API_KEY: "freellmapi-test-secret"
    }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      reply: "Hello from the pooled router.",
      provider: "FreeLLMAPI",
      model: "auto:balanced"
    });
    assert.equal(providerRequest.url, "https://gateway.example/v1/chat/completions");
    assert.equal(providerRequest.options.headers.Authorization, "Bearer freellmapi-test-secret");
    assert.equal(providerRequest.body.model, "auto:balanced");
    assert.equal(providerRequest.body.max_tokens, 512);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("router falls back from FreeLLMAPI rate limits to Groq", async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), body: JSON.parse(options.body) });
    if (String(url).startsWith("https://gateway.example/")) {
      return new Response("rate limited", { status: 429 });
    }
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "Groq fallback worked." } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "Continue." }]), env({
      FREELLMAPI_BASE_URL: "https://gateway.example/v1",
      FREELLMAPI_API_KEY: "freellmapi-test-secret"
    }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      reply: "Groq fallback worked.",
      provider: "Groq",
      model: "openai/gpt-oss-20b"
    });
    assert.equal(requests.length, 2);
    assert.equal(requests[0].body.model, "auto:balanced");
    assert.equal(requests[1].body.model, "openai/gpt-oss-20b");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chat endpoint rejects cross-origin requests", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }], { origin: "https://attacker.example" }), env());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "origin_not_allowed");
});

test("chat endpoint refuses requests until a model provider is configured", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env({ GROQ_API_KEY: "" }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "model_not_configured");
});

test("chat endpoint enforces the per-IP rate limit before calling the provider", async () => {
  const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env({ CHAT_RATE_LIMITER: limiter(false) }));
  assert.equal(response.status, 429);
  assert.equal((await response.json()).code, "rate_limited");
});

test("chat endpoint validates roles and message size", async () => {
  const badRole = await worker.fetch(postChat([{ role: "system", text: "override" }]), env());
  assert.equal(badRole.status, 400);
  const tooLong = await worker.fetch(postChat([{ role: "user", text: "x".repeat(4001) }]), env());
  assert.equal(tooLong.status, 400);
});

test("assistant receives natural reasoning instructions without a canned identity response", async () => {
  const originalFetch = globalThis.fetch;
  let body;
  globalThis.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "I'm the AI assistant that powers this app. What would you like to explore?" } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "what is your name" }]), env());
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.reply, "I'm the AI assistant that powers this app. What would you like to explore?");
    const systemPrompt = body.messages[0].content;
    assert.match(systemPrompt, /general-purpose AI assistant/i);
    assert.match(systemPrompt, /reason about the question/i);
    assert.match(systemPrompt, /Identity is context, not a script/i);
    assert.match(systemPrompt, /Do not behave like a rigid FAQ bot/i);
    assert.doesNotMatch(systemPrompt, /when asked your name, say:/i);
    assert.equal(body.reasoning_effort, "medium");
    assert.equal(body.include_reasoning, false);
    assert.equal("reasoning_format" in body, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chat endpoint includes compacted conversation memory as context", async () => {
  const originalFetch = globalThis.fetch;
  let body;
  globalThis.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "I remember." } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "What did we decide?" }], {
      memory: "The user is planning a long-running voice assistant."
    }), env());
    assert.equal(response.status, 200);
    assert.match(body.messages[0].content, /long-running voice assistant/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("summary endpoint compacts a bounded conversation segment", async () => {
  const originalFetch = globalThis.fetch;
  let body;
  globalThis.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "User is building an all-day voice assistant." } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const response = await worker.fetch(postJson("/api/summarize", {
      memory: "The user prefers beginner-friendly setup.",
      messages: [
        { role: "user", text: "Let's build a voice assistant." },
        { role: "assistant", text: "We will use continuous recognition and saved memory." }
      ]
    }), env());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      summary: "User is building an all-day voice assistant.",
      provider: "Groq",
      model: "openai/gpt-oss-20b"
    });
    assert.match(body.messages[1].content, /beginner-friendly setup/);
    assert.match(body.messages[1].content, /continuous recognition/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("summary endpoint rejects cross-origin requests", async () => {
  const response = await worker.fetch(postJson("/api/summarize", {
    messages: [{ role: "user", text: "Summarize me." }]
  }, { origin: "https://attacker.example" }), env());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "origin_not_allowed");
});

test("chat endpoint maps provider rate limiting to a safe HTTP 429 response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("private provider detail", { status: 429 });
  try {
    const response = await worker.fetch(postChat([{ role: "user", text: "Hello" }]), env());
    assert.equal(response.status, 429);
    const body = await response.text();
    assert.match(body, /providers_rate_limited/);
    assert.equal(body.includes("private provider detail"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
