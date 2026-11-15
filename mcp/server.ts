import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { runTests } from "./run-tests.ts"
import { runTypecheck } from "./run-typecheck.ts"

// Claude Code tells the server which project it works in
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

const server = new McpServer({ name: "bazaar", version: "0.1.0" })

server.registerTool(
  "run_tests",
  {
    description:
      "Runs Vitest and returns a short JSON report with only the failing tests. " +
      "suite 'acceptance' = the fixed acceptance tests in src/acceptance (decide when a " +
      "feature is done), 'unit' = all other tests, 'all' = everything. Use after every change.",
    inputSchema: {
      suite: z.enum(["all", "unit", "acceptance"]).default("all")
        .describe("Which tests to run"),
    },
  },
  async ({ suite }) => {
    const filter = suite === "acceptance" ? "src/acceptance" : undefined
    const report = runTests(projectDir, filter)
    // for 'unit': drop acceptance results and recount
    if (suite === "unit") {
      report.failures = report.failures.filter(f => !f.file.startsWith("src/acceptance"))
      report.failed = report.failures.length
      report.ok = report.failures.length === 0 && !report.error
    }
    return { content: [{ type: "text", text: JSON.stringify({ suite, ...report }, null, 2) }] }
  },
)
server.registerTool(
  "run_typecheck",
  {
    description: "Runs the TypeScript check of the project and returns the errors as JSON " +
      "(file, line, message; at most 20). Use after changing types or signatures. Read-only.",
    inputSchema: {},
  },
  async () => ({ content: [{ type: "text", text: JSON.stringify(runTypecheck(projectDir), null, 2) }] }),
)

await server.connect(new StdioServerTransport())