import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"

export type Failure = { file: string; test: string; message: string }
export type TestReport = {
  ok: boolean
  passed: number
  failed: number
  failures: Failure[]
  error?: string
}

const firstLine = (s: unknown) => String(s ?? "").split("\n")[0]!.slice(0, 300)

export function runTests(projectDir: string, file?: string): TestReport {
  const tmp = mkdtempSync(join(tmpdir(), "run-tests-"))
  const reportFile = join(tmp, "vitest.json")
  const args = ["vitest", "run", "--reporter=json", `--outputFile=${reportFile}`]
  if (file) args.push(file)

  const proc = spawnSync("npx", args, { cwd: projectDir, encoding: "utf8", timeout: 120_000 })

  try {
    const report = JSON.parse(readFileSync(reportFile, "utf8"))
    const failures: Failure[] = []
    for (const suite of report.testResults ?? []) {
      const fileName = relative(projectDir, suite.name)
      const failed = (suite.assertionResults ?? []).filter((t: any) => t.status === "failed")
      for (const t of failed) {
        failures.push({ file: fileName, test: t.fullName, message: firstLine(t.failureMessages?.[0]) })
      }
      // A test file that does not even load (syntax or import error)
      if (suite.status === "failed" && failed.length === 0) {
        failures.push({ file: fileName, test: "(file could not run)", message: firstLine(suite.message) })
      }
    }
    return {
      ok: report.success === true,
      passed: report.numPassedTests ?? 0,
      failed: report.numFailedTests ?? failures.length,
      failures,
    }
  } catch {
    // Errors become text the model can read, never a crash
    const output = (proc.stderr || proc.stdout || "").slice(-1500)
    return { ok: false, passed: 0, failed: 0, failures: [],
      error: `Vitest did not produce a report. Check that the project path is right and dependencies are installed. Output: ${output}` }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}