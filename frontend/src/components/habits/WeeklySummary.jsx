export default function WeeklySummary({ weekRate, activeStreaks, totalHabits }) {
  if (!totalHabits) return null;

  let message;
  if (weekRate >= 80) message = "Strong week — you're keeping up with almost everything.";
  else if (weekRate >= 50) message = "Solid week overall, with room to close a few gaps.";
  else if (weekRate > 0) message = "A quieter week. Picking one habit to focus on can help.";
  else message = "No completions logged yet this week — today's a good day to start.";

  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-5">
      <div className="text-sm font-medium text-[#0d2b24] mb-1">This week's summary</div>
      <p className="text-sm text-[#3f6359]">
        {message} You completed {weekRate}% of your habits across {activeStreaks} active streak
        {activeStreaks === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
