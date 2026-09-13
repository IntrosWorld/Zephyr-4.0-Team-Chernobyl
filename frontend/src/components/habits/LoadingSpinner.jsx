import Mascot from "./Mascot";

export default function LoadingSpinner({ full }) {
  const spinner = <div className="w-6 h-6 border-2 border-[#8fcdb5] border-t-transparent rounded-full animate-spin" />;

  if (!full) return spinner;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#04120f]">
      <Mascot pose="sleep" size={96} />
      {spinner}
    </div>
  );
}
