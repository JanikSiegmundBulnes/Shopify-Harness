# Bazaar – agent handbook

Bazaar shows products from several Shopify stores in one storefront and one cart. React 19, TypeScript (strict), Vite, Vitest + jsdom, Zustand for state, Tailwind for styles.

## Commands

- Tests: use the tool `run_tests` (preferred) or `npm test`
- Type check: `npm run typecheck`
- Build: `npm run build`
- Do not start the dev server (`npm run dev`); it never exits.

## Rules the code does not show

- Money is always integer cents (`priceCents`, `compareAtCents`). Never use floats for money. Convert only for display via `formatMoney` in `src/lib/money.ts`.
- A cart can mix currencies. Sum per currency (see `totalsByCurrency` in `src/lib/cart.ts`), never across them.
- Pure logic lives in `src/lib/`, state in `src/store/`, UI in `src/components/`. New logic in `src/lib/` gets a test file next to it (`name.test.ts`).
- Product descriptions come from foreign shops. Never render them as HTML.
- Specs live in `specs/`. Read the spec named in the task first.

## Definition of done

A task is done only when every item below holds. Your final message lists
each item with the check you ran and its result.

Functional

- The acceptance tests named in the spec pass: `run_tests` with suite `acceptance`.
  Technical
- `run_tests` with suite `all` reports 0 failures.
- `run_typecheck` reports 0 errors.
- New logic in src/lib has unit tests next to it.
  Organisational
- No commit, no push: leave all changes in the working tree for review.

Never change tests in src/acceptance/, test or TypeScript config, or
skip tests to make a check pass. If a check cannot pass, stop and explain why.
