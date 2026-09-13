import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto bg-[#c9ede0] border border-[#9ed9c4] rounded-2xl p-6 text-[#0d2b24]`}
      >
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#c9ede0]">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-[#527d71] hover:text-[#0d2b24] hover:bg-[#bfe8d8]"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
