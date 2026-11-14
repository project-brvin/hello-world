import { PAGE } from "./page.js";
import { STYLES } from "./styles.js";
import { EXPERIENCE } from "./experience.js";

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cache-control": "public, max-age=300, stale-while-revalidate=3600"
};

function asset(body, contentType, request) {
  const headers = new Headers(securityHeaders);
  headers.set("content-type", contentType);
  return new Response(request.method === "HEAD" ? null : body, { headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    if (url.pathname === "/health") {
      return Response.json({ ok: true, app: "BRɅIN", experience: "procedural-neural-cortex", version: "1.0.0" }, {
        headers: { "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/styles.css") return asset(STYLES, "text/css; charset=utf-8", request);
    if (url.pathname === "/experience.js") return asset(EXPERIENCE, "application/javascript; charset=utf-8", request);
    if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 });
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return asset(PAGE, "text/html; charset=utf-8", request);
    }
    return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  }
};
