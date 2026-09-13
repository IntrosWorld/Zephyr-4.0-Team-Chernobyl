const QUOTES = [
  "Small steps, every day, add up to big change.",
  "You don't have to be perfect, just consistent.",
  "Discipline is choosing between what you want now and what you want most.",
  "Progress, not perfection.",
  "The habit you keep today becomes the person you are tomorrow.",
  "Show up, especially when you don't feel like it.",
  "One habit at a time.",
];

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export default function MorningMotivation() {
  const quote = QUOTES[dayOfYear() % QUOTES.length];
  return <p className="text-sm text-[#7fae9f] italic">{quote}</p>;
}
