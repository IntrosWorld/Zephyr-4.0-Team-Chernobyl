import { ListChecks, Flame, Trophy, TrendingUp } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs text-[#6b9285]">{label}</div>
        <div className="text-lg font-semibold text-[#0d2b24]">{value}</div>
      </div>
    </div>
  );
}

export default function SummaryCards({ totalHabits, activeStreaks, bestStreak, weekRate }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon={ListChecks} label="Total habits" value={totalHabits} color="#3b6fd6" />
      <StatCard icon={Flame} label="Active streaks" value={activeStreaks} color="#e8934a" />
      <StatCard icon={Trophy} label="Best streak" value={bestStreak} color="#c9a227" />
      <StatCard icon={TrendingUp} label="This week" value={`${weekRate}%`} color="#189c6b" />
    </div>
  );
}
