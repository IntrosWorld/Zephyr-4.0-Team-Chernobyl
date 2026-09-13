import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMe, saveIntegrations, getGithubStats, getLeetcodeStats } from "../lib/api";

const inputClass =
  "flex-1 bg-[#c9ede0] border border-[#9ed9c4] rounded-lg px-4 py-2 text-[#0d2b24] placeholder-[#a3c7bb] focus:outline-none focus:border-[#159c86]";

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
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-6">
      <h2 className="text-lg font-medium text-[#0d2b24] mb-6">Coding activity</h2>

      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="GitHub username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="LeetCode username"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[#159c86] hover:bg-[#0d6b5a] disabled:opacity-50 rounded-lg transition-colors font-medium text-sm text-black"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {saveError && <p className="text-[#c0392b] mb-4">{saveError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#bfe8d8] rounded-xl p-6 border border-[#9ed9c4]">
          <h3 className="text-sm font-medium text-[#3f6359] mb-4 border-b border-[#9ed9c4] pb-2">GitHub</h3>
          {githubError ? (
            <p className="text-[#c0392b]">{githubError}</p>
          ) : githubStats ? (
            <div className="space-y-2 text-[#0d2b24]">
              <p><span className="text-[#6b9285]">Public repos:</span> {githubStats.publicRepos}</p>
              <p><span className="text-[#6b9285]">Followers:</span> {githubStats.followers}</p>
              <p>
                <span className="text-[#6b9285]">Current streak:</span>{" "}
                {githubStats.currentStreak ?? "Set GITHUB_TOKEN on the backend to see this"}
              </p>
              <p>
                <span className="text-[#6b9285]">Contributions (past year):</span>{" "}
                {githubStats.totalContributions ?? "Set GITHUB_TOKEN on the backend to see this"}
              </p>
            </div>
          ) : (
            <p className="text-[#6b9285]">Add a GitHub username above to track it.</p>
          )}
        </div>

        <div className="bg-[#bfe8d8] rounded-xl p-6 border border-[#9ed9c4]">
          <h3 className="text-sm font-medium text-[#3f6359] mb-4 border-b border-[#9ed9c4] pb-2">LeetCode</h3>
          {leetcodeError ? (
            <p className="text-[#c0392b]">{leetcodeError}</p>
          ) : leetcodeStats ? (
            <div className="space-y-2 text-[#0d2b24]">
              <p><span className="text-[#6b9285]">Total solved:</span> {leetcodeStats.totalSolved}</p>
              <p>
                <span className="text-[#189c6b]">{leetcodeStats.easySolved} easy</span>
                {" / "}
                <span className="text-[#c9a227]">{leetcodeStats.mediumSolved} medium</span>
                {" / "}
                <span className="text-[#c0392b]">{leetcodeStats.hardSolved} hard</span>
              </p>
              <p><span className="text-[#6b9285]">Ranking:</span> {leetcodeStats.ranking}</p>
              <p><span className="text-[#6b9285]">Current streak:</span> {leetcodeStats.currentStreak} days</p>
            </div>
          ) : (
            <p className="text-[#6b9285]">Add a LeetCode username above to track it.</p>
          )}
        </div>
      </div>
    </div>
  );
}
