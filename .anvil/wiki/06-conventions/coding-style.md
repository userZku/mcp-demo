# Coding Style

## TypeScript

### Configuration
- **File:** [tsconfig.json](../../tsconfig.json)
- **Target:** ES2020+
- **Strict mode:** ✅ enabled (likely)

### Naming Conventions

#### Files
- **PascalCase** for service files: `file.service.ts`, `weather.service.ts`
- **camelCase** for util/tool files: `chatCore.ts`, `ollama.ts`
- **kebab-case** for directories: `mcp/`, `core/`, `tools/`

#### Functions
- Factory functions: `create*` prefix
  - [createChatCore()](../../src/client/core/chatCore.ts)
  - [createMcpClient()](../../src/client/mcp/client.ts)
  - [createMcpServer()](../../src/server/mcp.ts)

- Service methods: Descriptive verbs
  - [readFileSafe()](../../src/server/services/file.service.ts)
  - [writeFileSafe()](../../src/server/services)
  - [getWeather()](../../src/server/services/weather.service.ts)

#### Classes/Interfaces
PascalCase for type definitions. (Exact conventions ⚠ to-confirm from explicit interface definitions.)

### Type Annotations

⚠ **Issue:** Heavy use of `any` type in chat interface layers:
- [src/client/core/chatCore.ts:7](../../src/client/core/chatCore.ts#L7) — any type for client/tools parameters
- [src/client/interfaces/cli.ts:3](../../src/client/interfaces/cli.ts#L3) — any type for chat parameter
- [src/client/interfaces/web.ts:3](../../src/client/interfaces/web.ts#L3) — any type for chat parameter

**Recommendation:** Define typed interfaces for chat state and tool parameters. See [08-known-issues/tech-debt.md#type-safety-issue](../08-known-issues/tech-debt.md#type-safety-issue).

## See Also

- [06-conventions/git-workflow.md](git-workflow.md)
- [06-conventions/testing-strategy.md](testing-strategy.md)
