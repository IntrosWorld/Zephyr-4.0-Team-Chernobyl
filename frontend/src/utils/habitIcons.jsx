import { Sparkles, Dumbbell, BookOpen, Droplet, Wind, Footprints, Target, Leaf, Palette, Moon } from "lucide-react";

export const HABIT_ICONS = {
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  droplet: Droplet,
  wind: Wind,
  footprints: Footprints,
  target: Target,
  leaf: Leaf,
  palette: Palette,
  moon: Moon,
};

export const HABIT_ICON_KEYS = Object.keys(HABIT_ICONS);

export function HabitIcon({ icon, size = 18, className }) {
  const Icon = HABIT_ICONS[icon] || Sparkles;
  return <Icon size={size} className={className} />;
}
