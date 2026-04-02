import { Ollama, type Message } from "ollama";

const ollama = new Ollama({
  host: "http://localhost:11434",
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      signal: AbortSignal.timeout(5 * 60 * 1000),
    }),
});

const baseRequest = (model: string, messages: Message[], tools?: any[]) => ({
  model,
  messages,
  tools,
  think: false,
});

export const chatWithModel = (model: string, messages: Message[], tools?: any[]) =>
  ollama.chat({ ...baseRequest(model, messages, tools), stream: false });

export const chatWithModelStream = (model: string, messages: Message[], tools?: any[]) =>
  ollama.chat({ ...baseRequest(model, messages, tools), stream: true, think: true});