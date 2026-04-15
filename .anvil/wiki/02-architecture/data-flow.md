# Data Flow

## Message Flow

```
User Message
    ↓
[CLI Interface / Web Interface]
    ↓
[Chat Core] — Orchestration & tool calling
    ↓
[Ollama LLM] — Streaming response with function calls
    ↓
[MCP Client] — Sends tool call requests
    ↓
[HTTP] — localhost:3001/mcp
    ↓
[MCP Server] — Receives tool request
    ↓
[Tool] — readFile, weather, add, getTime, etc.
    ↓
[Service] — file.service, weather.service
    ↓
[Result] — Response streamed back to LLM
    ↓
[Ollama] — Continues generation with tool result
    ↓
[Chat Core] — Formats response
    ↓
[UI] — Displays to user
```

## Tool Execution

Each tool in [src/server/tools/](../../src/server/tools/) follows:
1. Receive tool call from MCP server
2. Validate input with Zod schema
3. Call service (file.service, weather.service, etc.)
4. Return result or error

See [08-known-issues/tech-debt.md#error-handling-inconsistency](../08-known-issues/tech-debt.md#error-handling-inconsistency) for error patterns.

## See Also

- [02-architecture/overview.md](overview.md)
- [02-architecture/modules.md](modules.md)
