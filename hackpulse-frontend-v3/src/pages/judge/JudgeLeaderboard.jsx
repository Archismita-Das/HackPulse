import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Loader2 } from "lucide-react";
import { RankBadge, StatusBadge, PageHeader } from "../../components/shared";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";

export default function JudgeLeaderboard() {
  const [search, setSearch] = useState("");
  const { dark } = useTheme();
  const { leaderboard, loadingData } = useData();

  const filtered = leaderboard.filter(t =>
    t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
    t.projectTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Leaderboard" subtitle="Live rankings — updates as scores are submitted"/>

      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium ${dark?"bg-amber-500/10 border-amber-500/20 text-amber-300":"bg-amber-50 border-amber-200 text-amber-700"}`}>
        <Eye size={13}/> Judge view — read only. Scores update as submissions are evaluated.
      </motion.div>

      <div className="relative max-w-sm">
        <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams..."
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500":"bg-white border-slate-300 text-slate-900"}`}/>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-amber-500"/>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${dark?"border-white/[0.07]":"border-slate-100"}`}>
                  {["Rank","Team","Project","Members","Status","Score"].map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dark?"text-slate-400":"text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className={`text-center py-10 text-sm ${dark?"text-slate-500":"text-slate-400"}`}>No teams yet.</td></tr>
                ) : filtered.map((team,i) => (
                  <motion.tr key={`${team.rank}-${i}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className={`border-b transition-colors ${dark?"border-white/[0.04] hover:bg-white/[0.03]":"border-slate-50 hover:bg-slate-50"}`}>
                    <td className="px-4 py-3"><RankBadge rank={team.rank}/></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-xs font-bold text-amber-300">{team.teamName?.charAt(0)}</div>
                        <span className={`text-sm font-medium ${dark?"text-white":"text-slate-800"}`}>{team.teamName}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${dark?"text-slate-300":"text-slate-600"}`}>{team.projectTitle}</td>
                    <td className={`px-4 py-3 text-sm ${dark?"text-slate-400":"text-slate-500"}`}>{team.members}</td>
                    <td className="px-4 py-3"><StatusBadge status={team.status}/></td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${team.score > 0 ? "text-emerald-500" : dark?"text-slate-600":"text-slate-400"}`}>
                        {team.score > 0 ? team.score : "—"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
