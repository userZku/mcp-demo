export const getTimeTool = {
  name: "get_time",
  description: "Retourne la date et l'heure actuelles du système",
  handler: async () => ({
    content: [
      {
        type: "text" as const,
        text: `Il est : ${new Date().toLocaleString("fr-FR")}`,
      },
    ],
  }),
};