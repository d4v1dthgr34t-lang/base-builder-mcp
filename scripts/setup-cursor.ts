// scripts/setup-cursor.ts

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import inquirer from "inquirer";

type MCPConfig = {
  mcpServers?: Record<string, any>;
};

const MCP_SERVER_NAME = "base-builder-mcp";

function getCursorProjectConfigPath(): string {
  return path.join(process.cwd(), ".cursor", "mcp.json");
}

function getCursorGlobalConfigPath(): string {
  return path.join(os.homedir(), ".cursor", "mcp.json");
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

function writeEnvFile(openaiKey: string) {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath) && openaiKey) {
    fs.writeFileSync(envPath, `OPENAI_API_KEY=${openaiKey}\n`);
    console.log(`✅ Created .env file with your OpenAI API key.`);
  }
}

async function main() {
  const { location } = await inquirer.prompt([
    {
      type: "list",
      name: "location",
      message: "Where do you want to configure Base Builder MCP for Cursor?",
      choices: [
        { name: "Project only (.cursor/mcp.json)", value: "project" },
        { name: "Global (~/.cursor/mcp.json)", value: "global" },
      ],
      default: "project",
    },
  ]);

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
    writeEnvFile(openaiKey);
  }

  const mcpEntry = getMcpEntry(openaiKey);

  const configPath =
    location === "project"
      ? getCursorProjectConfigPath()
      : getCursorGlobalConfigPath();

  ensureDirSync(path.dirname(configPath));
  const config = readConfig(configPath);
  config.mcpServers = config.mcpServers || {};
  config.mcpServers[MCP_SERVER_NAME] = mcpEntry;
  writeConfig(configPath, config);
  console.log(`✅ Updated ${configPath} with ${MCP_SERVER_NAME}`);
}

main();