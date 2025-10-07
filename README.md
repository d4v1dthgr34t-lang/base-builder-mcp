# Base Builder MCP - VS Code Copilot Edition

This repository is an MCP server destined for Base Builders.

This MCP server provides tools for browsing Base Docs and is designed to work with VS Code Copilot's agent mode.

Follow the instructions below to use it 👇

## Global Installation (Recommended for use across all projects)

### Step 1: Install globally via npm

```bash
npm install -g https://github.com/d4v1dthgr34t-lang/base-builder-mcp.git
```

Or clone and install:

```bash
git clone https://github.com/d4v1dthgr34t-lang/base-builder-mcp
cd base-builder-mcp
npm install
npm run build
npm install -g .
```

### Step 2: Run the automated setup

After global installation, run the setup script to configure VS Code MCP:

```bash
base-builder-mcp-setup
```

Or if running from the cloned directory:

```bash
npm run setup-global
```

This will:
- Prompt you for your API keys (optional)
- Create/update your global `~/.vscode/mcp.json` configuration
- Set up the Base Builder MCP server for use across all VS Code workspaces

### Manual Configuration (Alternative)

If you prefer to configure manually, create or edit `~/.vscode/mcp.json`:

```json
{
    "servers": {
        "base-builder-mcp": {
            "type": "stdio",
            "command": "base-builder-mcp",
            "env": {
                "OPENAI_API_KEY": "your-openai-api-key-here",
                "COINBASE_API_KEY": "your-coinbase-api-key-here"
            }
        }
    }
}
```

Replace `your-openai-api-key-here` and `your-coinbase-api-key-here` with your actual API keys.

*Note: ✅ OPENAI Key is optional but recommended. It allows the guide to be reviewed and digested by another LLM to create a json file of the guide instead of feeding raw guide text to your agent.*

*Note: ✅ COINBASE API Key is included for future Coinbase API integrations.*

## Workspace-Specific Installation (Alternative)

If you prefer to use it only in specific workspaces:

- Clone the repo and navigate to the directory:

```bash
git clone https://github.com/d4v1dthgr34t-lang/base-builder-mcp
cd base-builder-mcp
```

- Install the dependencies:

```bash
npm install
```

- Build the TypeScript code:

```bash
npm run build
```

- The MCP server is now configured for VS Code Copilot. The `.vscode/mcp.json` file contains the server configuration with support for both OpenAI and Coinbase API keys.

## VS Code Copilot Agent Mode Usage

After setting up the MCP server (globally or workspace-specific):

1. Open VS Code with Copilot enabled
2. Open the Chat view (Ctrl+Alt+I)
3. Select "Agent" mode from the dropdown
4. Use prompts like "I want to build on Base" to trigger the Base Builder MCP tool

The Base Builder MCP tool allows you to browse the sidebar of Base Docs and find relevant guides to Build on Base. If you run this tool and you get an error because the guide is not found, try other guides from the sidebar.

## Expected Result

After adding Base Builder MCP to VS Code Copilot, you can use it by saying "I want to build with base". Using that should trigger a call to the Base Builder MCP server in agent mode.

## Troubleshooting

- Make sure VS Code is updated to version 1.102 or later for MCP support
- Ensure agent mode is enabled in VS Code settings (`chat.agent.enabled`)
- For global installation: Check that the MCP server is running by looking at the MCP Servers section in the Extensions view
- For workspace-specific: Ensure you're in the correct workspace with the `.vscode/mcp.json` file
- If tools don't appear, try restarting VS Code or running the "MCP: Reset Cached Tools" command
- If you get permission errors with global install, try using `sudo npm install -g .` (not recommended) or install in a user directory

## MCP Tool Description

What is the BuildOnBase tool from Base Builder MCP?
It's a tool which allows you to browse the sidebar of Base Docs and find the relevant guides to Build on Base. If you run this tool and you get an error because the guide is not found, try other guides from the sidebar.
