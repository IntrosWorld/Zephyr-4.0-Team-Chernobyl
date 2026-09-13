// A fixed progression of milestones, mixing streaks, total completions, and
// level. `completions` is approximated from XP (10 XP per completion) since
// there's no separate lifetime counter — good enough for a progress path.
export const ACHIEVEMENTS = [
  { id: "first-step", label: "First step", icon: "footprints", check: (s) => s.completions >= 1 },
  { id: "three-day", label: "3-day streak", icon: "flame", check: (s) => s.bestStreak >= 3 },
  { id: "one-week", label: "One week strong", icon: "flame", check: (s) => s.bestStreak >= 7 },
  { id: "ten-done", label: "10 completions", icon: "target", check: (s) => s.completions >= 10 },
  { id: "two-week", label: "Two weeks", icon: "flame", check: (s) => s.bestStreak >= 14 },
  { id: "level-five", label: "Level 5", icon: "trophy", check: (s) => s.level >= 5 },
  { id: "one-month", label: "One month", icon: "flame", check: (s) => s.bestStreak >= 30 },
  { id: "fifty-done", label: "50 completions", icon: "star", check: (s) => s.completions >= 50 },
  { id: "level-ten", label: "Level 10", icon: "trophy", check: (s) => s.level >= 10 },
  { id: "century", label: "100-day streak", icon: "crown", check: (s) => s.bestStreak >= 100 },
];

export function getAchievementProgress({ level, xp, bestStreak }) {
  const completions = Math.floor((xp || 0) / 10);
  const context = { level: level || 1, completions, bestStreak: bestStreak || 0 };
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(context) }));
}
