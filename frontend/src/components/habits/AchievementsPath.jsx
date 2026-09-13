import { Footprints, Flame, Target, Trophy, Star, Crown, Lock } from "lucide-react";
import { getAchievementProgress } from "../../utils/achievements";
import Mascot from "./Mascot";

const ICONS = { footprints: Footprints, flame: Flame, target: Target, trophy: Trophy, star: Star, crown: Crown };

// Alternates node position left/center/right down the page, Duolingo-path style.
const LANES = ["justify-start pl-2", "justify-center", "justify-end pr-2"];

export default function AchievementsPath({ stats }) {
  const achievements = getAchievementProgress(stats || {});
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="flex justify-center mb-1">
        <Mascot pose="sing" size={48} />
      </div>
      <div className="text-xs text-[#6b9285] mb-3 text-center">
        {unlockedCount}/{achievements.length} milestones unlocked
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-1 bottom-1 border-l-2 border-dashed border-[#9ed9c4] -translate-x-1/2" />
        <div className="relative flex flex-col gap-1.5">
          {achievements.map((a, i) => {
            const Icon = ICONS[a.icon] || Star;
            return (
              <div key={a.id} className={`flex items-center ${LANES[i % LANES.length]}`}>
                <div className="flex flex-col items-center gap-0.5 w-16">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                    style={
                      a.unlocked
                        ? { background: "#159c86", borderColor: "#159c86", color: "#000000" }
                        : { background: "#bfe8d8", borderColor: "#9ed9c4", color: "#a3c7bb" }
                    }
                  >
                    {a.unlocked ? <Icon size={14} /> : <Lock size={12} />}
                  </div>
                  <div className="text-[9px] text-center text-[#527d71] leading-tight">{a.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
