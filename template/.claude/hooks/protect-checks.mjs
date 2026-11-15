// Blocks edits that would silence a check. Exit code 2 = block, stderr goes to the model.
let raw = ""
process.stdin.on("data", (c) => (raw += c))
process.stdin.on("end", () => {
    const { tool_name, tool_input = {} } = JSON.parse(raw)
    const text = String(tool_input.new_string ?? tool_input.content ?? "")
    const cmd = String(tool_input.command ?? "")

    const block = (msg) => { console.error(msg); process.exit(2) }

    if (["Edit", "Write"].includes(tool_name)) {
        if (/\b(it|test|describe)\.(skip|only|todo)\b/.test(text)) block("Skipping or focusing tests is not allowed. Fix the code instead.")
        if (/@ts-(ignore|nocheck|expect-error)/.test(text)) block("Silencing TypeScript is not allowed. Fix the type error instead.")
    }
    if (tool_name === "Bash" && /\.env\b/.test(cmd)) block("Access to .env is blocked by the harness.")
    process.exit(0)
})