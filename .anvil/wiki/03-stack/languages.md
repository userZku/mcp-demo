# Stack — Languages and Frameworks

## Runtime

### Node.js
- **Version:** 20.17.0 (detected from `node --version`)
- **Module system:** ES2020 (modern async/await, top-level await)
- **Package manager:** npm 11.12.1

## Language

### TypeScript
- **Version:** 5.3.0
- **Configuration:** [tsconfig.json](../../tsconfig.json)
- **Coverage:** ~80% of codebase is TypeScript
- **Strict mode:** Enabled (likely, based on project structure)

## Web Framework

### Express
- **Version:** 4.18.2
- **Usage:** Web interface [src/client/interfaces/web.ts](../../src/client/interfaces/web.ts)
- **Role:** HTTP server for static assets (chat UI)

## MCP Protocol

### @modelcontextprotocol/sdk
- **Role:** Model Context Protocol implementation
- **Client:** [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — StreamableHTTPClientTransport
- **Server:** [src/server/mcp.ts](../../src/server/mcp.ts) — McpServer + tool registry
- **Transport:** HTTP over localhost:3001/mcp

## LLM Integration

### Ollama
- **Role:** Local LLM inference
- **File:** [src/client/llm/ollama.ts](../../src/client/llm/ollama.ts#L1-L7)
- **Model:** Hardcoded `qwen3:8b` (should be configurable)
- **Features:** Streaming, function calling (tool support)
- **Server:** localhost:11434

## Validation

### Zod
- **Purpose:** Input schema validation for tools
- **Usage:**
  - [src/server/tools/file/readFile.ts](../../src/server/tools/file/readFile.ts) — File path validation
  - [src/server/tools/file/writeFile.ts](../../src/server/tools/file/writeFile.ts) — File path + content validation
  - [src/server/tools/math/add.ts](../../src/server/tools/math/add.ts) — Number validation
  - [src/server/tools/external/weather.ts](../../src/server/tools/external/weather.ts) — City name validation

⚠ **Note:** Some schemas are incomplete (check [08-known-issues/tech-debt.md#missing-schema-definitions](../08-known-issues/tech-debt.md#missing-schema-definitions))

## Development Tools

### TypeScript
- Compiler: TypeScript 5.3.0
- Configuration: [tsconfig.json](../../tsconfig.json)

### tsx
- **Purpose:** Run TypeScript files without compilation step
- **Usage:** Development and tooling

### ts-node
- **Purpose:** TypeScript Node.js runtime
- **Version:** 10.9.1

### Concurrently
- **Purpose:** Run multiple scripts in parallel
- **Usage:** `npm run dev` starts server and client simultaneously
- **File:** [package.json scripts](../../package.json)

## See Also

- [03-stack/databases.md](databases.md)
- [03-stack/third-parties.md](third-parties.md) — External APIs
- [07-operations/build-and-deploy.md](../07-operations/build-and-deploy.md) — Build process
