# mcp-demo

Assistant IA outille avec MCP, en TypeScript, avec une interface Web et un mode CLI.

## Ce que propose le projet

- Conversation avec un modele local via Ollama
- Utilisation d'outils MCP pendant le chat (fichiers, meteo, calcul, systeme)
- Interface Web prete a l'emploi
- Mode CLI pour usage terminal

## Technologies utilisees

- Node.js
- TypeScript
- MCP SDK (`@modelcontextprotocol/sdk`)
- Ollama
- Express
- tsx
- concurrently

## Prerequis

1. Node.js 18+
2. Ollama installe et en cours d'execution
3. Modele Ollama disponible (exemple: `qwen3:8b`)

```bash
ollama pull qwen3:8b
```

## Installation

```bash
npm install
```

## Lancement

### Mode Web (recommande)

Lance le serveur MCP et le client web en parallele:

```bash
npm run dev
```

Puis ouvrir:

- Web UI: http://localhost:3000
- MCP Server: http://localhost:3001/mcp

### Mode CLI

Terminal 1:

```bash
npm run dev -w src/server
```

Terminal 2:

```bash
npm run dev -w src/client -- --cli
```
