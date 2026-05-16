import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit2, Trash2, Trophy, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Loader2 } from "lucide-react";
import { RankBadge, StatusBadge, PageHeader } from "../../components/shared";
import Modal from "../../components/shared/Modal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { submissionApi } from "../../services/api";

export default function AdminLeaderboard() {
  const { dark } = useTheme();
  const { leaderboard, updateLeaderboardScore, deleteTeam } = useData();
  const [search, setSearch]         = useState("");
  const [sortKey, setSortKey]       = useState("rank");
  const [sortDir, setSortDir]       = useState("asc");
  const [editTarget, setEditTarget] = useState(null);
  const [editScore, setEditScore]   = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = [...leaderboard]
    .filter(t => t.teamName?.toLowerCase().includes(search.toLowerCase()) || t.projectTitle?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const openEdit = (team) => {
    setEditTarget(team);
    setEditScore(team.score || "");
    setEditRemarks("");
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!isDemoMode) {
        // Find submission by teamName and score it via API
        // This updates score on the backend; leaderboard will re-sort on next load
        // For now, optimistic update works for the admin view
      }
      updateLeaderboardScore(editTarget.teamName, editScore, editRemarks);
      setSaved(true);
      setTimeout(() => { setEditTarget(null); setSaved(false); }, 700);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const SortIcon = ({ col }) => sortKey !== col
    ? <ArrowUpDown size={12} className="text-slate-500"/>
    : sortDir === "asc" ? <ArrowUp size={12} className="text-violet-400"/> : <ArrowDown size={12} className="text-violet-400"/>;

  const inp = `w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/60":"bg-white border-slate-300 text-slate-900 focus:border-violet-400"}`;
  const lbl = `block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`;

  return (
    <div className="space-y-5">
      <PageHeader title="Leaderboard" subtitle="Manage scores and team rankings"/>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500":"bg-white border-slate-300 text-slate-900"}`}/>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${dark?"bg-white/5 border-white/10 text-slate-400":"bg-slate-50 border-slate-200 text-slate-500"}`}>
          <Trophy size={12}/> {leaderboard.length} teams ranked
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${dark?"border-white/[0.07]":"border-slate-100"}`}>
                {[["rank","Rank"],["teamName","Team"],["projectTitle","Project"],["members","Members"],["status","Status"],["score","Score"]].map(([key,label])=>(
                  <th key={key} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none ${dark?"text-slate-400 hover:text-slate-200":"text-slate-500 hover:text-slate-700"}`}
                    onClick={() => handleSort(key)}>
                    <div className="flex items-center gap-1.5">{label}<SortIcon col={key}/></div>
                  </th>
                ))}
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dark?"text-slate-400":"text-slate-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-10 text-sm ${dark?"text-slate-500":"text-slate-400"}`}>No teams found.</td></tr>
              ) : filtered.map((team,i) => (
                <motion.tr key={`${team.rank}-${i}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className={`border-b transition-colors ${dark?"border-white/[0.04] hover:bg-white/[0.03]":"border-slate-50 hover:bg-slate-50"}`}>
                  <td className="px-4 py-3"><RankBadge rank={team.rank}/></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center text-xs font-bold text-violet-300">{team.teamName?.charAt(0)}</div>
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
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(team)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-violet-500/15 text-violet-300 hover:bg-violet-500/25":"bg-violet-50 text-violet-600 hover:bg-violet-100"}`}>
                        <Edit2 size={11}/> Edit
                      </button>
                      <button onClick={() => setDeleteTarget(team)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-red-500/10 text-red-400 hover:bg-red-500/20":"bg-red-50 text-red-500 hover:bg-red-100"}`}>
                        <Trash2 size={11}/> Remove
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)}
        title={`Edit Score — ${editTarget?.teamName}`} subtitle={editTarget?.projectTitle}>
        <div className="space-y-4">
          <div><label className={lbl}>Score (0–100)</label>
            <input type="number" min="0" max="100" step="0.5" value={editScore}
              onChange={e => setEditScore(e.target.value)} placeholder="e.g. 88.5" className={inp}/></div>
          <div><label className={lbl}>Remarks (optional)</label>
            <textarea value={editRemarks} onChange={e => setEditRemarks(e.target.value)} rows={2}
              placeholder="Update remarks..." className={`${inp} resize-none`}/></div>
          <button onClick={handleSave} disabled={saving||saved||!editScore}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-violet-500/20 disabled:opacity-60 transition-all">
            {saving?<><Loader2 size={14} className="animate-spin"/>Saving...</>:saved?<><CheckCircle2 size={14}/>Saved!</>:"Save Score"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteTeam(deleteTarget?.id); }}
        title="Remove Team?" message={`Remove ${deleteTarget?.teamName} from the leaderboard? This cannot be undone.`}
        confirmLabel="Remove"/>
    </div>
  );
}
