import { createMcpClient } from "./mcp/client.js";
import { mapToolsToOllama } from "./core/tools.js";
import { createCLIChat } from "./core/cliChat.js";
import { createWebChat } from "./core/webChat.js";
import { startCLI, selectConversation } from "./interfaces/cli.js";
import { startWebServer } from "./interfaces/web.js";

(async () => {
  const mcpClient = await createMcpClient();

  const { tools } = await mcpClient.listTools();
  const ollamaTools = mapToolsToOllama(tools);

  // Déterminer le mode : Web (par défaut) ou CLI (avec --cli)
  const isCliMode = process.argv.includes("--cli");

  if (isCliMode) {
    // Mode CLI : affiche le menu de sélection de conversation
    const selectedId = await selectConversation();
    const chat = createCLIChat(mcpClient, ollamaTools, selectedId);
    startCLI(chat);
  } else {
    // Mode Web (défaut) : utiliser le chat minimaliste
    const chat = createWebChat(mcpClient, ollamaTools);
    startWebServer(chat);
  }
})();