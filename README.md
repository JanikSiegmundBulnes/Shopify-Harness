# Shopify Harness for Bazaar

A harness for Claude Code that lets the agent work reliably on Bazaar
(React/TypeScript storefront for several Shopify stores, repo `Shopify-Claude-Test`).

- Base agent: Claude Code 2.1.325
- Model: Claude Sonnet 5.5 (chosen by our model criteria matrix)

## Requirements

Node 20+, Claude Code, access to the model. macOS for the sandbox
(Linux/WSL2 need `bubblewrap` and `socat`).

## Install into a project

```bash
npm install
./install.sh /path/to/project
```

Copies `AGENTS.md`, `CLAUDE.md` and `.claude/` (settings and hooks) into the
project and writes `.mcp.json`, which starts our MCP server from this folder.
Run it again after every change to the harness, then restart Claude Code.

## Use

- Interactive: `cd /path/to/project && claude`
- Headless, with stop criterion:
  `claude -p "Implement specs/F-02-sort-by-savings.md" --permission-mode acceptEdits --max-turns 30`
- Readable log summary: `node scripts/summarize-log.mjs <log.jsonl>`

## Structure

| Path | Content |
| --- | --- |
| `template/AGENTS.md`, `template/CLAUDE.md` | context file; `CLAUDE.md` imports `AGENTS.md` |
| `template/.claude/settings.json` | permissions, hooks, sandbox |
| `template/.claude/hooks/protect-checks.mjs` | blocks skipped tests, silenced type errors, `.env` access |
| `mcp/` | MCP server `bazaar` with our tools |
| `scripts/` | tests for the tools without a model, log summary |
| `docs/` | baseline, M2 documentation, AI usage, logs |

## Our tools

| Tool | What it does | Permission | Why |
| --- | --- | --- | --- |
| `run_tests` | runs Vitest (`suite`: all / unit / acceptance), returns only failures as JSON | allow | read-only |
| `run_typecheck` | runs the TypeScript check, returns errors as JSON (max. 20) | allow | read-only |

## Protection

- Permissions: the agent may edit `src/`, but not the acceptance tests,
  test/TypeScript config, `package.json` or its own rules; no `git commit`/`git push`; no `.env`.
- Hook `protect-checks.mjs` (PreToolUse, exit code 2) blocks `.skip`/`.only`/`.todo`,
  `@ts-ignore`/`@ts-nocheck`/`@ts-expect-error` and `.env` in shell commands.
- Sandbox: shell commands may only write inside the project and need approval for network access.
- Stop criterion: `--max-turns` in headless runs.

## Known limits

- The MCP server, the file tools and hooks run outside the sandbox.
- The hook only detects known spellings; obfuscated variants pass.
- `--max-turns` exists only in headless mode.
- `--permission-mode acceptEdits` allows every edit that no deny rule matches.

## AI usage

See `docs/AI_USAGE.md`.
