import { useCallback, useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import * as api from "../lib/api";

/**
 * GitHub and LeetCode dashboards for the laptop OS.
 *
 * Usernames are stored per account on the server, so the widgets follow the
 * user across devices rather than living in this browser.
 */
export default function StatsWidgets() {
  const { currentUser, signedIn, profile } = useGame();

  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [githubError, setGithubError] = useState("");
  const [leetcodeError, setLeetcodeError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGithub(profile?.integrations?.github || "");
    setLeetcode(profile?.integrations?.leetcode || "");
  }, [profile]);

  const load = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);

    const results = await Promise.allSettled([
      profile?.integrations?.github ? api.getGithubStats(currentUser) : Promise.resolve(null),
      profile?.integrations?.leetcode ? api.getLeetcodeStats(currentUser) : Promise.resolve(null),
    ]);

    // Settled rather than all: one broken username must not blank the other card.
    const [gh, lc] = results;
    if (gh.status === "fulfilled") { setGithubStats(gh.value); setGithubError(""); }
    else { setGithubStats(null); setGithubError(gh.reason?.message || "Could not load GitHub"); }

    if (lc.status === "fulfilled") { setLeetcodeStats(lc.value); setLeetcodeError(""); }
    else { setLeetcodeStats(null); setLeetcodeError(lc.reason?.message || "Could not load LeetCode"); }

    setLoading(false);
  }, [currentUser, profile]);

  useEffect(() => { load(); }, [load]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.saveIntegrations(currentUser, { github: github.trim(), leetcode: leetcode.trim() });
      await load();
    } catch (err) {
      setGithubError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!signedIn) {
    return (
      <div className="stats-app cards-guest">
        <h2>Trackers</h2>
        <p>Sign in to connect your GitHub and LeetCode profiles.</p>
      </div>
    );
  }

  return (
    <div className="stats-app">
      <header className="cards-head">
        <div><span className="cards-kicker">Connected</span><h2>Developer trackers</h2></div>
      </header>

      <form className="stats-form" onSubmit={save}>
        <label>
          <span>GitHub username</span>
          <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="octocat" />
        </label>
        <label>
          <span>LeetCode username</span>
          <input value={leetcode} onChange={(e) => setLeetcode(e.target.value)} placeholder="leetcoder" />
        </label>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save & refresh"}</button>
      </form>

      {loading && <p className="cards-loading">Fetching stats…</p>}

      <div className="stats-grid">
        <GithubCard stats={githubStats} error={githubError} />
        <LeetcodeCard stats={leetcodeStats} error={leetcodeError} />
      </div>
    </div>
  );
}

function GithubCard({ stats, error }) {
  if (error) return <section className="stat-card is-error"><h3>GitHub</h3><p>{error}</p></section>;
  if (!stats) return <section className="stat-card is-empty"><h3>GitHub</h3><p>Add a username to see your contributions.</p></section>;

  return (
    <section className="stat-card stat-github">
      <header>
        {stats.avatarUrl && <img src={stats.avatarUrl} alt="" width="44" height="44" />}
        <div>
          <h3>{stats.name || stats.username}</h3>
          <a href={stats.profileUrl} target="_blank" rel="noreferrer noopener">@{stats.username}</a>
        </div>
      </header>

      <div className="stat-numbers">
        <div><b>{stats.publicRepos}</b><span>Repos</span></div>
        <div><b>{stats.followers}</b><span>Followers</span></div>
        {stats.totalContributions !== null && <div><b>{stats.totalContributions}</b><span>Contributions</span></div>}
        {stats.currentStreak !== null && <div><b>{stats.currentStreak}</b><span>Day streak</span></div>}
      </div>

      {stats.days ? (
        <ContributionHeatmap days={stats.days} bestDay={stats.bestDay} />
      ) : (
        <p className="stat-note">
          Set <code>GITHUB_TOKEN</code> on the server to unlock the contribution graph.
        </p>
      )}
    </section>
  );
}

/** The familiar contribution grid: one column per week, one square per day. */
function ContributionHeatmap({ days, bestDay }) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // Scale against the user's own best day so a quiet year still shows contrast.
  const peak = Math.max(bestDay || 0, 1);
  const level = (count) => (count === 0 ? 0 : Math.min(4, Math.ceil((count / peak) * 4)));

  return (
    <div className="heatmap" role="img" aria-label={`Contribution activity, best day ${bestDay} contributions`}>
      {weeks.map((week, w) => (
        <div key={w} className="heatmap-week">
          {week.map((day) => (
            <i
              key={day.date}
              data-level={level(day.contributionCount)}
              title={`${day.contributionCount} on ${day.date}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function LeetcodeCard({ stats, error }) {
  if (error) return <section className="stat-card is-error"><h3>LeetCode</h3><p>{error}</p></section>;
  if (!stats) return <section className="stat-card is-empty"><h3>LeetCode</h3><p>Add a username to see your solved problems.</p></section>;

  const total = Math.max(stats.totalSolved, 1);
  const bars = [
    { label: "Easy", value: stats.easySolved, key: "easy" },
    { label: "Medium", value: stats.mediumSolved, key: "medium" },
    { label: "Hard", value: stats.hardSolved, key: "hard" },
  ];

  return (
    <section className="stat-card stat-leetcode">
      <header>
        <div>
          <h3>LeetCode</h3>
          <a href={`https://leetcode.com/${stats.username}/`} target="_blank" rel="noreferrer noopener">
            @{stats.username}
          </a>
        </div>
        <strong className="leet-total">{stats.totalSolved}</strong>
      </header>

      <div className="leet-bars">
        {bars.map((bar) => (
          <div key={bar.key} className={`leet-bar leet-${bar.key}`}>
            <span>{bar.label}</span>
            <i><b style={{ width: `${(bar.value / total) * 100}%` }} /></i>
            <em>{bar.value}</em>
          </div>
        ))}
      </div>

      <div className="stat-numbers">
        <div><b>{stats.currentStreak}</b><span>Day streak</span></div>
        <div><b>{stats.totalActiveDays}</b><span>Active days</span></div>
        {stats.ranking && <div><b>#{stats.ranking.toLocaleString()}</b><span>Ranking</span></div>}
      </div>
    </section>
  );
}
