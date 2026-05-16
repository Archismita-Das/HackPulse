import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = "max-w-lg" }) {
  const { dark } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: "calc(100vw - 2rem)",
              maxWidth: "32rem",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "1rem",
              border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
              background: dark ? "#0d1117" : "#ffffff",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            {/* Header — fixed, never scrolls away */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "1rem 1.5rem",
              borderBottom: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid #f1f5f9",
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                  {title}
                </h3>
                {subtitle && (
                  <p style={{ fontSize: "0.75rem", color: dark ? "#64748b" : "#94a3b8", marginTop: "0.2rem" }}>
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "0.35rem", borderRadius: "0.5rem",
                  border: "none", background: "transparent",
                  cursor: "pointer", color: dark ? "#64748b" : "#94a3b8",
                  marginLeft: "1rem", flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body — scrolls when content overflows */}
            <div style={{
              flex: "1 1 0",
              minHeight: 0,
              overflowY: "auto",
              padding: "1.25rem 1.5rem",
            }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}