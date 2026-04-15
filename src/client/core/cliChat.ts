import { createChatCore } from "./chatCore.js";
import { clientConversationService } from "../services/conversation.service.js";
import crypto from "crypto";

/**
 * Chat optimisé pour CLI avec affichages console détaillés
 */
export const createCLIChat = (client: any, tools: any[]) => {
  // Génère un ID de conversation unique (ou utilise la dernière)
  const conversationId = process.env.CONVERSATION_ID || `chat-${crypto.randomBytes(4).toString("hex")}`;
  
  // Charge la conversation existante si elle existe
  const existingConversation = clientConversationService.loadConversation(conversationId);
  let { run: coreRun, messages } = createChatCore(client, tools);
  
  // Si on a une conversation existante, restaure les messages
  if (existingConversation) {
    console.log(`📖 Conversation restaurée (${existingConversation.messages.length} messages)\n`);
    // Remplace les messages avec la conversation sauvegardée
    messages.splice(1); // Garde le message système à index 0
    messages.push(...existingConversation.messages.slice(1)); // Ajoute les autres messages
  } else {
    console.log(`🆕 Nouvelle conversation créée (ID: ${conversationId})\n`);
  }

  const run = async (userInput: string) => {
    // Lance la logique core
    const { response, thinking, toolCalls } = await coreRun(userInput);

    // Sauvegarde la conversation après chaque interaction
    clientConversationService.saveConversation(conversationId, messages);

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
