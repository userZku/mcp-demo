import { createChatCore } from "./chatCore.js";

/**
 * Chat optimisé pour CLI avec affichages console détaillés
 */
export const createCLIChat = (client: any, tools: any[]) => {
  const { run: coreRun, messages } = createChatCore(client, tools);

  const run = async (userInput: string) => {
    // Lance la logique core
    const { response, thinking, toolCalls } = await coreRun(userInput);

    // Affichage CLI détaillé
    if (thinking) {
      process.stdout.write("\n💭 Réflexion : ");
      process.stdout.write(thinking);
      process.stdout.write("\n");
    }

    if (toolCalls.length > 0) {
      for (const call of toolCalls) {
        console.log(`\n🔧 Appel outil : ${call.name}`);
        console.log(`   Arguments : ${JSON.stringify(call.arguments)}`);
        console.log(`   ✅ Résultat : ${call.result}`);
      }
    }

    // Affiche la réponse final en mettant en avant
    process.stdout.write(`\nAssistant : ${response}\n\n`);
    
    return response;
  };

  return { run, messages };
};
