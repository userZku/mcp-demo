import { z } from "zod";
import { getWeather } from "../../services/weather.service.js";

export const weatherTool = {
  name: "get_weather",
  description: "Retourne la météo d'une ville",
  inputSchema: {
    city: z.string(),
  },
  handler: async ({ city }: { city: string }) => {
    try {
      const result = await getWeather(city);
      return {
        content: [{ type: "text" as const, text: result }],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text" as const, text: err.message }],
        isError: true,
      };
    }
  },
};