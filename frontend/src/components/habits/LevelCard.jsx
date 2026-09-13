import { Coins } from "lucide-react";

const XP_PER_LEVEL = 100;

export default function LevelCard({ stats }) {
  if (!stats) return null;

  const xpIntoLevel = stats.xp % XP_PER_LEVEL;
  const progress = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-[#6b9285]">Level</div>
          <div className="text-2xl font-semibold text-[#0d2b24]">{stats.level}</div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[#c9a227]">
          <Coins size={16} />
          <span className="font-medium">{stats.gold}</span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-[#bfe8d8] overflow-hidden">
        <div className="h-full rounded-full bg-[#159c86]" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-xs text-[#6b9285] mt-1.5">
        {xpIntoLevel} / {XP_PER_LEVEL} XP to level {stats.level + 1}
      </div>
    </div>
  );
}
