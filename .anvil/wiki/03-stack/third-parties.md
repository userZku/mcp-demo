# Third-Party Integrations

## External APIs

### OpenMeteo Weather API
- **Service:** [src/server/services/weather.service.ts](../../src/server/services/weather.service.ts)
- **Endpoints:**
  - Geocoding: https://geocoding-api.open-meteo.com/v1/search
  - Forecast: https://api.open-meteo.com/v1/forecast
- **Tool:** [src/server/tools/external/weather.ts](../../src/server/tools/external/weather.ts)
- **Usage:** Chat tool to query current temperature by city name

## LLM Service

### Ollama
- **Type:** Local LLM inference (HTTP API)
- **Server:** localhost:11434 (default)
- **Client:** [src/client/llm/ollama.ts](../../src/client/llm/ollama.ts)
- **Model:** `qwen3:8b` (hardcoded, see [known issue](../08-known-issues/tech-debt.md#hardcoded-model-reference))
- **Features:** Streaming, function calling (MCP tool support)

## MCP Protocol SDK

- **Package:** @modelcontextprotocol/sdk
- **Client:** [src/client/mcp/client.ts](../../src/client/mcp/client.ts) — HTTP transport client
- **Server:** [src/server/mcp.ts](../../src/server/mcp.ts) — MCP server with tool registry

## See Also

- [03-stack/languages.md](languages.md)
