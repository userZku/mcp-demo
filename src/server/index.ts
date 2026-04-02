import http from "http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./mcp.js";

const httpServer = http.createServer(async (req, res) => {
  if (req.url === "/mcp") {
    const transport = new StreamableHTTPServerTransport({});
    const server = createMcpServer();

    await server.connect(transport);
    await transport.handleRequest(req, res);
  } else {
    res.writeHead(404).end();
  }
});

httpServer.listen(3001, () => {
  console.log("🚀 MCP server running on http://localhost:3001/mcp");
});