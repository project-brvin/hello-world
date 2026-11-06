import test from "node:test";
import assert from "node:assert/strict";
import { LiveSession } from "../src/live-session.js";

class FakeSql {
  constructor() { this.events = []; }
  exec(query, ...params) {
    if (query.startsWith("CREATE TABLE") || query.startsWith("CREATE INDEX")) {
      return { toArray: () => [], one: () => ({}) };
    }
    if (query.includes("SELECT COUNT(*) AS count FROM session_events")) {
      return { one: () => ({ count: this.events.filter(event => event.created_at > Number(params[0])).length }) };
    }
    if (query.startsWith("DELETE FROM session_events")) {
      if (this.events.length > 1000) this.events = this.events.slice(-1000);
      return { toArray: () => [] };
    }
    if (query.startsWith("SELECT COALESCE(MAX(sequence)")) {
      return { one: () => ({ sequence: this.events.at(-1)?.sequence ?? 0 }) };
    }
    if (query.includes("INSERT INTO session_events")) {
      const event = {
        sequence: this.events.length ? this.events[this.events.length - 1].sequence + 1 : 1,
        event_type: params[0],
        text_content: params[1],
        created_at: params[2]
      };
      this.events.push(event);
      return { one: () => ({ sequence: event.sequence }) };
    }
    if (query.includes("SELECT sequence, event_type")) {
      const after = Number(params[0]);
      const limit = Number(params[1]);
      return {
        toArray: () => this.events.filter(event => event.sequence > after).slice(0, limit)
      };
    }
    throw new Error("Unexpected SQL in fake storage: " + query);
  }
}

class FakeSocket {
  constructor() { this.sent = []; this.closed = null; this.attachment = null; }
  send(value) { this.sent.push(value); }
  close(code, reason) { this.closed = { code, reason }; }
  serializeAttachment(value) { this.attachment = value; }
}

function makeSession() {
  const sql = new FakeSql();
  const socket = new FakeSocket();
  const ctx = {
    storage: { sql },
    blockConcurrencyWhile: (fn) => fn(),
    acceptWebSocket: () => {},
    getWebSockets: () => [socket]
  };
  return { session: new LiveSession(ctx, {}), sql, socket };
}

test("Durable Object persists transcript events with monotonically increasing sequence numbers", () => {
  const { session, sql, socket } = makeSession();
  session.webSocketMessage(socket, JSON.stringify({ type: "transcript", text: "Hello there." }));
  session.webSocketMessage(socket, JSON.stringify({ type: "assistant", text: "Hi. What can I help with?" }));

  assert.equal(sql.events.length, 2);
  assert.equal(sql.events[0].sequence, 1);
  assert.equal(sql.events[1].sequence, 2);
  assert.equal(sql.events[0].event_type, "transcript");
  assert.equal(sql.events[1].event_type, "assistant");

  const last = JSON.parse(socket.sent.at(-1));
  assert.equal(last.type, "event");
  assert.equal(last.sequence, 2);
  assert.equal(last.eventType, "assistant");
});

test("Durable Object rejects unsupported or malformed events without persisting them", () => {
  const { session, sql, socket } = makeSession();
  session.webSocketMessage(socket, "not-json");
  session.webSocketMessage(socket, JSON.stringify({ type: "audio_chunk", text: "raw audio must not be journaled" }));
  session.webSocketMessage(socket, JSON.stringify({ type: "transcript", text: "x".repeat(4001) }));

  assert.equal(sql.events.length, 0);
  assert.deepEqual(socket.sent.map(value => JSON.parse(value).code), [
    "invalid_json",
    "unsupported_event",
    "event_text_too_long"
  ]);
});

test("Durable Object bounds WebSocket payloads and closes oversized messages", () => {
  const { session, sql, socket } = makeSession();
  session.webSocketMessage(socket, "x".repeat(8 * 1024 + 1));
  assert.equal(sql.events.length, 0);
  assert.deepEqual(socket.closed, { code: 1009, reason: "Message too large" });
});

test("Durable Object retains only a bounded replay journal", () => {
  const { session, sql, socket } = makeSession();
  const originalNow = Date.now;
  let fakeNow = originalNow();
  Date.now = () => fakeNow;
  try {
    for (let i = 0; i < 1005; i++) {
      fakeNow += 1000;
      session.webSocketMessage(socket, JSON.stringify({ type: "status", text: "event-" + i }));
    }
  } finally {
    Date.now = originalNow;
  }
  assert.equal(sql.events.length, 1000);
  assert.equal(sql.events[0].sequence, 6);
  assert.equal(sql.events.at(-1).sequence, 1005);
});


test("Durable Object rate-limits excessive control events in one session", () => {
  const { session, sql, socket } = makeSession();
  for (let i = 0; i < 120; i++) {
    session.webSocketMessage(socket, JSON.stringify({ type: "status", text: "event-" + i }));
  }
  session.webSocketMessage(socket, JSON.stringify({ type: "status", text: "one too many" }));
  assert.equal(sql.events.length, 120);
  assert.equal(JSON.parse(socket.sent.at(-1)).code, "session_event_rate_limited");
});
