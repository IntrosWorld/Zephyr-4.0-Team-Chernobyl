import { useState } from "react";
import { HABIT_ICON_KEYS, HabitIcon } from "../../utils/habitIcons";

const CATEGORIES = ["general", "health", "fitness", "learning", "mindfulness", "creativity"];

export default function HabitForm({ initial, submitting, onCancel, onSubmit }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "general");
  const [icon, setIcon] = useState(initial?.icon || HABIT_ICON_KEYS[0]);
  const [frequency, setFrequency] = useState(initial?.frequency || "daily");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      icon,
      frequency,
      targetDays: frequency === "daily" ? 7 : 3,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500"
          placeholder="Drink water"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500"
          placeholder="Optional"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0a0a0a]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="daily" className="bg-[#0a0a0a]">Daily</option>
            <option value="weekly" className="bg-[#0a0a0a]">A few times a week</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Icon</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICON_KEYS.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setIcon(key)}
              aria-label={key}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                icon === key ? "border-emerald-400 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >
              <HabitIcon icon={key} size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : initial ? "Save changes" : "Create habit"}
        </button>
      </div>
    </form>
  );
}
