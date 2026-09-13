import { Check, Flame, Pencil, Archive, Trash2 } from "lucide-react";
import { HabitIcon } from "../../utils/habitIcons";

export default function TodayHabitCard({ habit, completed, streak, onToggle, onEdit, onArchive, onDelete }) {
  const color = habit.color || "#159c86";

  return (
    <div className="flex items-center gap-4 bg-[#a8ddc7] border border-[#8fcdb5] rounded-xl p-4">
      <button
        onClick={onToggle}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors text-black"
        style={{
          background: completed ? color : "transparent",
          borderColor: completed ? color : "#6bb89a",
        }}
      >
        {completed && <Check size={16} />}
      </button>

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <HabitIcon icon={habit.icon} size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#0d2b24] truncate">{habit.name}</div>
        <div className="text-xs text-[#6b9285] truncate">{habit.category}</div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-[#3f6359] shrink-0">
        <Flame size={14} className="text-[#e8934a]" />
        <span>{streak}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          aria-label="Edit habit"
          className="p-2 rounded-lg text-[#6b9285] hover:text-[#0d2b24] hover:bg-[#bfe8d8]"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onArchive}
          aria-label="Archive habit"
          className="p-2 rounded-lg text-[#6b9285] hover:text-[#0d2b24] hover:bg-[#bfe8d8]"
        >
          <Archive size={14} />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete habit"
          className="p-2 rounded-lg text-[#6b9285] hover:text-[#c0392b] hover:bg-[#bfe8d8]"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
