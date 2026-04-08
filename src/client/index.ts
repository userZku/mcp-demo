import { createMcpClient } from "./mcp/client.js";
import { mapToolsToOllama } from "./core/tools.js";
import { createCLIChat } from "./core/cliChat.js";
import { createWebChat } from "./core/webChat.js";
import { startCLI } from "./interfaces/cli.js";
import { startWebServer } from "./interfaces/web.js";

(async () => {
  const mcpClient = await createMcpClient();

  const { tools } = await mcpClient.listTools();
  const ollamaTools = mapToolsToOllama(tools);

  // Déterminer le mode : Web (par défaut) ou CLI (avec --cli)
  const isCliMode = process.argv.includes("--cli");

  if (isCliMode) {
    // Mode CLI : utiliser le chat avec affichages détaillés
    const chat = createCLIChat(mcpClient, ollamaTools);
    startCLI(chat);
  } else {
    // Mode Web (défaut) : utiliser le chat minimaliste
    const chat = createWebChat(mcpClient, ollamaTools);
    startWebServer(chat);
  }
})();