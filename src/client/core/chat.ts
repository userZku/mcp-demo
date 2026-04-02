import { chatWithModel } from "../llm/ollama.js";

export const createChat = (client: any, tools: any[]) => {
  const messages: any[] = [
    {
      role: "system",
      content:
        "Tu es un assistant utile. Utilise les outils si nécessaire. Réponds en français.",
    },
  ];

  const run = async (userInput: string) => {
    messages.push({ role: "user", content: userInput });

    console.log("\n⏳ Réflexion en cours...");
    let response = await chatWithModel({
      model: "qwen3:8b",
      messages,
      tools,
    });

    while (response.message.tool_calls?.length) {
      messages.push(response.message);

      for (const call of response.message.tool_calls) {
        console.log(`\n🔧 Appel outil : ${call.function.name}`);
        console.log(`   Arguments : ${JSON.stringify(call.function.arguments)}`);
        const args = call.function.arguments;
        const result = await client.callTool({
          name: call.function.name,
          arguments: args,
        });

        const output = (result.content as { text: string }[])[0].text;
        console.log(`   ✅ Résultat : ${output}`);

        messages.push({ role: "tool", content: output });
      }

      console.log("\n⏳ Formulation de la réponse...");
      response = await chatWithModel({
        model: "qwen3:8b",
        messages,
      });
    }

    messages.push(response.message);

    return response.message.content;
  };

  return { run };
};