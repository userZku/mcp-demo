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
        const response = await chat.run(trimmed);
        console.log(`\nAssistant : ${response}\n`);
      }
      prompt();
    });
  };

  prompt();
};