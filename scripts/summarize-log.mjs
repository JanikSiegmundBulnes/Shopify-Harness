// Turns a Claude Code stream-json log into a short, readable timeline.
// Usage: node scripts/summarize-log.mjs <path to .jsonl log>
import { readFileSync } from "node:fs"

const file = process.argv[2]
if (!file) { console.error("Usage: node scripts/summarize-log.mjs <log.jsonl>"); process.exit(1) }

const events = readFileSync(file, "utf8").trim().split("\n")
  .map((line) => { try { return JSON.parse(line) } catch { return null } })
  .filter(Boolean)

const calls = new Map() // tool_use_id -> step number
let step = 0
const short = (s, n = 90) => String(s ?? "").replace(/\s+/g, " ").slice(0, n)
const textOf = (c) => typeof c === "string" ? c : Array.isArray(c) ? c.map((x) => x.text ?? "").join(" ") : ""
const rel = (p) => String(p ?? "").replace(/^.*Shopify-Claude-Test\//, "")

for (const e of events) {
  if (e.type === "assistant") {
    for (const c of e.message?.content ?? []) {
      if (c.type !== "tool_use") continue
      step++
      calls.set(c.id, { step, name: c.name })
      const i = c.input ?? {}
      const detail = i.file_path ? rel(i.file_path) : i.command ? short(String(i.command).replace(/^cd [^&]*&&\s*/, ""), 70)
        : Object.keys(i).length ? JSON.stringify(i) : ""
      console.log(`${String(step).padStart(2)}. ${c.name.replace("mcp__bazaar__", "")} ${detail}`)
    }
  }
  if (e.type === "user") {
    for (const c of e.message?.content ?? []) {
      if (c.type !== "tool_result") continue
      const call = calls.get(c.tool_use_id)
      const text = textOf(c.content)
      if (call?.name?.startsWith("mcp__bazaar__")) {
        // our own tools return JSON: show the verdict
        try {
          const r = JSON.parse(text)
          const verdict = r.ok ? "GREEN" : "RED"
          const first = r.failures?.[0] ? ` | ${short(r.failures[0].test, 60)}: ${short(r.failures[0].message, 60)}` : ""
          console.log(`      -> ${verdict}  failed=${r.failed ?? r.count ?? "?"}${first}`)
        } catch { console.log(`      -> ${short(text)}`) }
      } else if (c.is_error) {
        console.log(`      -> BLOCKED/ERROR: ${short(text)}`)
      }
    }
  }
  if (e.type === "result") {
    console.log(`\nEnd: ${e.subtype} | turns ${e.num_turns} | $${(e.total_cost_usd ?? 0).toFixed(3)} | ${Math.round((e.duration_ms ?? 0) / 1000)} s`)
    if (e.permission_denials?.length) console.log(`Denied by permissions: ${e.permission_denials.length}`)
  }
}
