import { z } from "zod";

export const addTool = {
  name: "add",
  description: "Additionne deux nombres",
  inputSchema: { a: z.number(), b: z.number() },
  handler: async ({ a, b }: { a: number; b: number }) => ({
    content: [
      { 
        type: "text" as const, 
        text: `${a} + ${b} = ${a + b}`,
      }
    ],
  }),
};