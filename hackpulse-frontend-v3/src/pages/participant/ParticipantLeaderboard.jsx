import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Loader2 } from "lucide-react";
import { RankBadge, StatusBadge, PageHeader } from "../../components/shared";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { userApi, leaderboardApi } from "../../services/api";

export default function ParticipantLeaderboard() {
  const [search, setSearch]         = useState("");
  const { dark }                    = useTheme();
  const { user }                    = useAuth();
  const { leaderboard, loadingData } = useData();

  const [myTeam, setMyTeam]         = useState(null);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  // Fetch the logged-in participant's own team for the highlight banner
  useEffect(() => {
    const fetchMyTeam = async () => {
      if (isDemoMode) {
        // Demo: show as if participant belongs to team 1 (rank 1 in mock data)
        setMyTeam({ teamName: "Neural Ninjas", rank: 1, score: 96.5 });
        return;
      }
      try {
        const { data } = await userApi.getMyTeam();
        if (data && !data.message) setMyTeam(data);
      } catch {
        setMyTeam(null);
      }
    };
    fetchMyTeam();
  }, []);

  const filtered = leaderboard.filter(t =>
    t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
    t.projectTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Leaderboard" subtitle="Current hackathon rankings"/>

      {/* My team banner */}
      {myTeam && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
          className={`flex items-center gap-4 p-4 rounded-xl border ${dark?"bg-emerald-500/10 border-emerald-500/25":"bg-emerald-50 border-emerald-200"}`}>
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <p className={`text-sm font-bold ${dark?"text-emerald-300":"text-emerald-700"}`}>
              Your team is ranked #{myTeam.rank || "—"}!
            </p>
            <p className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>
              {myTeam.teamName} · {myTeam.score || 0} points
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <Eye size={12}/> View only
          </div>
        </motion.div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..."
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500":"bg-white border-slate-300 text-slate-900"}`}/>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-emerald-500"/>
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
                  <tr><td colSpan={6} className={`text-center py-10 text-sm ${dark?"text-slate-500":"text-slate-400"}`}>No teams found.</td></tr>
                ) : filtered.map((team, i) => {
                  const isMyTeam = myTeam && team.teamName === myTeam.teamName;
                  return (
                    <tr key={`${team.rank}-${i}`} className={`border-b transition-colors ${
                      isMyTeam
                        ? dark ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50"
                        : dark ? "border-white/[0.04] hover:bg-white/[0.03]" : "border-slate-50 hover:bg-slate-50"
                    }`}>
                      <td className="px-4 py-3"><RankBadge rank={team.rank}/></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isMyTeam?"bg-gradient-to-br from-emerald-400 to-cyan-500":"bg-gradient-to-br from-slate-400 to-slate-600"}`}>
                            {team.teamName?.charAt(0)}
                          </div>
                          <span className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>{team.teamName}</span>
                          {isMyTeam && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">You</span>}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${dark?"text-slate-300":"text-slate-600"}`}>{team.projectTitle}</td>
                      <td className={`px-4 py-3 text-sm ${dark?"text-slate-400":"text-slate-500"}`}>{team.members}</td>
                      <td className="px-4 py-3"><StatusBadge status={team.status}/></td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${team.score > 0 ? "text-emerald-500" : dark?"text-slate-500":"text-slate-400"}`}>
                          {team.score > 0 ? team.score : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
