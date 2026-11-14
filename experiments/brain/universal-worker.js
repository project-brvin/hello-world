import { UNIVERSAL_PAGE } from "./universal-page.js";
import { PAGE } from "./page.js";
import { EXPERIENCE } from "./experience.js";
import { STYLES } from "./styles.js";
import { FALLBACK } from "./fallback.js";
import { BRAIN_MODEL_OBJ } from "./vendor/neural-network-prototype/neural-model.js";

const headers = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

function response(body, type, request, cache = "no-store") {
  const h = new Headers(headers);
  h.set("content-type", type);
  h.set("cache-control", cache);
  return new Response(request.method === "HEAD" ? null : body, { headers: h });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        app: "BRɅIN",
        renderer: "Canvas 2D",
        webglRequired: false,
        touchControls: true,
        version: "1.2.0",
        referenceModel: "Neural-Network-Prototype/brain_vertex_low.obj",
        sourceVertices: 14481,
        neuralGraph: "spatial proximity graph; up to 6 axons per neuron"
      }, { headers: { "cache-control": "no-store" } });
    }
    if (url.pathname === "/styles.css") return response(STYLES, "text/css; charset=utf-8", request, "no-cache");
    if (url.pathname === "/fallback.js") return response(FALLBACK, "application/javascript; charset=utf-8", request, "no-cache");
    if (url.pathname === "/brain-model.obj") return response(BRAIN_MODEL_OBJ, "text/plain; charset=utf-8", request, "public, max-age=86400, immutable");
    if (url.pathname === "/experience.js") return response(EXPERIENCE, "application/javascript; charset=utf-8", request, "no-cache");
    if (url.pathname === "/3d") return response(PAGE, "text/html; charset=utf-8", request, "no-store");
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return response(UNIVERSAL_PAGE, "text/html; charset=utf-8", request, "no-store");
    }
    return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  }
};
