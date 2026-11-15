import { runTypecheck } from "../mcp/run-typecheck.ts"

const projectDir = process.argv[2]
if (!projectDir) throw new Error("Usage: npx tsx scripts/try-typecheck.ts <project folder>")
console.log(JSON.stringify(runTypecheck(projectDir), null, 2))
