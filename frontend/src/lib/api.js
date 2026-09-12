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
