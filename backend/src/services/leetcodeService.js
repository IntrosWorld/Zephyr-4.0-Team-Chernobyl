const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
    }
  }
`;

async function getLeetcodeStats(username) {
  const response = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  });

  if (!response.ok) {
    const error = new Error("Failed to fetch LeetCode profile");
    error.statusCode = 502;
    throw error;
  }

  const { data } = await response.json();
  const user = data?.matchedUser;

  if (!user) {
    const error = new Error("LeetCode user not found");
    error.statusCode = 404;
    throw error;
  }

  const byDifficulty = Object.fromEntries(
    user.submitStats.acSubmissionNum.map(({ difficulty, count }) => [difficulty.toLowerCase(), count])
  );

  return {
    username: user.username,
    ranking: user.profile.ranking,
    totalSolved: byDifficulty.all ?? 0,
    easySolved: byDifficulty.easy ?? 0,
    mediumSolved: byDifficulty.medium ?? 0,
    hardSolved: byDifficulty.hard ?? 0,
    currentStreak: user.userCalendar.streak,
    totalActiveDays: user.userCalendar.totalActiveDays,
  };
}

module.exports = { getLeetcodeStats };
