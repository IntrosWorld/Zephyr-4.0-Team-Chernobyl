export default function LoadingSpinner({ full }) {
  const spinner = <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />;

  if (!full) return spinner;

  return <div className="min-h-screen flex items-center justify-center bg-black">{spinner}</div>;
}
