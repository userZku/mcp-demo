# Features

## Implemented Features

### 1. Chat Persistence (SQLite)
**Status:** ✅ Implemented | **Branch:** `feature/chat-persistence-sqlite`

Persistent conversation history across sessions using SQLite (better-sqlite3).

**CLI Features:**
- Auto-load most recent conversation on startup
- Interactive menu to select from existing conversations
- Auto-save after each interaction
- Show conversation list with metadata (date, message count)

**Web Features:**
- Multi-conversation support with dropdown selector
- Conversation list in sidebar with dates
- "New conversation" button
- View/load conversation history

**Database:**
- Location: `~/.mcp-demo/conversations.db`
- Schema: `conversations` table with id, messages (JSON), timestamps

**Service:** [src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts)

---

### 2. Web Conversation Sidebar
**Status:** ✅ Implemented | **Branch:** `feature/web-chat-history-sidebar`

Full conversation management UI for Web with sidebar, history list, and deletion.

**UI Components:**
- Left sidebar with conversation list (responsive grid layout)
- Dropdown menu for quick conversation switching
- "+ Nouvelle" button to create new conversations
- "Suppr." button per conversation to delete
- Conversation metadata (creation date, message count)

**Backend API Endpoints:**
- `GET /conversations` — List all conversations with metadata
- `POST /conversations/new` — Create new conversation
- `POST /conversations/:id/select` — Switch to conversation
- `GET /conversations/:id/messages` — Fetch conversation history
- `DELETE /conversations/:id` — Delete conversation from DB

**Files:**
- Frontend: [src/client/web/public/chat.js](../../src/client/web/public/chat.js), [index.html](../../src/client/web/public/index.html), [styles.css](../../src/client/web/public/styles.css)
- Backend: [src/client/interfaces/web.ts](../../src/client/interfaces/web.ts), [src/client/core/webChat.ts](../../src/client/core/webChat.ts)

---

## Tool Capabilities

Available MCP tools:
- `get_time` — System time and date
- `add` — Simple arithmetic addition
- `read_file` — Read file contents
- `write_file` — Write to files
- `weather` — Current weather (OpenMeteo API)

---

## Integration Features

- **Streaming Responses** — Real-time AI response streaming from Ollama
- **Tool Calling** — AI autonomously calls tools when needed
- **Multi-interface Support** — Same chat logic works for CLI and Web
- **Persistent State** — Conversations saved to SQLite, retrievable anytime
