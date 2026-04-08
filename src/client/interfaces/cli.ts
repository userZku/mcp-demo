import readline from "readline";

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
        return;
      }
      if (trimmed) {
        // cliChat affiche déjà la réponse, rien à faire ici
        await chat.run(trimmed);
      }
      prompt();
    });
  };

  prompt();
};