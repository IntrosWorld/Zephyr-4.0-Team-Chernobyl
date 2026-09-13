function levelClass(count, max) {
  if (!count) return "bg-white/5";
  const ratio = count / Math.max(1, max);
  if (ratio < 0.25) return "bg-emerald-500/25";
  if (ratio < 0.5) return "bg-emerald-500/50";
  if (ratio < 0.85) return "bg-emerald-500/75";
  return "bg-emerald-500";
}

export default function HeatmapChart({ data = [] }) {
  const max = data.reduce((m, d) => Math.max(m, d.count), 0);
  const total = data.reduce((s, d) => s + d.count, 0);

  const cols = [];
  let col = [];
  data.forEach((d, i) => {
    const dayOfWeek = (new Date(d.date).getDay() + 6) % 7; // 0 = Monday
    if (i === 0) {
      for (let j = 0; j < dayOfWeek; j++) col.push(null);
    }
    col.push(d);
    if (dayOfWeek === 6) {
      cols.push(col);
      col = [];
    }
  });
  if (col.length) {
    while (col.length < 7) col.push(null);
    cols.push(col);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-full">
      <div className="text-sm font-medium mb-1">Consistency</div>
      <div className="text-xs text-gray-400 mb-4">{total} completions in the last 90 days</div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {cols.map((c, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {c.map((d, ri) =>
                d ? (
                  <div
                    key={ri}
                    className={`w-3.5 h-3.5 rounded-sm ${levelClass(d.count, max)}`}
                    title={`${d.date} — ${d.count} completion${d.count === 1 ? "" : "s"}`}
                  />
                ) : (
                  <div key={ri} className="w-3.5 h-3.5" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
