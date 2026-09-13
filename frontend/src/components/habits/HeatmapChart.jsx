// Teal ramp from the light card surface up to the deep brand teal,
// so a busier day reads as a richer shade rather than a different hue.
const HEAT_LEVELS = ["#bfe8d8", "#a3ddc9", "#5cc2a3", "#159c86", "#0d6b5a"];

function levelColor(count, max) {
  if (!count) return HEAT_LEVELS[0];
  const ratio = count / Math.max(1, max);
  if (ratio < 0.25) return HEAT_LEVELS[1];
  if (ratio < 0.5) return HEAT_LEVELS[2];
  if (ratio < 0.85) return HEAT_LEVELS[3];
  return HEAT_LEVELS[4];
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
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-5">
      <div className="text-sm font-medium text-[#0d2b24] mb-1">Consistency</div>
      <div className="text-xs text-[#6b9285] mb-4">{total} completions in the last 90 days</div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {cols.map((c, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {c.map((d, ri) =>
                d ? (
                  <div
                    key={ri}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ background: levelColor(d.count, max) }}
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

      <div className="flex items-center gap-1.5 text-xs text-[#a3c7bb] mt-3">
        Less
        {HEAT_LEVELS.map((c) => (
          <span key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        More
      </div>
    </div>
  );
}
