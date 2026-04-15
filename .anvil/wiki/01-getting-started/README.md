# Getting Started

## Prerequisites

- **Node.js** 16+ and npm
- **Ollama** running locally (see [Stack → Ollama](#))
- **TypeScript** knowledge (project is ~80% TS)

## Clone and Install

```bash
git clone <repo-url>
cd mcp-demo
npm install
npm install -w src/server
npm install -w src/client
```

See [package.json](../../package.json) and workspace config.

## Run the Application

### Development Mode
```bash
npm run dev
```

This starts both server (port 3001) and client in parallel via [concurrently](https://github.com/open-cli-tools/concurrently).

- **Server** listens at `http://localhost:3001/mcp` for MCP transport
- **Client CLI** starts interactive chat in terminal
- **Client Web** serves UI at `http://localhost:5173` (if configured)

### Architecture
- [src/server/index.ts](../../src/server/index.ts) — HTTP bootstrap, port 3001
- [src/client/index.ts](../../src/client/index.ts) — Client orchestration, CLI/Web router
- [src/server/mcp.ts](../../src/server/mcp.ts) — MCP server + tool registry
- [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — MCP client HTTP transport

## Troubleshooting

### Ollama Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```

**Fix:** Start Ollama: `ollama serve` or use Docker
- [Ollama docs](https://ollama.ai)
- Model: hardcoded as `qwen3:8b` in [src/client/llm/ollama.ts:22](../../src/client/llm/ollama.ts#L22)

### Server Port 3001 Already in Use
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Web Assets Path Error
If running from different directory, [src/client/interfaces/web.ts:5](../../src/client/interfaces/web.ts#L5) hardcoded path `web/public` may fail. Consider relative/absolute path fix.

## Next Steps

- Read [02-architecture/overview.md](../02-architecture/overview.md) for system design
- Check [08-known-issues/tech-debt.md](../08-known-issues/tech-debt.md) for current concerns
- Explore tools in [src/server/tools](../../src/server/tools)
