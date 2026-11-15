import { runTests } from "../mcp/run-tests.ts"

const projectDir = process.argv[2]
if (!projectDir) throw new Error("Usage: npx tsx scripts/try-run-tests.ts <project folder>")
console.log(JSON.stringify(runTests(projectDir), null, 2))