import express from "express";

export const startWebServer = (chat: any) => {
  const app = express();
  app.use(express.json());
  app.use(express.static("web/public")); // index.html

  app.post("/chat", async (req, res) => {
    const { message } = req.body;
    const response = await chat.run(message);
    res.json({ response });
  });

  app.listen(3000, () => {
    console.log("🌐 Web UI running at http://localhost:3000");
  });
};