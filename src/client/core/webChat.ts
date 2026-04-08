import { createChatCore } from "./chatCore.js";

/**
 * Chat optimisé pour Web - retourne simplement la réponse
 */
export const createWebChat = (client: any, tools: any[]) => {
  const { run: coreRun } = createChatCore(client, tools);

  const run = async (userInput: string) => {
    const { response } = await coreRun(userInput);
    // Retour direct de la réponse - pas d'affichage console
    return response;
  };

  return { run };
};
