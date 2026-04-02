import ollama, { type Message } from "ollama";

export const chatWithModel = async ({
  model,
  messages,
  tools,
}: {
  model: string;
  messages: Message[];
  tools?: any[];
}) => {
  return ollama.chat({
    model,
    messages,
    tools,
    think: false,
  });
};