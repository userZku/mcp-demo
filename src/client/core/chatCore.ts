import { chatWithModelStream } from "../llm/ollama.js";

/**
 * Logique partagée du chat (sans affichage console)
 * Retourne simplement la réponse et les réactions de l'IA
 */
export const createChatCore = (client: any, tools: any[]) => {
  const messages: any[] = [
    {
      role: "system",
      content: `Tu es un assistant intelligent avec accès à plusieurs outils.

QUAND UTILISER LES OUTILS :
- Besoin d'heure ? → appelle get_time
- Besoin de lire un fichier ? → appelle read_file
- Besoin d'écrire dans un fichier ? → appelle write_file
- Besoin de faire un calcul ? → appelle add
- Besoin de météo ? → appelle weather

RÉPONDRE AUX QUESTIONS :
- Si c'est une question personnelle, réponds honnêtement
- Si c'est une question factuelle (comme "quelle heure ?"), utilise l'outil approprié
- Ne génère JAMAIS de JSON ou de code - utilise les outils à la place

STYLE :
- Réponse courte et naturelle en français
- Explique le résultat de l'outil, pas l'outil lui-même`,
    },
  ];

  const run = async (userInput: string) => {
    messages.push({ role: "user", content: userInput });

    // Stream la réflexion + première réponse
    const thinkStream = await chatWithModelStream("qwen3:8b", messages, tools);

    let fullThinking = "";
    let fullContent = "";
    let toolCallsResponse: any = null;

    for await (const chunk of thinkStream) {
      const thinking = chunk.message?.thinking ?? "";
      const text = chunk.message?.content ?? "";

      if (thinking) {
        fullThinking += thinking;
      }
      if (text) {
        fullContent += text;
      }
      if (chunk.message?.tool_calls?.length) {
        toolCallsResponse = chunk.message;
      }
    }

    // Pas de tool call → réponse complète
    if (!toolCallsResponse?.tool_calls?.length) {
      messages.push({ role: "assistant", content: fullContent });
      return {
        response: fullContent,
        thinking: fullThinking,
        toolCalls: [],
      };
    }

    // Tool calls
    const toolResults: any[] = [];
    messages.push(toolCallsResponse);
    
    for (const call of toolCallsResponse.tool_calls) {
      const result = await client.callTool({
        name: call.function.name,
        arguments: call.function.arguments,
      });

      const output = (result.content as { text: string }[])[0].text;
      messages.push({ role: "tool", content: output });
      
      toolResults.push({
        name: call.function.name,
        arguments: call.function.arguments,
        result: output,
      });
    }

    // Reformulation finale en stream
    const stream = await chatWithModelStream("qwen3:8b", messages);

    let finalContent = "";
    for await (const chunk of stream) {
      const text = chunk.message?.content ?? "";
      finalContent += text;
    }

    messages.push({ role: "assistant", content: finalContent });
    return {
      response: finalContent,
      thinking: fullThinking,
      toolCalls: toolResults,
    };
  };

  return { run, messages };
};
