import { z } from "zod";
import { writeFileSafe } from "../../services/file.service.js";

export const writeFileTool = {
  name: "write_file",
  description: "Écrit dans un fichier",
  inputSchema: {
    filepath: z.string(),
    content: z.string(),
    append: z.boolean().optional(),
  },
  handler: async ({
    filepath,
    content,
    append = false,
  }: {
    filepath: string;
    content: string;
    append?: boolean;
  }) => {
    try {
      await writeFileSafe(filepath, content, append);
      return {
        content: [{ type: "text" as const, text: "Fichier écrit avec succès" }],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text" as const, text: err.message }],
        isError: true,
      };
    }
  },
};