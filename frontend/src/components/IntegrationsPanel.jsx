import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMe, saveIntegrations, getGithubStats, getLeetcodeStats } from "../lib/api";

export default function IntegrationsPanel() {
  const { currentUser } = useAuth();

  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [githubStats, setGithubStats] = useState(null);
  const [githubError, setGithubError] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [leetcodeError, setLeetcodeError] = useState("");

  async function loadStats(integrations) {
    if (integrations?.github) {
      setGithubError("");
      try {
        setGithubStats(await getGithubStats(currentUser));
      } catch (err) {
        setGithubStats(null);
        setGithubError(err.message);
      }
    } else {
      setGithubStats(null);
    }

    if (integrations?.leetcode) {
      setLeetcodeError("");
      try {
        setLeetcodeStats(await getLeetcodeStats(currentUser));
      } catch (err) {
        setLeetcodeStats(null);
        setLeetcodeError(err.message);
      }
    } else {
      setLeetcodeStats(null);
    }
  }

  useEffect(() => {
    if (!currentUser) return;

    async function init() {
      const me = await getMe(currentUser);
      setGithubUsername(me.integrations?.github || "");
      setLeetcodeUsername(me.integrations?.leetcode || "");
      await loadStats(me.integrations);
    }

    init().catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const { integrations } = await saveIntegrations(currentUser, {
        github: githubUsername.trim(),
        leetcode: leetcodeUsername.trim(),
      });
      await loadStats(integrations);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-green-400">Coding Activity</h2>

      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="GitHub username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="LeetCode username"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-green-600/80 hover:bg-green-500 disabled:opacity-50 rounded-lg transition-colors font-medium text-sm"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {saveError && <p className="text-red-400 mb-4">{saveError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-gray-300 mb-4 border-b border-white/10 pb-2">GitHub</h3>
          {githubError ? (
            <p className="text-red-400">{githubError}</p>
          ) : githubStats ? (
            <div className="space-y-2">
              <p><span className="text-gray-400">Public repos:</span> {githubStats.publicRepos}</p>
              <p><span className="text-gray-400">Followers:</span> {githubStats.followers}</p>
              <p>
                <span className="text-gray-400">Current streak:</span>{" "}
                {githubStats.currentStreak ?? "Set GITHUB_TOKEN on the backend to see this"}
              </p>
              <p>
                <span className="text-gray-400">Contributions (past year):</span>{" "}
                {githubStats.totalContributions ?? "Set GITHUB_TOKEN on the backend to see this"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Add a GitHub username above to track it.</p>
          )}
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-gray-300 mb-4 border-b border-white/10 pb-2">LeetCode</h3>
          {leetcodeError ? (
            <p className="text-red-400">{leetcodeError}</p>
          ) : leetcodeStats ? (
            <div className="space-y-2">
              <p><span className="text-gray-400">Total solved:</span> {leetcodeStats.totalSolved}</p>
              <p>
                <span className="text-green-400">{leetcodeStats.easySolved} easy</span>
                {" / "}
                <span className="text-yellow-400">{leetcodeStats.mediumSolved} medium</span>
                {" / "}
                <span className="text-red-400">{leetcodeStats.hardSolved} hard</span>
              </p>
              <p><span className="text-gray-400">Ranking:</span> {leetcodeStats.ranking}</p>
              <p><span className="text-gray-400">Current streak:</span> {leetcodeStats.currentStreak} days</p>
            </div>
          ) : (
            <p className="text-gray-500">Add a LeetCode username above to track it.</p>
          )}
        </div>
      </div>
    </div>
  );
}
