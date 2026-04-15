# Known Issues — Technical Debt

## Critical Issues

### Type Safety Issue
**Severity:** 🔴 High | **Status:** to-confirm | **Effort:** Medium

Heavy use of `any` type in chat interface layers. Client/tools parameters lack type annotations.

**Files:**
- [src/client/core/chatCore.ts:7](../../src/client/core/chatCore.ts#L7) — any type
- [src/client/core/cliChat.ts:7](../../src/client/core/cliChat.ts#L7) — any type
- [src/client/core/webChat.ts:7](../../src/client/core/webChat.ts#L7) — any type
- [src/client/interfaces/cli.ts:3](../../src/client/interfaces/cli.ts#L3) — any type for chat parameter
- [src/client/interfaces/web.ts:3](../../src/client/interfaces/web.ts#L3) — any type for chat parameter

**Recommendation:** Define typed interfaces for chat state, tool parameters, and responses.

### Hardcoded Model Reference
**Severity:** 🟡 Medium | **Status:** to-confirm | **Effort:** Low

Ollama model name hardcoded as `qwen3:8b`. Should be configurable via environment variable.

**File:** [src/client/llm/ollama.ts:22](../../src/client/llm/ollama.ts#L22)

**Fix:**
```typescript
const modelName = process.env.OLLAMA_MODEL || 'qwen3:8b';
```

### Error Handling Inconsistency
**Severity:** 🟡 Medium | **Status:** to-confirm | **Effort:** Medium

Some tools return `{isError: true}`, others throw exceptions. No unified pattern.

**Files:**
- [src/server/tools/file/readFile.ts](../../src/server/tools/file/readFile.ts) — returns `isError`
- [src/server/tools/file/writeFile.ts](../../src/server/tools/file/writeFile.ts) — returns `isError`
- [src/server/tools/external/weather.ts](../../src/server/tools/external/weather.ts) — returns `isError`
- Other tools — pattern inconsistent

**Recommendation:** Standardize to either:
1. Return `{isError: true, message: string}` for all tools
2. Throw custom error class for all tools

## Medium Priority

### Circular Architecture Risk
**Severity:** 🟡 Medium | **Status:** to-confirm | **Effort:** High

Client talks to Server via MCP over HTTP (localhost:3001), but both run in same process context. Deployment boundary unclear.

**Files:**
- [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — HTTP client to localhost:3001/mcp
- [src/server/index.ts](../../src/server/index.ts) — HTTP server on port 3001

**Concern:** In production, these should be separate services. Documentation should clarify deployment model.

### Web Assets Path Hardcoded
**Severity:** 🟡 Medium | **Status:** to-confirm | **Effort:** Low

[src/client/interfaces/web.ts:5](../../src/client/interfaces/web.ts#L5) uses hardcoded path `web/public` for static assets. Relative path may fail if run from different directory.

**Fix:**
```typescript
const publicPath = path.resolve(__dirname, '../../web/public');
```

### Missing Schema Definitions
**Severity:** 🟡 Medium | **Status:** to-confirm | **Effort:** Medium

Multiple tools use incomplete Zod schemas. [readFile.ts](../../src/server/tools/file/readFile.ts) inputSchema lacks `properties` wrapper for MCP/OpenAPI compliance.

**Action:** Verify Zod schema compliance with MCP spec.

## Low Priority

### Incomplete Environment Configuration
**Severity:** 🟢 Low | **Status:** probable | **Effort:** Low

No `.env` or config loader detected. Hardcoded values throughout:
- Server port: 3001
- Ollama host: localhost:11434
- MCP URL: http://localhost:3001/mcp

**Recommendation:** Add dotenv and config file.

### Chat Persistence — Memory Loading
**Severity:** 🟢 Low | **Status:** confirmed | **Effort:** Low-Medium

[src/client/services/conversation.service.ts](../../src/client/services/conversation.service.ts) loads all messages from a conversation into memory at once.

**Current behavior:** Works fine for typical chat sessions (< 10K messages)  
**Potential issue:** Very long conversation histories could exceed available RAM  

**Future improvement:** Implement pagination or streaming load for large conversations.

## See Also

- [02-architecture/overview.md](../02-architecture/overview.md) — Architecture concerns
- [06-conventions/coding-style.md](../06-conventions/coding-style.md) — Code quality

