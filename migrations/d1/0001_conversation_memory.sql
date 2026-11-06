CREATE TABLE IF NOT EXISTS conversation_memory (
  memory_id TEXT PRIMARY KEY,
  summary_text TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS conversation_memory_updated_at
ON conversation_memory(updated_at);
