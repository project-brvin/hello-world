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

test("browser client uses same-origin model routes and contains no provider credentials", () => {
  assert.match(html, /fetch\(['"]\/api\/chat['"]/);
  assert.match(html, /fetch\(['"]\/api\/status['"]/);
  assert.match(html, /fetch\(['"]\/api\/summarize['"]/);
  assert.doesNotMatch(html, /api\.groq\.com/);
  assert.doesNotMatch(html, /api\.freellmapi\.co/);
  assert.doesNotMatch(html, /Bearer\s+[A-Za-z0-9_-]{12,}/);
});

test("live voice mode offers browser speech input, speech output, and interruption controls", () => {
  assert.match(html, /SpeechRecognitionApi/);
  assert.match(html, /webkitSpeechRecognition/);
  assert.match(html, /speechSynthesis/);
  assert.match(html, /voice-interrupt/);
  assert.match(html, /scheduleVoiceRestart/);
  assert.match(html, /navigator\.wakeLock/);
  assert.match(html, /voice-view/);
});

test("live voice session uses saved chat history and a rolling memory summary", () => {
  assert.match(html, /chatgpt-ui-demo-chats/);
  assert.match(html, /summarizedCount/);
  assert.match(html, /conversation\.memory/);
  assert.match(html, /3500/);
  assert.match(html, /The microphone reconnects/);
});

test("speech output selects a device voice and reports playback failures", () => {
  assert.match(html, /function chooseSpeechVoice\(synth, language\)/);
  assert.match(html, /getVoices\(\)/);
  assert.match(html, /voiceschanged/);
  assert.match(html, /utterance\.onstart/);
  assert.match(html, /No speech audio started/);
  assert.match(html, /Android text-to-speech voice settings/);
});

test("voice client connects to a durable per-conversation WebSocket and records events", () => {
  assert.match(html, /new WebSocket\(socketUrl\.toString\(\)\)/);
  assert.match(html, /\/api\/live\//);
  assert.match(html, /recordLiveEvent\('transcript'/);
  assert.match(html, /recordLiveEvent\('assistant'/);
  assert.match(html, /recordLiveEvent\('interrupt'/);
  assert.match(html, /liveLastSequence/);
  assert.match(html, /scheduleLiveReconnect/);
});

test("long-term memory is loaded and persisted through the same-origin D1 API", () => {
  assert.match(html, /hello-world-memory-id/);
  assert.match(html, /GET/);
  assert.match(html, /\/api\/memory\//);
  assert.match(html, /method: 'PUT'/);
  assert.match(html, /persistLongTermMemory/);
  assert.match(html, /longTermMemory/);
});
