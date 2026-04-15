# Architecture Overview

## Architectural Style

**Client-Server with Model Context Protocol (MCP)** ✅ certain

Evidence:
- [src/client/index.ts](../../src/client/index.ts) — Runs MCP client connecting to HTTP server
- [src/server/index.ts](../../src/server/index.ts) — Exposes HTTP endpoint at `/mcp` for MCP transport
- [src/server/mcp.ts](../../src/server/mcp.ts) — MCP server factory instantiated on each request
- [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — MCP client factory with StreamableHTTPClientTransport

## Identified Layers

### 1. Entrypoint
**Application orchestration and startup**

- [src/client/index.ts](../../src/client/index.ts) — Chooses CLI vs Web mode via command-line args
- [src/server/index.ts](../../src/server/index.ts) — Creates HTTP server listening on port 3001

### 2. MCP Protocol
**MCP client/server implementations**

- [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — Creates MCP client with HTTP transport
- [src/server/mcp.ts](../../src/server/mcp.ts) — Creates MCP server and registers tools

### 3. Chat Core
**AI chat logic independent of UI**

- [src/client/core/chatCore.ts](../../src/client/core/chatCore.ts) — Core chat engine (agentic loop, tool calling)
- [src/client/core/cliChat.ts](../../src/client/core/cliChat.ts) — CLI-specific wrapper
- [src/client/core/webChat.ts](../../src/client/core/webChat.ts) — Web-specific wrapper (minimal response)

### 4. Interface
**UI layer — CLI or Web**

- [src/client/interfaces/cli.ts](../../src/client/interfaces/cli.ts) — readline-based CLI
- [src/client/interfaces/web.ts](../../src/client/interfaces/web.ts) — Express.js HTTP server + static assets

### 5. LLM Integration
**LLM model communication (Ollama)**

- [src/client/llm/ollama.ts](../../src/client/llm/ollama.ts) — Ollama chat requests with streaming
- [src/client/core/tools.ts](../../src/client/core/tools.ts) — Tool format adapter (MCP → Ollama function calling)

### 6. Tool Definitions
**MCP tool specifications**

- [src/server/tools/tools.ts](../../src/server/tools/tools.ts) — Tool aggregator
- [src/server/tools/file/{readFile,writeFile}.ts](../../src/server/tools/file) — File I/O tools
- [src/server/tools/math/add.ts](../../src/server/tools/math) — Arithmetic tool
- [src/server/tools/system/getTime.ts](../../src/server/tools/system) — System time tool
- [src/server/tools/external/weather.ts](../../src/server/tools/external) — Weather tool

### 7. Service Layer
**External service integrations**

- [src/server/services/file.service.ts](../../src/server/services) — File I/O safety layer
- [src/server/services/weather.service.ts](../../src/server/services) — Weather API client (OpenMeteo)

## Key Patterns

- **Separation of Concerns:** Chat logic (chatCore) is independent of transport (CLI vs Web)
- **Tool Abstraction:** Tools defined once in server, adapted to Ollama format on client
- **Streaming:** Responses stream from Ollama → chatCore → interface
- **Error Handling:** ⚠ to-confirm — Some tools return `isError: true`, others throw. See [08-known-issues](../08-known-issues/tech-debt.md#error-handling-inconsistency).

## See Also

- [02-architecture/modules.md](modules.md) — Detailed module map and dependencies
- [02-architecture/data-flow.md](data-flow.md) — Who talks to whom and when
