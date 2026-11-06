import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

test("inline frontend JavaScript parses successfully", () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0, "expected an inline application script");
  for (const script of scripts) new Script(script[1]);
});

test("browser client uses same-origin routes and does not contain the provider URL", () => {
  assert.match(html, /fetch\(['"]\/api\/chat['"]/);
  assert.match(html, /fetch\(['"]\/api\/status['"]/);
  assert.doesNotMatch(html, /api\.groq\.com/);
  assert.doesNotMatch(html, /Bearer\s+[A-Za-z0-9_-]{12,}/);
  assert.match(html, /The key is never sent to the browser/);
});
