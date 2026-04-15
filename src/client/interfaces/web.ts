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

  app.get("/conversations", (_req, res) => {
    const conversations = chat.listConversations();
    res.json({
      currentConversationId: chat.getCurrentConversationId(),
      conversations,
    });
  });

  app.get("/conversations/:id/messages", (req, res) => {
    const { id } = req.params;
    const data = chat.getConversationMessages(id);
    res.json(data);
  });

  app.post("/conversations/new", (_req, res) => {
    const data = chat.createNewConversation();
    res.json(data);
  });

  app.post("/conversations/select", (req, res) => {
    const { id } = req.body;
    const data = chat.selectConversation(id);
    res.json(data);
  });

  app.delete("/conversations/:id", (req, res) => {
    const { id } = req.params;
    const data = chat.deleteConversation(id);
    res.json(data);
  });

  app.listen(3000, () => {
    console.log("🌐 Web UI running at http://localhost:3000");
  });
};