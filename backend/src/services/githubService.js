const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

function authHeaders() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

// Counts consecutive days with contributions, walking back from today.
// Today is allowed to be empty (no commits yet) without breaking the streak.
function calculateStreak(contributionDays) {
  let streak = 0;
  for (let i = contributionDays.length - 1; i >= 0; i--) {
    const { contributionCount } = contributionDays[i];
    if (contributionCount > 0) {
      streak++;
      continue;
    }
    if (i === contributionDays.length - 1) continue;
    break;
  }
  return streak;
}

async function fetchContributionCalendar(username) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!response.ok) return null;

  const { data, errors } = await response.json();
  if (errors || !data?.user) return null;

  const calendar = data.user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks.flatMap((week) => week.contributionDays);

  return {
    totalContributions: calendar.totalContributions,
    currentStreak: calculateStreak(days),
  };
}

async function fetchProfile(username) {
  const response = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: authHeaders(),
  });

  if (response.status === 404) {
    const error = new Error("GitHub user not found");
    error.statusCode = 404;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("Failed to fetch GitHub profile");
    error.statusCode = 502;
    throw error;
  }

  return response.json();
}

async function getGithubStats(username) {
  const profile = await fetchProfile(username);

  // Contribution calendar needs GraphQL + a token; degrade gracefully without one.
  const calendar = process.env.GITHUB_TOKEN
    ? await fetchContributionCalendar(username)
    : null;

  return {
    username: profile.login,
    avatarUrl: profile.avatar_url,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    profileUrl: profile.html_url,
    totalContributions: calendar?.totalContributions ?? null,
    currentStreak: calendar?.currentStreak ?? null,
  };
}

module.exports = { getGithubStats };
