#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { homedir } from 'os';
import { join } from 'path';

async function setupGlobalMCP() {
    console.log('🚀 Setting up Base Builder MCP globally...\n');

    const mcpConfigPath = join(homedir(), '.vscode', 'mcp.json');

    // Check if config already exists
    let existingConfig = {};
    if (existsSync(mcpConfigPath)) {
        try {
            existingConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
            console.log('📝 Found existing MCP configuration, will merge with it.');
        } catch (error) {
            console.log('⚠️  Existing MCP config is invalid, will create new one.');
        }
    }

    // Prompt for API keys
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'openaiKey',
            message: 'Enter your OpenAI API Key (optional - press Enter to skip):',
            mask: '*'
        },
        {
            type: 'input',
            name: 'coinbaseKey',
            message: 'Enter your Coinbase API Key (optional - press Enter to skip):',
            mask: '*'
        }
    ]);

    // Create server config
    const serverConfig = {
        type: 'stdio',
        command: 'base-builder-mcp'
    };

    // Add environment variables if keys provided
    const env = {};
    if (answers.openaiKey) {
        env.OPENAI_API_KEY = answers.openaiKey;
    }
    if (answers.coinbaseKey) {
        env.COINBASE_API_KEY = answers.coinbaseKey;
    }

    if (Object.keys(env).length > 0) {
        serverConfig.env = env;
    }

    // Merge with existing config
    const newConfig = {
        ...existingConfig,
        servers: {
            ...existingConfig.servers,
            'base-builder-mcp': serverConfig
        }
    };

    // Write config
    writeFileSync(mcpConfigPath, JSON.stringify(newConfig, null, 2));
    console.log(`✅ MCP configuration written to ${mcpConfigPath}`);
    console.log('\n🎉 Setup complete! Restart VS Code to use Base Builder MCP globally.');
    console.log('\n💡 Tips:');
    console.log('   - Open VS Code Chat (Ctrl+Alt+I)');
    console.log('   - Select "Agent" mode');
    console.log('   - Try: "I want to build on Base"');
}

setupGlobalMCP().catch(console.error);