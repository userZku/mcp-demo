import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "./tools/tools.js";

export const createMcpServer = () => {
  const server = new McpServer({
    name: "demo-server",
    version: "1.0.0",
  });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        ...('inputSchema' in tool ? { inputSchema: tool.inputSchema } : {}),
      },
      tool.handler
    );
  }

  return server;
};