import readline from "readline";
import { clientConversationService } from "../services/conversation.service.js";

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export async function selectConversation(): Promise<string | null> {
  const conversations = clientConversationService.listConversations(10);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n💬 Conversations disponibles :\n");

  if (conversations.length === 0) {
    console.log("  Aucune conversation existante.\n");
  } else {
    conversations.forEach((conv, i) => {
      const date = new Date(conv.updatedAt).toLocaleString("fr-FR");
      console.log(`  [${i + 1}] ${conv.id}  —  ${conv.messageCount} messages  —  ${date}`);
    });
  }

  console.log(`  [N] Nouvelle conversation`);
  console.log(`  [Q] Quitter\n`);

  let choice: string | null = null;

  while (choice === null) {
    const answer = (await ask(rl, "Votre choix : ")).trim().toUpperCase();

    if (answer === "Q") {
      rl.close();
      process.exit(0);
    } else if (answer === "N" || answer === "") {
      choice = null; // null = nouvelle conversation
      break;
    } else {
      const index = parseInt(answer) - 1;
      if (!isNaN(index) && index >= 0 && index < conversations.length) {
        choice = conversations[index].id;
      } else {
        console.log("  Choix invalide, réessayez.");
      }
    }
  }

  rl.close();
  console.log("");
  return choice;
}

export const startCLI = (chat: any) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question("Vous : ", async (input) => {
      const trimmed = input.trim();
      if (trimmed === "exit") {
        rl.close();
        clientConversationService.close();
        return;
      }
      if (trimmed) {
        await chat.run(trimmed);
      }
      prompt();
    });
  };

  prompt();
};