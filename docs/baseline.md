# Baseline: run without harness

Branch `baseline` in the project. Claude Code without `AGENTS.md`, spec, own tools or rules.
Prompt: „Zeig im Warenkorb an, wie viel der Kunde durch Rabatte erspart."

## What the agent did

- Read 8 files to understand the project (`package.json`, `cart.ts`, `cart.test.ts`, `money.ts`, `CartDrawer.tsx`, `CartLine.tsx`, `Price.tsx`, `cartStore.ts`).
- Added `lineSavings` and `savingsByCurrency` in `cart.ts`, changed `CartLine.tsx` and `CartDrawer.tsx`.
- Tests: 84/84 green, typecheck clean. No UI check.

## Diagnosis: what it guessed or did on its own

| Problem | Example |
| --- | --- |
| Scope guessed | showed savings in three places (per item, per shop, total), although only "cart" was asked |
| Business rule guessed | unavailable items count towards savings, although they are skipped at checkout |
| Unrequested changes | changed text and style of the existing footer hint |
| Wrong test assumption | assumed a fixture was not discounted without reading `testFixtures.ts`; then fixed the test, not the code |
| Expensive orientation | had to search money conventions (cents, `formatMultiCurrency`) in the code |

## With harness (F-01, same feature)

| | Without harness | With harness |
| --- | --- | --- |
| What to build | guessed | spec with AC-1 to AC-6 |
| Unavailable items | counted | not counted (AC-3) |
| Conventions | searched in code | known from `AGENTS.md` (cents, per currency) |
| Check | `npm test` via Bash, full output | own tool `run_tests`, only failures as JSON |
| Scope | three places + footer text changed | only `cart.ts`, `cart.test.ts`, `CartDrawer.tsx` |
