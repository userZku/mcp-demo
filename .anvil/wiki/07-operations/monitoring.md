# Monitoring

## Logging

_Not yet implemented._ Recommendations:

- Use [pino](https://getpinojs.io/) or [winston](https://github.com/winstonjs/winston) for structured logging
- Log tool calls and results for debugging
- Log Ollama requests/responses in debug mode

## Health Checks

- Server: Endpoint `GET /health` (not yet detected)
- Ollama: Check `localhost:11434/api/tags` for available models
- OpenMeteo: Monitoring external API SLA (no action required)

## Performance Metrics

_Not yet instrumented._

Candidates:
- Chat response time
- Tool execution time
- MCP request/response size
- Ollama inference latency

## See Also

- [07-operations/build-and-deploy.md](build-and-deploy.md)
