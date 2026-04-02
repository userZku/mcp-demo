import { z } from "zod";
import { readFileSafe } from "../../services/file.service.js";

export const readFileTool = {
  name: "read_file",
  description: "Lit un fichier texte",
  inputSchema: {
    filepath: z.string(),
  },
  handler: async ({ filepath }: { filepath: string }) => {
    try {
      const content = await readFileSafe(filepath);
      return { content: [{ type: "text" as const, text: content }] };
    } catch (err: any) {
      return {
        content: [{ type: "text" as const, text: err.message }],
        isError: true,
      };
    }
  },
};