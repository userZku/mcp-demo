/**
 * Chat Web - Logique de l'interface utilisateur
 */

// État global
let isLoading = false;
let activeConversationId = null;
let conversations = [];

// Sélection des éléments DOM
const inputElement = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const chatDiv = document.getElementById("chat");
const conversationSelect = document.getElementById("conversationSelect");
const conversationList = document.getElementById("conversationList");
const newConversationBtn = document.getElementById("newConversationBtn");
const conversationMeta = document.getElementById("conversationMeta");

/**
 * Initialisation au chargement de la page
 */
function init() {
  // Gestion du bouton Enter
  inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !isLoading) {
      send();
    }
  });

  // Focus initial
  inputElement.focus();

  // Actions conversations
  conversationSelect.addEventListener("change", async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    await selectConversation(selectedId);
  });

  newConversationBtn.addEventListener("click", async () => {
    await createNewConversation();
  });

  loadConversations();
}

function getVisibleMessages(messages) {
  return messages.filter((m) => m.role === "user" || m.role === "assistant");
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateConversationMeta() {
  const current = conversations.find((c) => c.id === activeConversationId);
  if (!current) {
    conversationMeta.textContent = "Aucune conversation sélectionnée";
    return;
  }
  const userVisibleCount = Math.max(0, current.messageCount - 1);
  conversationMeta.textContent = `${current.id} • ${userVisibleCount} messages • ${formatDate(current.updatedAt)}`;
}

function renderConversationMenu() {
  conversationSelect.innerHTML = "";

  if (conversations.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Aucune conversation";
    conversationSelect.appendChild(option);
    conversationSelect.disabled = true;
    return;
  }

  conversationSelect.disabled = false;
  conversations.forEach((conversation) => {
    const option = document.createElement("option");
    option.value = conversation.id;
    option.textContent = `${conversation.id} (${Math.max(0, conversation.messageCount - 1)})`;
    option.selected = conversation.id === activeConversationId;
    conversationSelect.appendChild(option);
  });
}

function renderConversationList() {
  conversationList.innerHTML = "";

  if (conversations.length === 0) {
    const empty = document.createElement("p");
    empty.className = "conversation-empty";
    empty.textContent = "Pas encore d'historique";
    conversationList.appendChild(empty);
    return;
  }

  conversations.forEach((conversation) => {
    const row = document.createElement("div");
    row.className = "conversation-row";

    const item = document.createElement("button");
    item.type = "button";
    item.className = "conversation-item";
    if (conversation.id === activeConversationId) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <span class="conversation-title">${conversation.id}</span>
      <span class="conversation-subtitle">${Math.max(0, conversation.messageCount - 1)} messages • ${formatDate(conversation.updatedAt)}</span>
    `;

    item.addEventListener("click", async () => {
      await selectConversation(conversation.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "conversation-delete";
    deleteBtn.title = "Supprimer cette conversation";
    deleteBtn.textContent = "Suppr.";
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteConversation(conversation.id);
    });

    row.appendChild(item);
    row.appendChild(deleteBtn);
    conversationList.appendChild(row);
  });
}

async function deleteConversation(conversationId) {
  const confirmed = window.confirm("Supprimer cette conversation de l'historique ?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/conversations/${encodeURIComponent(conversationId)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Impossible de supprimer cette conversation");

    const data = await res.json();
    activeConversationId = data.id;

    await loadConversations();
    renderHistory(data.messages || []);
  } catch (error) {
    addError(error.message || "Erreur de suppression de conversation");
  }
}

function renderHistory(messages) {
  chatDiv.innerHTML = "";
  const visible = getVisibleMessages(messages);

  if (visible.length === 0) {
    chatDiv.innerHTML = `
      <div class="empty-state">
        <p>Conversation vide. Écrivez votre premier message.</p>
      </div>
    `;
    return;
  }

  visible.forEach((msg) => addMessage(msg.content, msg.role));
}

async function loadConversations() {
  try {
    const res = await fetch("/conversations");
    if (!res.ok) throw new Error("Impossible de charger les conversations");

    const data = await res.json();
    conversations = data.conversations || [];
    activeConversationId = data.currentConversationId;

    renderConversationMenu();
    renderConversationList();
    updateConversationMeta();

    if (activeConversationId) {
      await loadConversationMessages(activeConversationId);
    }
  } catch (error) {
    addError(error.message || "Erreur lors du chargement des conversations");
  }
}

async function loadConversationMessages(conversationId) {
  const res = await fetch(`/conversations/${encodeURIComponent(conversationId)}/messages`);
  if (!res.ok) throw new Error("Impossible de charger l'historique");
  const data = await res.json();
  renderHistory(data.messages || []);
}

async function selectConversation(conversationId) {
  try {
    const res = await fetch("/conversations/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: conversationId }),
    });
    if (!res.ok) throw new Error("Impossible de sélectionner cette conversation");

    const data = await res.json();
    activeConversationId = data.id;
    renderConversationMenu();
    renderConversationList();
    updateConversationMeta();
    renderHistory(data.messages || []);
  } catch (error) {
    addError(error.message || "Erreur de sélection de conversation");
  }
}

async function createNewConversation() {
  try {
    const res = await fetch("/conversations/new", { method: "POST" });
    if (!res.ok) throw new Error("Impossible de créer une conversation");

    const data = await res.json();
    activeConversationId = data.id;
    await loadConversations();
    renderHistory(data.messages || []);
  } catch (error) {
    addError(error.message || "Erreur lors de la création");
  }
}

/**
 * Nettoyer l'état vide
 */
function clearEmptyState() {
  if (chatDiv.querySelector(".empty-state")) {
    chatDiv.innerHTML = "";
  }
}

/**
 * Scroller vers le bas automatiquement
 */
function scrollToBottom() {
  setTimeout(() => {
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, 0);
}

/**
 * Ajouter un message (user ou assistant)
 */
function addMessage(text, role) {
  clearEmptyState();
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";
  contentDiv.textContent = text;

  messageDiv.appendChild(contentDiv);
  chatDiv.appendChild(messageDiv);
  scrollToBottom();
}

/**
 * Afficher l'indicateur de typing (en cours de réponse)
 */
function addTypingIndicator() {
  clearEmptyState();
  const messageDiv = document.createElement("div");
  messageDiv.className = "message assistant";
  messageDiv.id = "typing-indicator";

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

  messageDiv.appendChild(indicator);
  chatDiv.appendChild(messageDiv);
  scrollToBottom();
}

/**
 * Supprimer l'indicateur de typing
 */
function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Afficher un message d'erreur
 */
function addError(message) {
  clearEmptyState();
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.textContent = "❌ Erreur : " + message;
  chatDiv.appendChild(errorDiv);
  scrollToBottom();
}

/**
 * Envoyer le message à l'API
 */
async function send() {
  const input = inputElement.value.trim();
  if (!input || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;
  inputElement.disabled = true;

  try {
    // Afficher le message utilisateur
    addMessage(input, "user");
    inputElement.value = "";

    // Afficher l'indicateur de typing
    addTypingIndicator();

    // Envoyer au serveur
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    removeTypingIndicator();

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.response) {
      addMessage(data.response, "assistant");
      await loadConversations();
    } else {
      addError("Réponse vide du serveur");
    }
  } catch (error) {
    removeTypingIndicator();
    addError(error.message || "Impossible de contacter le serveur");
    console.error("Erreur:", error);
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    inputElement.disabled = false;
    inputElement.focus();
  }
}

// Initialiser quand le DOM est prêt
document.addEventListener("DOMContentLoaded", init);
