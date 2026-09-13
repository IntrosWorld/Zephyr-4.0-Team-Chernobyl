import { useState } from "react";
import { HABIT_ICON_KEYS, HabitIcon } from "../../utils/habitIcons";
import { HABIT_COLORS } from "../../utils/habitColors";

const CATEGORIES = ["general", "health", "fitness", "learning", "mindfulness", "creativity"];
const inputClass =
  "w-full bg-[#c9ede0] border border-[#9ed9c4] rounded-lg px-3 py-2 text-[#0d2b24] placeholder-[#a3c7bb] focus:outline-none focus:border-[#159c86]";

export default function HabitForm({ initial, submitting, onCancel, onSubmit }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "general");
  const [icon, setIcon] = useState(initial?.icon || HABIT_ICON_KEYS[0]);
  const [color, setColor] = useState(initial?.color || HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState(initial?.frequency || "daily");
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      icon,
      color,
      frequency,
      reminderTime: reminderTime || null,
      targetDays: frequency === "daily" ? 7 : 3,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-[#527d71] mb-1.5">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="Drink water"
        />
      </div>

      <div>
        <label className="block text-sm text-[#527d71] mb-1.5">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Optional"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#527d71] mb-1.5">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[#527d71] mb-1.5">Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
            <option value="daily">Daily</option>
            <option value="weekly">A few times a week</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#527d71] mb-1.5">Reminder (optional)</label>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm text-[#527d71] mb-2">Icon</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICON_KEYS.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setIcon(key)}
              aria-label={key}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                icon === key
                  ? "border-[#159c86] bg-[#a8ddc7] text-[#159c86]"
                  : "border-[#9ed9c4] text-[#527d71] hover:border-[#8fcdb5]"
              }`}
            >
              <HabitIcon icon={key} size={16} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#527d71] mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: c,
                outline: color === c ? "2px solid #0d2b24" : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-[#3f6359] hover:bg-[#bfe8d8]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#159c86] hover:bg-[#0d6b5a] text-black disabled:opacity-50"
        >
          {submitting ? "Saving..." : initial ? "Save changes" : "Create habit"}
        </button>
      </div>
    </form>
  );
}
