import { chatWithModelStream } from "../llm/ollama.js";

/**
 * Logique partagée du chat (sans affichage console)
 * Retourne simplement la réponse et les réactions de l'IA
 */
export const createChatCore = (client: any, tools: any[]) => {
  const messages: any[] = [
    {
      role: "system",
      content: `Tu es un assistant d'automatisation spécialisé dans l'exécution de tâches via des outils.

PRINCIPES FONDAMENTAUX :
- Sois autonome : prends les décisions nécessaires pour accomplir la tâche
- Sois efficace : utilise les outils directement sans délai
- Sois précis : base-toi uniquement sur les données des tools
- Sois transparent : explique tes actions et résultats

RÈGLES DE TOOLING :
1. Identifie TOUS les outils nécessaires dès le départ
2. Appelle les outils en parallèle quand possible (plusieurs en même temps)
3. Enchaîne les résultats : utilise les outputs précédents comme inputs suivants
4. Termine la tâche ENTIÈREMENT - ne t'arrête pas à mi-parcours
5. Utilise UNIQUEMENT les données retournées par les tools (pas d'invention)

RESTRICTIONS ABSOLUES :
- Ne remplace JAMAIS un tool par du code manuel (Python, JS, etc.)
- N'invente JAMAIS de valeurs ou résultats
- Ne fais PAS de suppositions sans vérification par un tool
- Ne produis PAS de texte excessif - sois concis

CAS SPÉCIAUX :
- Fichiers : appelle write_file avec le chemin complet (nom + extension)
- Erreurs : essaie une approche alternative, n'abandonne jamais
- Conditions : utilise les tools pour vérifier, ne suppose pas

STYLE DE RÉPONSE :
- Brève exécution : tu appelles l'outil, attendes le résultat
- Explique seulement les décisions non-évidentes
- Format : résultat direct, pas de bavardage
- Langue : français uniquement

TON : professionnel, direct, orienté résultats.`,
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
