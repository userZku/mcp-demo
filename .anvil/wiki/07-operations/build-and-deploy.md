# Build and Deploy

## Development

### Prerequisites
- Node.js 16+
- TypeScript 5.3+
- Ollama (for LLM features)
- npm workspaces support

### Start Development

```bash
npm install                    # Root dependencies
npm install -w src/server      # Server dependencies
npm install -w src/client      # Client dependencies
npm run dev                    # Start in dev mode
```

### What npm run dev Does

Starts:
1. **Server** — HTTP server on port 3001, MCP endpoint at /mcp
2. **Client** — CLI or Web UI (depending on environment)

Both run in parallel via [concurrently](https://github.com/open-cli-tools/concurrently).

## Compilation

### TypeScript Compilation

Three `tsconfig.json` files:
- [tsconfig.json](../../tsconfig.json) — Root shared config
- [src/client/tsconfig.json](../../src/client/tsconfig.json) — Client-specific
- [src/server/tsconfig.json](../../src/server/tsconfig.json) — Server-specific

### Build Command

```bash
npm run build                  # (if configured)
npx tsc                        # Manual compile
```

## Deployment

⚠ **Not yet documented.** Considerations:

1. **Environment separation:** Client and Server should run in separate processes
2. **Configuration:** Ollama host, OpenMeteo API (if auth needed), file paths should be configurable
3. **Port binding:** Server port 3001, Client Web port (unspecified)

## Environment Variables

⚠ **Not yet detected.** Should externalize:
- `OLLAMA_HOST` — Default: localhost:11434
- `MCP_SERVER_URL` — Default: http://localhost:3001/mcp
- `PORT` (for server) — Default: 3001
- `LOG_LEVEL` — Debug, info, warn, error

See [08-known-issues/tech-debt.md](../08-known-issues/tech-debt.md) for hardcoded values needing externalization.

## See Also

- [01-getting-started/README.md](../01-getting-started/README.md) — Quick start
- [07-operations/environments.md](environments.md)
