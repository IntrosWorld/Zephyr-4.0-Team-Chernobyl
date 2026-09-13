import confetti from "canvas-confetti";

const BRAND_COLORS = ["#159c86", "#e8934a", "#c9a227", "#e0554f"];

export function celebrate() {
  confetti({
    particleCount: 60,
    spread: 60,
    startVelocity: 35,
    origin: { y: 0.7 },
  });
}

// Streak milestones (3, 7, 14 days, ...) and level-ups — a distinct
// brand-colored burst so they read as a bigger deal than a normal completion.
export function celebrateMilestone() {
  confetti({
    particleCount: 100,
    spread: 80,
    startVelocity: 40,
    colors: BRAND_COLORS,
    origin: { y: 0.6 },
  });
}

export function celebrateBig() {
  confetti({
    particleCount: 150,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.6 },
  });
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 120,
      startVelocity: 35,
      origin: { y: 0.6 },
    });
  }, 200);
}
