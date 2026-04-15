# Databases

## Current State

No persistent database is currently integrated. Application operates with:

- **File system** — For file I/O tool ([src/server/services/file.service.ts](../../src/server/services))
- **In-memory** — Chat history stored in [src/client/core/chatCore.ts](../../src/client/core/chatCore.ts) variables (lost on restart)

## Future Considerations

If adding persistent storage, consider:

1. **Conversation history** — SQLite, PostgreSQL, or MongoDB
2. **Tool execution logs** — For audit and debugging
3. **User sessions** — If multi-user Web UI is added

## See Also

- [03-stack/languages.md](languages.md)
