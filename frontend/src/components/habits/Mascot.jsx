const POSES = ["wave", "walk", "run", "celebrate", "angry", "cry", "gasp", "eat", "sleep", "sing", "read", "play"];

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
