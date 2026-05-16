import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ── StatCard ──────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, trend, trendValue, color = "violet", delay = 0 }) {
  const { dark } = useTheme();
  const colors = {
    violet:  { ring:"ring-violet-500/20",  icon:"text-violet-500",  bg: dark ? "bg-violet-500/10"  : "bg-violet-50"  },
    cyan:    { ring:"ring-cyan-500/20",    icon:"text-cyan-500",    bg: dark ? "bg-cyan-500/10"    : "bg-cyan-50"    },
    emerald: { ring:"ring-emerald-500/20", icon:"text-emerald-500", bg: dark ? "bg-emerald-500/10" : "bg-emerald-50" },
    amber:   { ring:"ring-amber-500/20",   icon:"text-amber-500",   bg: dark ? "bg-amber-500/10"   : "bg-amber-50"   },
  };
  const c = colors[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`p-5 rounded-xl border transition-all
        ${dark ? "bg-white/[0.03] border-white/[0.08] hover:border-white/15" : "bg-white border-slate-200 shadow-sm hover:shadow-md"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>{title}</p>
          <p className={`text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>
            {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
          </p>
          {trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-400"}`}>
              {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
    </motion.div>
  );
}

// ── RankBadge ─────────────────────────────────────────────────────────────
export function RankBadge({ rank }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-sm shadow-lg shadow-amber-500/30">🥇</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-sm shadow">🥈</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 text-sm shadow">🥉</span>;
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 font-medium text-sm border border-slate-500/20">
      {rank}
    </span>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const styles = {
    "Submitted":     "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
    "Under Review":  "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20",
    "Evaluated":     "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    "Disqualified":  "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles["Submitted"]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {status}
    </span>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  const { dark } = useTheme();
  return (
    <div className="flex items-start justify-between mb-2">
      <div>
        <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>{title}</h2>
        {subtitle && <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
