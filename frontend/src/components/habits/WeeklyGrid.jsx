import { Check } from "lucide-react";
import { weekKeys } from "../../utils/dateHelpers";

export default function WeeklyGrid({ habits, logsByHabit }) {
  const days = weekKeys();

  if (!habits.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full flex items-center justify-center text-sm text-gray-500">
        Add a habit to see your week.
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 overflow-x-auto">
      <div className="text-sm font-medium mb-4">This week</div>
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left font-normal text-gray-400 pb-2">Habit</th>
            {days.map((d) => (
              <th key={d.key} className="font-normal text-gray-400 pb-2 w-10 text-center">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const done = new Set(logsByHabit[h.id] || []);
            return (
              <tr key={h.id} className="border-t border-white/5">
                <td className="py-2.5 truncate max-w-[140px]">{h.name}</td>
                {days.map((d) => (
                  <td key={d.key} className="text-center">
                    <div
                      className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center ${
                        done.has(d.key) ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-transparent"
                      }`}
                    >
                      <Check size={13} />
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
