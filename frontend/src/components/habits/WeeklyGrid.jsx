import { Check } from "lucide-react";
import { weekKeys } from "../../utils/dateHelpers";

export default function WeeklyGrid({ habits, logsByHabit }) {
  const days = weekKeys();

  if (!habits.length) {
    return (
      <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-6 flex items-center justify-center text-sm text-[#6b9285]">
        Add a habit to see your week.
      </div>
    );
  }

  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-5 overflow-x-auto">
      <div className="text-sm font-medium text-[#0d2b24] mb-4">This week</div>
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left font-normal text-[#6b9285] pb-2">Habit</th>
            {days.map((d) => (
              <th key={d.key} className="font-normal text-[#6b9285] pb-2 w-10 text-center">
                <div>{d.label}</div>
                <div className="text-[#a3c7bb]">{d.dayOfMonth}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const done = new Set(logsByHabit[h.id] || []);
            const color = h.color || "#159c86";
            return (
              <tr key={h.id} className="border-t border-[#bfe8d8]">
                <td className="py-2.5 truncate max-w-[140px] text-[#0d2b24]">{h.name}</td>
                {days.map((d) => {
                  const isDone = done.has(d.key);
                  return (
                    <td key={d.key} className="text-center py-1">
                      <div
                        className="w-7 h-7 mx-auto rounded-lg flex items-center justify-center text-black"
                        style={{ background: isDone ? color : "#bfe8d8" }}
                      >
                        {isDone && <Check size={14} />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
