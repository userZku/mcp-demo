# Databases

## Current State

**SQLite integrated for local chat persistence** ✅ certain

Application now uses:

- **SQLite (better-sqlite3)** — Persistent conversation history ([src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts))
  - Location: `~/.mcp-demo/conversations.db`
  - Tables: `conversations` (id, messages JSON, timestamps, indexes)
  - Features: Auto-load on CLI startup, auto-save after each interaction
  
- **File system** — For file I/O tool ([src/server/services/file.service.ts](../../src/server/services))
- **In-memory** — Current session messages during chat execution

## Conversation Persistence

### Client-Side (Local)
- **Service:** [src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts)
- **Database:** SQLite at `~/.mcp-demo/conversations.db`
- **Behavior:**
  - On CLI startup: auto-loads most recent conversation OR specific ID via `CONVERSATION_ID` env var
  - After each interaction: saves messages to DB
  - Feature ID: generated automatically (format: `chat-{random}`) or specified via env

### Server-Side (Future)
- **Service:** [src/server/services/conversation.service.ts](../../src/server/services/conversation.service.ts) — Prepared for backend persistence
- **Not yet integrated:** Can be used for multi-user or cloud scenarios

## Future Considerations

If expanding beyond local persistence:

1. **Backend persistence** — Expose conversation endpoints via MCP Server or HTTP API
2. **Multi-user sessions** — User auth + conversation sharing
3. **Tool execution logs** — For audit and debugging
4. **Backup/sync** — Cloud backup or cross-device sync

## See Also

- [03-stack/languages.md](languages.md)
- [01-getting-started/README.md](../01-getting-started/README.md) — How to use persistent conversations

