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

## Done means

- `run_tests` reports 0 failures and `npm run typecheck` passes.
- New logic has tests that cover the acceptance criteria of the spec.
- Your final message lists what you changed and what you could not verify.
