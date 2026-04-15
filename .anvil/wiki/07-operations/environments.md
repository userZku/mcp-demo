# Environments

## Development

- **Server:** localhost:3001
- **Ollama:** localhost:11434 (local install)
- **Client:** CLI interactive or localhost:5173 (Web)
- **External APIs:** OpenMeteo (live)

Setup: [01-getting-started/README.md](../01-getting-started/README.md)

## Staging / Production

⚠ **Not yet configured.** Recommendations:

### Server
- Containerize with Docker
- Environment variables:
  - `OLLAMA_HOST` (could point to remote Ollama instance)
  - `PORT` (externalize from hardcoded 3001)
  - `LOG_LEVEL`

### Client
- CLI: Packaged as Node binary or Docker
- Web: Static assets + API gateway

## Configuration Management

_Currently hardcoded values (see [08-known-issues/tech-debt.md](../08-known-issues/tech-debt.md)):_
- Server port: [src/server/index.ts](../../src/server/index.ts#L1)
- Ollama model: [src/client/llm/ollama.ts:22](../../src/client/llm/ollama.ts#L22)
- MCP server URL: [src/client/mcp/client.ts](../../src/client/mcp/client.ts)
- Web assets path: [src/client/interfaces/web.ts:5](../../src/client/interfaces/web.ts#L5)

**Action:** Extract to environment variables or config file.

## See Also

- [07-operations/build-and-deploy.md](build-and-deploy.md)
