import Modal from "./Modal";
import { HabitIcon } from "../../utils/habitIcons";

// Static curated list — no AI involved, kept simple until a real suggestion
// engine is wired up.
const SUGGESTIONS = [
  { name: "Drink a glass of water", description: "Right when you wake up.", category: "health", icon: "droplet", frequency: "daily" },
  { name: "Read 10 pages", description: "Any book counts.", category: "learning", icon: "book-open", frequency: "daily" },
  { name: "Stretch for 5 minutes", description: "Loosen up before the day starts.", category: "fitness", icon: "wind", frequency: "daily" },
  { name: "Write 3 things you're grateful for", description: "Keep it short.", category: "mindfulness", icon: "sparkles", frequency: "daily" },
  { name: "Take a walk outside", description: "10 minutes, no phone.", category: "health", icon: "footprints", frequency: "weekly" },
  { name: "No phone in bed", description: "Charge it outside the bedroom.", category: "mindfulness", icon: "moon", frequency: "daily" },
];

export default function HabitSuggestionModal({ open, onClose, onAccept }) {
  return (
    <Modal open={open} onClose={onClose} title="Habit ideas" maxWidth="max-w-lg">
      <div className="space-y-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.name}
            onClick={() => {
              onAccept(s);
              onClose();
            }}
            className="w-full flex items-center gap-3 text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 shrink-0">
              <HabitIcon icon={s.icon} size={16} />
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">{s.name}</div>
              <div className="text-xs text-gray-400 truncate">{s.description}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
