import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const createMcpClient = async () => {
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3001/mcp")
  );

  const client = new Client({ name: "demo-client", version: "1.0.0" });
  await client.connect(transport);

  return client;
};