# Shopify Harness for Bazaar

A harness for Claude Code that lets the agent work reliably on Bazaar
(React/TypeScript storefront for several Shopify stores).

Base agent: Claude Code 2.1.3.5 from `claude --version`>
Model: Claude Sonnet 5.5 (see docs/model-selection.md)

## Requirements

Node 20+, Claude Code, access to the model.

## Install into a project

```bash
npm install
./install.sh /path/to/project
```

Copies AGENTS.md, CLAUDE.md and .claude/ into the project and writes
.mcp.json that starts our MCP server.

## Use

- Interactive: `cd project && claude`
- Headless: `claude -p "Implement specs/F-01-savings-in-cart.md"`

## Our tools

| Tool      | What it does                               | Permission | Why       |
| --------- | ------------------------------------------ | ---------- | --------- |
| run_tests | runs Vitest, returns only failures as JSON | allow      | read-only |

## Known limits

- Deny rules can be bypassed by scripts; no sandbox yet (planned for M2).
- …

## AI usage

See docs/AI_USAGE.md.
