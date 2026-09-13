import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-[#0a0a0a] border border-white/10 rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
