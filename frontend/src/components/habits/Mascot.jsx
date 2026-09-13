const POSES = ["wave", "walk", "run", "celebrate", "angry", "cry", "gasp", "eat", "sleep", "sing", "read", "play"];

// Only categories with a pose that actually fits get one — everything else
// (mindfulness, general, anything unrecognized) falls back to "celebrate".
const CATEGORY_POSES = {
  fitness: "run",
  learning: "read",
  health: "eat",
  creativity: "sing",
};

export function celebrationPoseForCategory(category) {
  return CATEGORY_POSES[category] || "celebrate";
}

export default function Mascot({ pose = "wave", size = 48, className = "" }) {
  if (!POSES.includes(pose)) pose = "wave";
  return (
    <img
      src={`/mascot/${pose}.png`}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: "auto" }}
    />
  );
}
