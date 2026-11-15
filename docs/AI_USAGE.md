# AI usage

| File | AI generated | How checked | By |
| --- | --- | --- | --- |
| `template/AGENTS.md` | partly (structure from Claude, rules written by us) | each command run in the project; rules compared with the baseline run | Janik & Linus |
| `template/CLAUDE.md` | no | Claude Code answers questions from `AGENTS.md` without reading files | Janik & Linus |
| `template/.claude/settings.json` | yes (Claude) | `run_typecheck` denial in the first M2 run found and fixed; sandbox tested with `curl` (approval required) | Janik & Linus |
| `template/.claude/hooks/protect-checks.mjs` | yes (Claude) | hook test: prompt to add `it.skip` to `src/lib/cart.test.ts` was blocked | Janik & Linus |
| `mcp/run-tests.ts` | yes (Claude, from our guide) | read; 3 cases with `scripts/try-run-tests.ts` (green, red, wrong path) | Janik & Linus |
| `mcp/run-typecheck.ts` | yes (Claude) | read; `scripts/try-typecheck.ts`: green case `ok: true`, red case (`const x: number = "a"`) reports TS2322 with file and line | Janik & Linus |
| `mcp/server.ts` | yes (Claude); bug in `unit` suite and missing `return` found and fixed | both tools used successfully in the M2 run (`docs/logs/m2-f02.jsonl`) | Janik & Linus |
| `install.sh` | yes (Claude) | run on the project, paths in `.mcp.json` checked | Janik & Linus |
| `tsconfig.json` | yes (Claude) | `npx tsc -p .` exits without errors | Janik & Linus |
| `scripts/try-run-tests.ts`, `scripts/try-typecheck.ts` | yes (Claude) | run against the project | Janik & Linus |
| `scripts/summarize-log.mjs` | yes (Claude) | output compared with the raw logs of M1 and M2 | Janik & Linus |
| `docs/M2.md` | yes (Claude, from our logs) | facts checked against logs and config | Janik & Linus |
| `docs/baseline.md` | yes (Claude, from the baseline run) | compared with the baseline branch in the project | Janik & Linus |
| specs and acceptance tests in the project (`specs/`, `src/acceptance/`) | partly (Claude, from our guide) | each acceptance criterion checked by hand | Janik & Linus |
