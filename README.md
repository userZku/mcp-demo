# mcp-demo

Assistant IA outillé avec MCP, en TypeScript, avec une interface Web et un mode CLI.

## 🚀 Démarrage rapide

**Pour une documentation complète, consultez [le wiki Anvil](.anvil/wiki/index.md)**

### Installation

```bash
npm install
npm run dev
```

Accédez à http://localhost:3000 pour l'interface Web.

## 📚 Documentation

Pour plus de détails, consultez le **[Wiki Anvil](.anvil/wiki/index.md)**:

- **[Getting Started](.anvil/wiki/01-getting-started/README.md)** — Installation, prérequis, lancement
- **[Architecture](.anvil/wiki/02-architecture/overview.md)** — Design système et modules
- **[Stack Technologique](.anvil/wiki/03-stack/languages.md)** — Technologies utilisées
- **[Features](.anvil/wiki/04-features/README.md)** — Fonctionnalités implémentées
- **[Conventions](.anvil/wiki/06-conventions/coding-style.md)** — Standards de code
- **[Operations](.anvil/wiki/07-operations/build-and-deploy.md)** — Build et déploiement
- **[Issues Connues](.anvil/wiki/08-known-issues/tech-debt.md)** — Problèmes et améliorations futures

## ✨ Fonctionnalités

- Chat avec modèle local via Ollama
- Utilisation d'outils MCP pendant le chat (fichiers, météo, calcul, système)
- **Persistance des conversations** en SQLite (CLI et Web)
- **Gestion des conversations** — Historique, sélection, suppression
- Interface Web prête à l'emploi avec sidebar
- Mode CLI pour usage terminal
- Streaming des réponses en temps réel

## 🛠 Technologies

- Node.js • TypeScript • MCP SDK
- Ollama • Express • SQLite (better-sqlite3)
- tsx • concurrently

## 📋 Prérequis

1. **Node.js 18+**
2. **Ollama** installé et en cours d'exécution
3. **Modèle Ollama** disponible

```bash
ollama pull qwen3:8b
```

## 🎯 Lancement

### Mode Web (recommandé)

```bash
npm run dev
```

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

---

**Voir [Getting Started](.anvil/wiki/01-getting-started/README.md) pour les détails complets.**
