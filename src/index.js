const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

function secure(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return secure(new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" } }));
      }
      const body = JSON.stringify({
        status: "ok",
        service: "hello-world",
        version: env.CF_VERSION_METADATA?.id ?? "local"
      });
      return secure(new Response(request.method === "HEAD" ? null : body, {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
      }));
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return secure(new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } }));
    }
    try {
      return secure(await env.ASSETS.fetch(request));
    } catch (error) {
      console.error(JSON.stringify({ event: "asset_fetch_failed", message: error instanceof Error ? error.message : "unknown" }));
      return secure(new Response("Internal Server Error", { status: 500, headers: { "Cache-Control": "no-store" } }));
    }
  }
};
