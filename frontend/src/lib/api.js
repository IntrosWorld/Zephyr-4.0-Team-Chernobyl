const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function authedFetch(path, user, options = {}) {
  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request to ${path} failed`);
  }

  return data;
}

export function getMe(user) {
  return authedFetch("/user/me", user);
}

export function saveSettings(user, settings) {
  return authedFetch("/user/settings", user, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export function saveIntegrations(user, { github, leetcode }) {
  return authedFetch("/integrations", user, {
    method: "PUT",
    body: JSON.stringify({ github, leetcode }),
  });
}

/* ---------------------------------------------------------------- quests -- */

export function getTasks(user) {
  return authedFetch("/tasks", user);
}

export function createTask(user, task) {
  return authedFetch("/tasks", user, { method: "POST", body: JSON.stringify(task) });
}

export function updateTask(user, id, updates) {
  return authedFetch(`/tasks/${id}`, user, { method: "PUT", body: JSON.stringify(updates) });
}

export function deleteTask(user, id) {
  return authedFetch(`/tasks/${id}`, user, { method: "DELETE" });
}

/**
 * Completing a quest is its own endpoint rather than a PUT, because the server
 * grants XP, gold, attribute progress and streak credit in one transaction and
 * returns the deltas so the UI can celebrate from an authoritative number.
 */
export function completeTask(user, id) {
  return authedFetch(`/tasks/${id}/complete`, user, { method: "POST" });
}

export function getActivity(user) {
  return authedFetch("/tasks/activity", user);
}

/* ------------------------------------------------------------ flashcards -- */

export function getDecks(user) {
  return authedFetch("/decks", user);
}

export function createDeck(user, deck) {
  return authedFetch("/decks", user, { method: "POST", body: JSON.stringify(deck) });
}

export function updateDeck(user, id, updates) {
  return authedFetch(`/decks/${id}`, user, { method: "PUT", body: JSON.stringify(updates) });
}

export function deleteDeck(user, id) {
  return authedFetch(`/decks/${id}`, user, { method: "DELETE" });
}

export function getCards(user, deckId) {
  return authedFetch(`/decks/${deckId}/cards`, user);
}

export function createCard(user, deckId, card) {
  return authedFetch(`/decks/${deckId}/cards`, user, {
    method: "POST",
    body: JSON.stringify(card),
  });
}

export function updateCard(user, deckId, cardId, updates) {
  return authedFetch(`/decks/${deckId}/cards/${cardId}`, user, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteCard(user, deckId, cardId) {
  return authedFetch(`/decks/${deckId}/cards/${cardId}`, user, { method: "DELETE" });
}

export function studyDeck(user, deckId, cardsReviewed) {
  return authedFetch(`/decks/${deckId}/study`, user, {
    method: "POST",
    body: JSON.stringify({ cardsReviewed }),
  });
}

/** Uploads through our own backend so the image-host key is never shipped to the browser. */
export function uploadImage(user, dataUrl, name) {
  return authedFetch("/upload", user, {
    method: "POST",
    body: JSON.stringify({ image: dataUrl, name }),
  });
}

/* ---------------------------------------------------------- integrations -- */

export function getGithubStats(user) {
  return authedFetch("/integrations/github", user);
}

export function getLeetcodeStats(user) {
  return authedFetch("/integrations/leetcode", user);
}
