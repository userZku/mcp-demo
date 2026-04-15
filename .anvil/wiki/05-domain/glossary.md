# Domain Glossary

_Placeholder — To be populated by `domain-extractor` in vague 2._

This section will document:
- Business domain terms
- Functional vocabulary
- User-facing concepts
- Domain models

For now, key technical terms from the codebase:

- **MCP** — Model Context Protocol (client-server message protocol for AI tool access)
- **Tool** — Callable function exposed via MCP (file I/O, weather, math, etc.)
- **Ollama** — Local LLM inference engine
- **Chat agent** — The conversation loop with tool-calling capability
- **Streaming** — Response data sent in chunks (from Ollama to client)
- **Function calling** — LLM requesting execution of a tool based on user message
