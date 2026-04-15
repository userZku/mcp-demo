# Dead Code and Unused Artifacts

## Current Assessment

⚠ **No comprehensive dead code analysis performed.**

From cartography inspection, all detected modules are imported at least once.

## Potential Candidates

- [src/client/web/public/index.html](../../src/client/web/public/index.html) — Check if fully linked
- [src/client/web/public/styles.css](../../src/client/web/public/styles.css) — May be unused if Web UI not active

## Recommendations

1. **Node.js dead code scanner:** Use [ts-prune](https://github.com/nadeepooran/ts-prune) or linting
2. **CSS purging:** Use [PurgeCSS](https://purgecss.com/) if Web UI is included
3. **Bundle analysis:** Use webpack-bundle-analyzer for production builds

## See Also

- [08-known-issues/tech-debt.md](tech-debt.md)
