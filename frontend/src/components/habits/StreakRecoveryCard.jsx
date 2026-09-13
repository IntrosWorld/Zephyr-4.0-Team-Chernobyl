import { Flame, X } from "lucide-react";

export default function StreakRecoveryCard({ habit, onDismiss }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
      <Flame size={18} className="text-orange-400 shrink-0" />
      <p className="text-sm flex-1">
        Your <span className="font-medium">{habit.name}</span> streak reset. You'd built up {habit.longest} days
        before — pick it back up today.
      </p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
