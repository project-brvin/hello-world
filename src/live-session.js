const MAX_EVENT_BYTES = 8 * 1024;
const MAX_EVENT_TEXT = 4000;
const MAX_REPLAY_EVENTS = 100;

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

/** One Durable Object per browser conversation ID. Only completed text/control
 * events are persisted; raw audio chunks never touch this SQLite journal. */
export class LiveSession {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS session_events (sequence INTEGER PRIMARY KEY AUTOINCREMENT, event_type TEXT NOT NULL, text_content TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL)");
      ctx.storage.sql.exec("CREATE INDEX IF NOT EXISTS session_events_created_at ON session_events(created_at)");
    });
  }

  lastSequence() {
    const row = this.ctx.storage.sql.exec("SELECT COALESCE(MAX(sequence), 0) AS sequence FROM session_events").one();
    return Number(row.sequence || 0);
  }

  fetch(request) {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "WebSocket upgrade required.", code: "upgrade_required" }, 426);
    }
    const url = new URL(request.url);
    const requestedAfter = Number(url.searchParams.get("after") || 0);
    const after = Number.isSafeInteger(requestedAfter) && requestedAfter >= 0 ? requestedAfter : 0;
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() });
    server.send(JSON.stringify({ type: "ready", sequence: this.lastSequence(), replayFrom: after }));
    const replay = this.ctx.storage.sql.exec("SELECT sequence, event_type, text_content, created_at FROM session_events WHERE sequence > ? ORDER BY sequence ASC LIMIT ?", after, MAX_REPLAY_EVENTS).toArray();
    for (const event of replay) {
      server.send(JSON.stringify({ type: "event", sequence: Number(event.sequence), eventType: event.event_type, text: event.text_content, createdAt: Number(event.created_at), replay: true }));
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket, message) {
    let raw;
    try { raw = typeof message === "string" ? message : new TextDecoder().decode(message); }
    catch { socket.close(1003, "Unsupported message format"); return; }
    if (new TextEncoder().encode(raw).byteLength > MAX_EVENT_BYTES) { socket.close(1009, "Message too large"); return; }
    let payload;
    try { payload = JSON.parse(raw); }
    catch { socket.send(JSON.stringify({ type: "error", code: "invalid_json" })); return; }
    if (!payload || typeof payload !== "object") { socket.send(JSON.stringify({ type: "error", code: "invalid_event" })); return; }
    const allowed = new Set(["transcript", "assistant", "interrupt", "route", "status"]);
    if (!allowed.has(payload.type)) { socket.send(JSON.stringify({ type: "error", code: "unsupported_event" })); return; }
    const text = payload.text == null ? "" : String(payload.text);
    if (text.length > MAX_EVENT_TEXT) { socket.send(JSON.stringify({ type: "error", code: "event_text_too_long" })); return; }
    const createdAt = Date.now();
    const recent = this.ctx.storage.sql.exec(
      "SELECT COUNT(*) AS count FROM session_events WHERE created_at > ?",
      createdAt - 60_000
    ).one();
    if (Number(recent.count || 0) >= 120) {
      socket.send(JSON.stringify({ type: "error", code: "session_event_rate_limited" }));
      return;
    }
    const inserted = this.ctx.storage.sql.exec("INSERT INTO session_events (event_type, text_content, created_at) VALUES (?, ?, ?) RETURNING sequence", payload.type, text, createdAt).one();
    const sequence = Number(inserted.sequence);
    this.ctx.storage.sql.exec("DELETE FROM session_events WHERE sequence <= (SELECT COALESCE(MAX(sequence), 0) - 1000 FROM session_events)");
    const event = JSON.stringify({ type: "event", sequence, eventType: payload.type, text, createdAt, replay: false });
    for (const peer of this.ctx.getWebSockets()) { try { peer.send(event); } catch { /* disconnected peer */ } }
  }

  webSocketClose(socket, code, reason) {
    try { socket.close(code, reason); } catch { /* already closed */ }
  }

  webSocketError(socket) {
    try { socket.close(1011, "Session socket error"); } catch { /* already closed */ }
  }
}