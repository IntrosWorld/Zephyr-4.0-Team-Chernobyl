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

export function saveIntegrations(user, { github, leetcode }) {
  return authedFetch("/integrations", user, {
    method: "PUT",
    body: JSON.stringify({ github, leetcode }),
  });
}

export function getGithubStats(user) {
  return authedFetch("/integrations/github", user);
}

export function getLeetcodeStats(user) {
  return authedFetch("/integrations/leetcode", user);
}

export function getHabits(user) {
  return authedFetch("/habits", user);
}

export function createHabit(user, habit) {
  return authedFetch("/habits", user, { method: "POST", body: JSON.stringify(habit) });
}

export function updateHabit(user, id, updates) {
  return authedFetch(`/habits/${id}`, user, { method: "PUT", body: JSON.stringify(updates) });
}

export function archiveHabit(user, id) {
  return authedFetch(`/habits/${id}/archive`, user, { method: "PUT" });
}

export function deleteHabit(user, id) {
  return authedFetch(`/habits/${id}`, user, { method: "DELETE" });
}

export function getTodayLogs(user) {
  return authedFetch("/logs/today", user);
}

export function getRangeLogs(user, start, end) {
  return authedFetch(`/logs/range?start=${start}&end=${end}`, user);
}

export function getHeatmapLogs(user) {
  return authedFetch("/logs/heatmap", user);
}

export function createLog(user, habitId, date) {
  return authedFetch("/logs", user, { method: "POST", body: JSON.stringify({ habitId, date }) });
}

export function deleteLog(user, habitId, date) {
  return authedFetch("/logs", user, { method: "DELETE", body: JSON.stringify({ habitId, date }) });
}
