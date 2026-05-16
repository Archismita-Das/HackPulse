import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", danger = true }) {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4
              p-6 rounded-2xl border shadow-2xl
              ${dark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-500/10" : "bg-amber-500/10"}`}>
              <AlertTriangle size={22} className={danger ? "text-red-400" : "text-amber-400"} />
            </div>
            <h3 className={`text-base font-bold text-center mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
            <p className={`text-sm text-center mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>{message}</p>
            <div className="flex gap-3">
              <button onClick={onClose}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all
                  ${dark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2
                  ${danger ? "bg-red-500 hover:bg-red-400" : "bg-amber-500 hover:bg-amber-400"} disabled:opacity-60`}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
