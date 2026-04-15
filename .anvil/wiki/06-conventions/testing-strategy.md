# Testing Strategy

## Current State

⚠ **No test files detected** in the cartography scan.

Status:
- Unit tests: Not found
- Integration tests: Not found
- E2E tests: Not found

## Recommended Strategy

### For Chat Core
- **Unit:** Test [chatCore.ts](../../src/client/core/chatCore.ts) with mock Ollama responses
- **Integration:** Test full flow (message → tool call → tool result → response)

### For Tools
- **Unit:** Each tool in [src/server/tools/](../../src/server/tools/) should validate Zod schema
- **Mock:** OpenMeteo API, file system, Ollama

### For Services
- **Unit:** [file.service.ts](../../src/server/services/file.service.ts) with temp files
- **Unit:** [weather.service.ts](../../src/server/services/weather.service.ts) with mocked HTTP calls

## Test Framework Recommendation

- **jest** or **vitest** for TypeScript test runner
- **@testing-library** for DOM testing (if Web UI added)
- **nock** or **msw** for HTTP mocking

## CI/CD Integration

_Not yet detected._ Consider GitHub Actions for:
1. Run tests on PR
2. Type checking (TypeScript)
3. Linting (ESLint recommended)

## See Also

- [06-conventions/coding-style.md](coding-style.md)
- [07-operations/build-and-deploy.md](../07-operations/build-and-deploy.md)
