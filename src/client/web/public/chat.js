/**
 * Chat Web - Logique de l'interface utilisateur
 */

// État global
let isLoading = false;

// Sélection des éléments DOM
const inputElement = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const chatDiv = document.getElementById("chat");

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
