import { spawnSync } from "node:child_process"

export type TypeCheckError = { file: string; line: number; message: string }

export function runTypecheck(projectDir: string) {
  const proc = spawnSync("npm", ["run", "typecheck", "--", "--pretty", "false"],
    { cwd: projectDir, encoding: "utf8", timeout: 120_000 })
  const out = `${proc.stdout}\n${proc.stderr}`
  // tsc lines look like: src/lib/cart.ts(12,5): error TS2322: Type 'string' is not ...
  const errors: TypeCheckError[] = []
  for (const m of out.matchAll(/^(.+?)\((\d+),\d+\): error (TS\d+: .+)$/gm)) {
    errors.push({ file: m[1]!, line: Number(m[2]), message: m[3]!.slice(0, 300) })
  }
  if (proc.status !== 0 && errors.length === 0) {
    return { ok: false, errors, note: out.slice(-1500) }
  }
  return { ok: proc.status === 0, count: errors.length, errors: errors.slice(0, 20) }
}