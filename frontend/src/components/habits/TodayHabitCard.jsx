import { Check, Flame, Pencil, Archive, Trash2 } from "lucide-react";
import { HabitIcon } from "../../utils/habitIcons";

export default function TodayHabitCard({ habit, completed, streak, onToggle, onEdit, onArchive, onDelete }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
      <button
        onClick={onToggle}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
          completed
            ? "bg-emerald-500 border-emerald-500 text-black"
            : "border-white/20 text-transparent hover:border-white/40"
        }`}
      >
        <Check size={16} />
      </button>

      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 shrink-0">
        <HabitIcon icon={habit.icon} size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{habit.name}</div>
        <div className="text-xs text-gray-400 truncate">{habit.category}</div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-300 shrink-0">
        <Flame size={14} className="text-orange-400" />
        <span>{streak}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          aria-label="Edit habit"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onArchive}
          aria-label="Archive habit"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Archive size={14} />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete habit"
          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
