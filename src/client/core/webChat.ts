import { createChatCore } from "./chatCore.js";
import { clientConversationService } from "../services/conversation.service.js";
import crypto from "crypto";

/**
 * Chat optimisé pour Web - retourne simplement la réponse
 */
export const createWebChat = (client: any, tools: any[]) => {
  const createConversationId = () => `chat-${crypto.randomBytes(4).toString("hex")}`;

  let currentConversationId: string | null = null;
  let currentCore = createChatCore(client, tools);

  const switchToConversation = (conversationId: string | null) => {
    if (!conversationId) {
      currentConversationId = createConversationId();
      currentCore = createChatCore(client, tools);
      clientConversationService.saveConversation(currentConversationId, currentCore.messages);
      return;
    }

    const existing = clientConversationService.loadConversation(conversationId);
    if (!existing) {
      currentConversationId = createConversationId();
      currentCore = createChatCore(client, tools);
      clientConversationService.saveConversation(currentConversationId, currentCore.messages);
      return;
    }

    currentConversationId = existing.id;
    currentCore = createChatCore(client, tools);
    currentCore.messages.splice(1);
    currentCore.messages.push(...existing.messages.slice(1));
  };

  // Au démarrage web, reprendre la conversation la plus récente
  const mostRecent = clientConversationService.loadConversation();
  switchToConversation(mostRecent?.id ?? null);

  const run = async (userInput: string) => {
    const { response } = await currentCore.run(userInput);
    clientConversationService.saveConversation(currentConversationId!, currentCore.messages);
    // Retour direct de la réponse - pas d'affichage console
    return response;
  };

  const listConversations = () => {
    return clientConversationService.listConversations(50);
  };

  const getConversationMessages = (conversationId: string | null = null) => {
    if (!conversationId || conversationId === currentConversationId) {
      return {
        id: currentConversationId,
        messages: currentCore.messages,
      };
    }

    const existing = clientConversationService.loadConversation(conversationId);
    return {
      id: existing?.id ?? null,
      messages: existing?.messages ?? [],
    };
  };

  const createNewConversation = () => {
    switchToConversation(null);
    return {
      id: currentConversationId,
      messages: currentCore.messages,
    };
  };

  const selectConversation = (conversationId: string) => {
    switchToConversation(conversationId);
    return {
      id: currentConversationId,
      messages: currentCore.messages,
    };
  };

  const getCurrentConversationId = () => currentConversationId;

  return {
    run,
    listConversations,
    getConversationMessages,
    createNewConversation,
    selectConversation,
    getCurrentConversationId,
  };
};
