import { createMcpClient } from "./mcp/client.js";
import { mapToolsToOllama } from "./core/tools.js";
import { createChat } from "./core/chat.js";
import { startCLI } from "./interfaces/cli.js";
// import { startWebServer } from "./interfaces/web.js"; // si web UI

(async () => {
  const mcpClient = await createMcpClient();

  const { tools } = await mcpClient.listTools();
  const ollamaTools = mapToolsToOllama(tools);

  const chat = createChat(mcpClient, ollamaTools);

  // CLI
  startCLI(chat);

  // Web (décommenter si besoin)
  // startWebServer(chat);
})();