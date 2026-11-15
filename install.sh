#!/usr/bin/env bash
# Installs the harness into a project. Usage: ./install.sh <project folder>
set -euo pipefail

HARNESS="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(cd "${1:?Usage: ./install.sh <project folder>}" && pwd)"

# 1. Context files and rules
cp "$HARNESS/template/AGENTS.md" "$HARNESS/template/CLAUDE.md" "$TARGET/"
mkdir -p "$TARGET/.claude"
cp -R "$HARNESS/template/.claude/." "$TARGET/.claude/"

# 2. MCP server registration: the server code stays in the harness
cat > "$TARGET/.mcp.json" <<EOF
{
  "mcpServers": {
    "bazaar": {
      "command": "$HARNESS/node_modules/.bin/tsx",
      "args": ["$HARNESS/mcp/server.ts"]
    }
  }
}
EOF

echo "Harness installed into: $TARGET"