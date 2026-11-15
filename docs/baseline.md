# Baseline: Ersparnis im Warenkorb anzeigen

Aufgabe: „Zeig im Warenkorb an, wie viel der Kunde durch Rabatte erspart"

## Gelesene Dateien

Vollständig gelesen:
- `package.json` (Scripts, Stack: React, Zustand, Tailwind, Vitest)
- `src/lib/cart.ts`
- `src/lib/cart.test.ts`
- `src/lib/money.ts`
- `src/components/CartDrawer.tsx`
- `src/components/CartLine.tsx`
- `src/components/Price.tsx`
- `src/store/cartStore.ts`

Nur per `grep` überflogen:
- alle Vorkommen von `compareAt` in `src/` und `server/`. Daraus wusste ich, dass `normalize.ts` Streichpreise ≤ Preis auf `null` setzt.
- `src/pages/CheckoutPage.tsx` (nur Zeilen mit Subtotal/Money)

Nicht gelesen:
- `README.md`, `types.ts`, `normalize.ts` (nur die grep-Zeilen)
- `testFixtures.ts`. Deshalb lag meine erste Test-Annahme falsch, siehe unten.
- Eine `CLAUDE.md` gibt es nicht (`cat` lieferte nichts).

## Ausgangslage

Es gab schon eine „You save"-Zeile im Warenkorb-Footer. Sie hatte zwei Schwächen:
- Bei mehreren Währungen wurde sie ausgeblendet.
- Negative Differenzen durch veraltete Streichpreise wurden mitgezählt.

## Getroffene Annahmen (ohne Rückfrage)

- **Wo die Ersparnis erscheint:** an allen drei Stellen, also pro Artikel (durchgestrichener alter Preis + „You save …"), pro Shop (unter der Zwischensumme) und gesamt (im Footer).
- **Ausverkaufte Artikel:** zählen mit, genau wie sie in der Zwischensumme mitzählen. Beim Checkout werden sie übersprungen, die angezeigte Ersparnis kann also höher sein als die tatsächliche.
- **Mehrere Währungen:** werden nicht umgerechnet, sondern getrennt angezeigt (`40,00 $ + 20,00 €`) über das vorhandene `formatMultiCurrency`.
- **Veraltete Streichpreise:** Liegt der Streichpreis ≤ dem aktuellen Preis, ist die Ersparnis 0 und nie negativ.
- **Texte:** auf Englisch („You save", „You save with discounts"), passend zum Rest der App. Kein i18n.
- **Gestaltung:** Rot (`rose`) wie bei den vorhandenen Sale-Preisen. Der Footer-Hinweis bekam einen roten Hintergrund und einen neuen Text.
- **Checkout-Seite (`/checkout`):** bewusst nicht angepasst, weil nur „Warenkorb" verlangt war.

## Änderungen

- `src/lib/cart.ts`: neue Funktionen `lineSavings(item)` und `savingsByCurrency(items)`. `groupByStore` nutzt jetzt `lineSavings`.
- `src/components/CartLine.tsx`: alter Preis durchgestrichen (mit Screenreader-Text „Was") und „You save …" pro Zeile.
- `src/components/CartDrawer.tsx`: Ersparnis pro Shop. Die Gesamtersparnis wird jetzt pro Währung berechnet und auch bei mehreren Währungen angezeigt. Die alte Variable `isSingleCurrency` ist entfernt.

## Tests

- Zwei neue Unit-Tests in `src/lib/cart.test.ts` (`describe('savings')`):
  - `lineSavings`: normaler Fall, kein Streichpreis, veralteter Streichpreis unter dem Preis
  - `savingsByCurrency`: zwei Währungen, Währung ohne Rabatt wird weggelassen, leerer Warenkorb
- Keine Komponenten- oder UI-Tests für `CartLine` und `CartDrawer`.
- **Ehrlicher Hinweis:** Der erste Lauf schlug fehl. Ich hatte angenommen, das EUR-Fixture sei nicht rabattiert, ohne `testFixtures.ts` zu lesen. Ich habe dann die Erwartung im Test korrigiert, nicht den Code, und einen zusätzlichen Fall mit `compareAtCents: null` ergänzt. Der Fehler lag in der Testannahme, nicht in der Logik.

## Prüfungen

- `npx vitest run` (entspricht `npm test`): 84/84 Tests grün
- `npx tsc -b` (entspricht `npm run typecheck`): fehlerfrei
- Nicht ausgeführt: `npm run build` und ein Blick im Browser (`npm run dev`). Die Optik ist also ungeprüft.
- Nichts committet.

## Konventionen

Eingehalten:
- Gerechnet wird durchgehend in ganzzahligen Cents (`*Cents`, `number`), nie mit Kommazahlen.
- Formatiert wird nur über die vorhandenen `formatMoney` und `formatMultiCurrency`.
- Pure Logik liegt in `lib/cart.ts` mit Unit-Tests, die Komponenten nur anzeigen. `useMemo` wird wie im Bestand genutzt.
- Tailwind-Klassen und `tabular-nums` wie im übrigen Code.

Mögliche Abweichungen und Schwächen:
- Das Muster „durchgestrichener Preis + sr-only ‚Was'" habe ich in `CartLine` aus `Price.tsx` kopiert, statt die Komponente `Price` wiederzuverwenden. Das ist leichte Duplizierung.
- Pro Zeile erscheint die Ersparnis doppelt: als durchgestrichener Preis und als Text „You save …". Das ist eventuell redundant.
- Den Wortlaut und das Styling des schon vorhandenen Footer-Hinweises habe ich ungefragt geändert.
- Die Dateien habe ich per Python-String-Ersetzung über die Shell bearbeitet, nicht mit dem Edit-Tool. Das betrifft nur das Vorgehen, nicht den Code.
