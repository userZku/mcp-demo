# Databases

## Current State

**SQLite integrated for local chat persistence** ✅ certain

### SQLite (better-sqlite3 12.9.0)
- **Location:** `~/.mcp-demo/conversations.db`
- **Tables:** 
  - `conversations` (id TEXT PRIMARY KEY, messages TEXT (JSON), created_at TEXT, updated_at TEXT)
  - Indexes: `idx_updated_at` on updated_at for sorting
- **Service:** [src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts)
- **Methods:**
  - `loadConversation(id?)` — Get conversation by ID or most recent
  - `saveConversation(id, messages)` — Insert/update with timestamps
  - `listConversations(limit)` — Get metadata for UI lists
  - `deleteConversation(id)` — Remove from DB
- **Features:** Auto-load on CLI startup, auto-save after each interaction, shared between CLI and Web
  
- **File system** — For file I/O tool ([src/server/services/file.service.ts](../../src/server/services))
- **In-memory** — Current session messages during chat execution

## Conversation Persistence

### Client-Side (Local)
- **Service:** [src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts)
- **Database:** SQLite at `~/.mcp-demo/conversations.db`
- **Behavior:**
  - **CLI:** Auto-loads most recent conversation on startup; interactive menu to select from existing
  - **Web:** Multi-conversation support; sidebar list with dropdown selector; create/delete buttons
  - After each interaction: saves messages to DB with timestamps
  - Conversation ID: generated automatically (format: `chat-{random}`) or specified via env
- **Shared:** Both CLI and Web use same service and database

### Server-Side (Future)
- **Service:** [src/server/services/conversation.service.ts](../../src/server/services/conversation.service.ts) — Prepared for backend persistence
- **Status:** Not yet integrated; prepared for multi-user or cloud scenarios

## Future Considerations

If expanding beyond local persistence:

1. **Backend persistence** — Expose conversation endpoints via MCP Server or HTTP API
2. **Multi-user sessions** — User auth + conversation sharing
3. **Tool execution logs** — For audit and debugging
4. **Backup/sync** — Cloud backup or cross-device sync
5. **Lazy-loading** — Pagination for large conversation lists
6. **Archiving** — Mark old conversations, hide by default
7. **Encryption** — Encrypt conversations at rest

## See Also

- [04-features/README.md](../04-features/README.md) — Feature details (Chat Persistence, Web Sidebar)
- [03-stack/languages.md](languages.md) — Technology stack
- [01-getting-started/README.md](../01-getting-started/README.md) — Usage guide

