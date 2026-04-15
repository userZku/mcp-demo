# Agent Configuration — Anvil

**Target**: copilot

## Initialization — MANDATORY

**Prerequisite:** Before running any `anvil` command, check if the CLI is available (`anvil --version`). If not installed, run `npm install -g @fr-nan-ai/anvil` first. This is only needed when modifying components — reading existing skills and instructions requires no installation.

**FIRST**: Check `.anvil/config.json`. If `onboarded` is not `true`, read and execute the onboarding skill at `.github/instructions/onboarding.instructions.md` before any other action.

## About Anvil

This project is managed by **anvil** (`@fr-nan-ai/anvil`), an agent-first CLI that installs and maintains your AI components. Anvil is the source of truth for all skills, hooks, agents, and recipes in this project.

**Essential commands:**
- `anvil status` — see all installed components and their state
- `anvil catalog` — browse available components from the marketplace
- `anvil install <type> <name>` — install a component (skill, hook, agent, recipe)
- `anvil remove <type> <name>` — remove a component
- `anvil generate` — re-project state to surface files after changes
- `anvil validate` — check project integrity

## Installed Components

### Skills
- **onboarding** — `.github/instructions/onboarding.instructions.md`
- **anvil-cli-reference** — `.github/instructions/anvil-cli-reference.instructions.md`
- **catalog-browser** — `.github/instructions/catalog-browser.instructions.md`
- **coding-principles** — `.github/instructions/coding-principles.instructions.md`
- **test-driven-development** — `.github/instructions/test-driven-development.instructions.md`
- **implement-feature** — `.github/instructions/implement-feature.instructions.md`
- **verification-before-completion** — `.github/instructions/verification-before-completion.instructions.md`
- **analyze-codebase-deep** — `.github/instructions/analyze-codebase-deep.instructions.md`
- **generate-project-wiki** — `.github/instructions/generate-project-wiki.instructions.md`
- **generate-runnable-readme** — `.github/instructions/generate-runnable-readme.instructions.md`

### Hooks
_No hooks installed._

### Agents
- **legacy-cartographer** — `.github/agents/legacy-cartographer.agent.md`

### Recipes
_No recipes installed._

## Project Knowledge Base

If `.anvil/wiki/` exists, read `.anvil/wiki/index.md` first to navigate the project knowledge base. The wiki was created during onboarding and is your primary reference for understanding this codebase. Always cite the wiki when you make a claim about the project (e.g. "according to .anvil/wiki/02-architecture/modules.md").

Only load wiki sections relevant to your current task to minimize token usage. If you observe code that contradicts what the wiki states, surface the discrepancy to the user and suggest a wiki refresh.
