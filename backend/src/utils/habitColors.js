// Mirrors frontend/src/utils/habitColors.js — kept as plain data on both
// sides rather than shared over the wire, since it rarely changes.
const HABIT_COLORS = [
  "#1a9bab", // teal
  "#e0554f", // red
  "#3b6fd6", // blue
  "#8b5cf6", // purple
  "#d6479a", // pink
  "#e8934a", // orange
  "#189c6b", // green
  "#c9a227", // gold
];

function colorForIndex(index) {
  return HABIT_COLORS[index % HABIT_COLORS.length];
}

module.exports = { HABIT_COLORS, colorForIndex };
