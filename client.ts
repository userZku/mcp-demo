import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import ollama, { type Message } from "ollama";
import readline from "readline";

// 1. Connexion au serveur MCP
const transport = new StreamableHTTPClientTransport(
  new URL("http://localhost:3001/mcp")
);
const client = new Client({ name: "demo-client", version: "1.0.0" });
await client.connect(transport);

// 2. Récupération des outils
const { tools } = await client.listTools();
const ollamaTools = tools.map((tool) => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema,
  },
}));

console.log(`Outils disponibles : ${tools.map((t) => t.name).join(", ")}`);
console.log('Chat démarré — tape "exit" pour quitter\n');

// 3. Historique de conversation
const messages: Message[] = [
  {
    role: "system",
    content: "Tu es un assistant utile. Utilise les outils disponibles quand c'est pertinent. Réponds en français.",
  },
];

// 4. Envoi d'un message + gestion des outils
async function chat(userInput: string) {
  messages.push({ role: "user", content: userInput });

  const response = await ollama.chat({
    model: "qwen3:8b",
    messages,
    tools: ollamaTools,
    think: false,
  });

  let currentResponse = response;
  while (currentResponse.message.tool_calls?.length) {
    messages.push(currentResponse.message);

    for (const call of currentResponse.message.tool_calls) {
      process.stdout.write(`  [outil: ${call.function.name}] `);

      const rawArgs = call.function.arguments as Record<string, unknown>;
      const args = Object.fromEntries(
        Object.entries(rawArgs).map(([k, v]) => [
          k,
          typeof v === "string" && !isNaN(Number(v)) ? Number(v) : v,
        ])
      );

      const result = await client.callTool({ name: call.function.name, arguments: args });
      const output = (result.content as { text: string }[])[0].text;
      process.stdout.write(`${output}\n`);

      messages.push({ role: "tool", content: output });
    }

    currentResponse = await ollama.chat({
      model: "qwen3:8b",
      messages,
      think: false,
    });
  }

  messages.push(currentResponse.message);
  console.log(`\nAssistant : ${currentResponse.message.content}\n`);
}

// 5. Boucle interactive
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("Vous : ", async (input) => {
    const trimmed = input.trim();
    if (trimmed === "exit") {
      await client.close();
      rl.close();
      return;
    }
    if (trimmed) await chat(trimmed);
    prompt();
  });
}

prompt();