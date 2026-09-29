# config

Setup and configuration — env vars, flags, how to run the project.

## Package scripts and public entry

What: npm package `guardia-shared` (ESM) built with `tsc -p tsconfig.build.json` into dist/, exposed only via `exports["."]`; `npm run typecheck` checks src + tests, `npm test` runs vitest; zod is the sole runtime dependency · Why: consumers import from the package name without internal paths, and `expectTypeOf` assertions in tests are only enforced by typecheck (vitest does not typecheck) · Where: package.json, tsconfig.json, tsconfig.build.json
