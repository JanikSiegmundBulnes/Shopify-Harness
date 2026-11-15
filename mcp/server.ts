import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { runTests } from "./run-tests.ts"

// Claude Code tells the server which project it works in
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

const server = new McpServer({ name: "bazaar", version: "0.1.0" })

server.registerTool(
  "run_tests",
  {
    description:
      "Runs the Vitest test suite of the project and returns a short JSON report: " +
      "counts plus only the failing tests (file, test name, first line of the error). " +
      "Use after every code change instead of `npm test`. Read-only: changes no files.",
    inputSchema: {
      file: z.string().optional()
        .describe("Optional: run only this test file, e.g. src/lib/cart.test.ts"),
    },
  },
  async ({ file }) => ({
    content: [{ type: "text", text: JSON.stringify(runTests(projectDir, file), null, 2) }],
  }),
)

await server.connect(new StdioServerTransport())