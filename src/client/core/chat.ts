import { chatWithModelStream } from "../llm/ollama.js";

export const createChat = (client: any, tools: any[]) => {
  const messages: any[] = [
    {
      role: "system",
      content: `
        Tu es un assistant strict qui utilise des outils.

        RÈGLES OBLIGATOIRES :

        1. Si une tâche nécessite des outils, tu DOIS les appeler.
        2. Si plusieurs outils sont nécessaires, tu DOIS les appeler un par un dans l’ordre.
        3. Tu DOIS attendre le résultat avant de continuer.
        4. Tu DOIS utiliser UNIQUEMENT les données retournées par les tools.
        5. Tu NE DOIS JAMAIS inventer de valeurs.

        INTERDICTION :
        6. Tu ne dois jamais écrire du code (Python, JS, etc.) pour remplacer un tool.
        7. Si un tool existe, tu dois l’utiliser.

        CHAINING :
        8. Une tâche n’est terminée que lorsque tous les tools nécessaires ont été appelés.
        9. Ne t’arrête jamais après un seul tool si d’autres sont nécessaires.

        FICHIERS :
        10. Pour écrire dans un fichier, tu DOIS appeler write_file.
        11. Le chemin doit contenir un nom de fichier avec extension.

        FORMAT :
        12. Quand tu appelles un tool, tu ne produis aucun texte.

        LANGUE :
        13. Français uniquement.
        `,
    },
  ];

  const run = async (userInput: string) => {
    messages.push({ role: "user", content: userInput });

    // Stream la réflexion + première réponse
    process.stdout.write("\n💭 Réflexion : ");
    const thinkStream = await chatWithModelStream("qwen3:8b", messages, tools);

    let fullThinking = "";
    let fullContent = "";
    let toolCallsResponse: any = null;
    let thinkingDone = false;

    for await (const chunk of thinkStream) {
      const thinking = chunk.message?.thinking ?? "";
      const text = chunk.message?.content ?? "";

      if (thinking) {
        process.stdout.write(thinking);
        fullThinking += thinking;
      }
      if (text && !thinkingDone && fullThinking) {
        process.stdout.write("\n\n");
        thinkingDone = true;
      }
      if (text) fullContent += text;
      if (chunk.message?.tool_calls?.length) {
        toolCallsResponse = chunk.message;
      }
    }

    // Pas de tool call → réponse déjà streamée
    if (!toolCallsResponse?.tool_calls?.length) {
      process.stdout.write(`\nAssistant : ${fullContent}\n\n`);
      messages.push({ role: "assistant", content: fullContent });
      return fullContent;
    }

    // Tool calls
    messages.push(toolCallsResponse);
    for (const call of toolCallsResponse.tool_calls) {
      console.log(`\n🔧 Appel outil : ${call.function.name}`);
      console.log(`   Arguments : ${JSON.stringify(call.function.arguments)}`);

      const result = await client.callTool({
        name: call.function.name,
        arguments: call.function.arguments,
      });

      const output = (result.content as { text: string }[])[0].text;
      console.log(`   ✅ Résultat : ${output}`);
      messages.push({ role: "tool", content: output });
    }

    // Reformulation finale en stream
    process.stdout.write("\nAssistant : ");
    const stream = await chatWithModelStream("qwen3:8b", messages);

    let finalContent = "";
    for await (const chunk of stream) {
      const text = chunk.message?.content ?? "";
      process.stdout.write(text);
      finalContent += text;
    }
    process.stdout.write("\n\n");

    messages.push({ role: "assistant", content: finalContent });
    return finalContent;
  };

  return { run };
};