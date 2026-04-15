# Git Workflow

## Branch Strategy

_Assumed from typical Node.js project setup (⚠ to-confirm):_

- **main** — Production releases
- **develop** — Integration branch
- **feature/*** — Feature branches
- **bugfix/*** — Bug fix branches

## Workspace Setup

Monorepo with `npm workspaces`:
- [package.json](../../package.json) defines workspaces:
  - `src/server`
  - `src/client`

Each workspace has its own `package.json` and `tsconfig.json`.

## Installation

```bash
npm install                    # Root dependencies
npm install -w src/server      # Server workspace
npm install -w src/client      # Client workspace
```

See [01-getting-started/README.md](../01-getting-started/README.md) for setup steps.

## See Also

- [06-conventions/coding-style.md](coding-style.md)
- [07-operations/build-and-deploy.md](../07-operations/build-and-deploy.md)
