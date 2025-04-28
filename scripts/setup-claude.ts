// scripts/setup-claude.ts

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import inquirer from "inquirer";

type MCPConfig = {
  mcpServers?: Record<string, any>;
};

const MCP_SERVER_NAME = "base-builder-mcp";

function getClaudeGlobalConfigPath(): string {
  if (process.platform === "darwin") {
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Claude",
      "claude_desktop_config.json"
    );
  } else if (process.platform === "win32") {
    return path.join(
      process.env.APPDATA || "",
      "Claude",
      "claude_desktop_config.json"
    );
  } else {
    throw new Error("Unsupported OS for Claude Desktop config");
  }
}

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readConfig(configPath: string): MCPConfig {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
  return {};
}

function writeConfig(configPath: string, config: MCPConfig) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getMcpEntry(openaiKey: string): any {
  const buildIndexPath = path.join(process.cwd(), "build", "index.js");
  return {
    command: "node",
    args: [buildIndexPath],
    env: {
      OPENAI_API_KEY: openaiKey,
    },
    disabled: false,
    autoApprove: [],
  };
}

async function main() {
  let openaiKey = process.env.OPENAI_API_KEY || "";
  if (!openaiKey) {
    const { key } = await inquirer.prompt([
      {
        type: "input",
        name: "key",
        message: "Enter your OpenAI API key (leave blank to skip):",
      },
    ]);
    openaiKey = key;
  }

  const mcpEntry = getMcpEntry(openaiKey);

  try {
    const configPath = getClaudeGlobalConfigPath();
    ensureDirSync(path.dirname(configPath));
    const config = readConfig(configPath);
    config.mcpServers = config.mcpServers || {};
    config.mcpServers[MCP_SERVER_NAME] = mcpEntry;
    writeConfig(configPath, config);
    console.log(`✅ Updated ${configPath} with ${MCP_SERVER_NAME}`);
  } catch (e: any) {
    console.error("❌ Could not update Claude Desktop config:", e.message);
  }
}

main();