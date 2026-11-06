import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const request = (path = "/", method = "GET") => new Request("https://example.test" + path, { method });

test("health endpoint returns versioned, uncached JSON with security headers", async () => {
  const response = await worker.fetch(request("/health"), {
    CF_VERSION_METADATA: { id: "test-version" },
    ASSETS: { fetch: async () => new Response("unused") }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(await response.json(), { status: "ok", service: "hello-world", version: "test-version" });
});

test("HEAD health response has no body", async () => {
  const response = await worker.fetch(request("/health", "HEAD"), {
    CF_VERSION_METADATA: { id: "test" }, ASSETS: { fetch: async () => new Response("unused") }
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("static assets are served with security headers", async () => {
  const response = await worker.fetch(request("/"), {
    ASSETS: { fetch: async () => new Response("site", { headers: { "Content-Type": "text/html" } }) }
  });
  assert.equal(await response.text(), "site");
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
});

test("unsupported methods are rejected", async () => {
  const response = await worker.fetch(request("/", "POST"), { ASSETS: { fetch: async () => new Response("unused") } });
  assert.equal(response.status, 405);
});

test("asset errors fail closed", async () => {
  const response = await worker.fetch(request("/"), { ASSETS: { fetch: async () => { throw new Error("secret detail"); } } });
  assert.equal(response.status, 500);
  assert.equal(await response.text(), "Internal Server Error");
});
