import confetti from "canvas-confetti";

export function celebrate() {
  confetti({
    particleCount: 60,
    spread: 60,
    startVelocity: 35,
    origin: { y: 0.7 },
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
