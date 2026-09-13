import { ListChecks, Flame, Trophy, TrendingUp } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}1f`, color }}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

export default function SummaryCards({ totalHabits, activeStreaks, bestStreak, weekRate }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon={ListChecks} label="Total habits" value={totalHabits} color="#818cf8" />
      <StatCard icon={Flame} label="Active streaks" value={activeStreaks} color="#fb923c" />
      <StatCard icon={Trophy} label="Best streak" value={bestStreak} color="#fbbf24" />
      <StatCard icon={TrendingUp} label="This week" value={`${weekRate}%`} color="#34d399" />
    </div>
  );
}
