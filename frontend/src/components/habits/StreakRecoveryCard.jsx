import { X } from "lucide-react";
import Mascot from "./Mascot";

export default function StreakRecoveryCard({ habit, onDismiss }) {
  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-4 flex items-center gap-3">
      <Mascot pose="cry" size={40} className="shrink-0" />
      <p className="text-sm text-[#0d2b24] flex-1">
        Your <span className="font-medium">{habit.name}</span> streak reset. You'd built up {habit.longest} days
        before — pick it back up today.
      </p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="p-1.5 rounded-lg text-[#6b9285] hover:text-[#0d2b24] hover:bg-[#bfe8d8] shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
