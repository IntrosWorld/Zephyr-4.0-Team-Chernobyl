// Distinct per-habit accent colors for the weekly calendar and habit rows.
export const HABIT_COLORS = [
  "#1a9bab", // teal
  "#e0554f", // red
  "#3b6fd6", // blue
  "#8b5cf6", // purple
  "#d6479a", // pink
  "#e8934a", // orange
  "#189c6b", // green
  "#c9a227", // gold
];

export function colorForIndex(index) {
  return HABIT_COLORS[index % HABIT_COLORS.length];
}
