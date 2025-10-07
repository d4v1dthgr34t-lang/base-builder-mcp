# Base Builder MCP - Changelog

## [1.0.0] - October 6, 2025

### Added
- Initial release of Base Builder MCP for VS Code Copilot
- BuildOnBase tool for browsing Base documentation
- Global installation support via npm
- Automated setup script (`base-builder-mcp-setup`)
- OpenAI integration for guide processing (optional)
- Workspace-specific configuration option
- Comprehensive documentation and troubleshooting guide

### Features
- Fetch and browse Base Docs sidebar
- Process guides with GPT-4o-mini (optional)
- Secure API key management via VS Code inputs
- Support for both global and workspace-specific installations

### Fixed
- OpenAI API client initialization with explicit API key
- Correct OpenAI Chat Completions API usage (not responses.create)
- Error handling for OpenAI processing failures
- Package.json main field pointing to correct build output
- Proper shebang for executable scripts

### Security
- Enhanced .gitignore to protect secrets and API keys
- .npmignore to exclude source files from npm package
- Secure API key input via VS Code password prompts
