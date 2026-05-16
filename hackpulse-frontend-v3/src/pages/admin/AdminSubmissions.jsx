import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { StatusBadge, PageHeader } from "../../components/shared";
import Modal from "../../components/shared/Modal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { submissionApi } from "../../services/api";
import { mockSubmissions } from "../../services/mockData";

export default function AdminSubmissions() {
  const { dark } = useTheme();
  const { user }  = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scoreVal, setScoreVal]       = useState("");
  const [remarksVal, setRemarksVal]   = useState("");
  const [judgeVal, setJudgeVal]       = useState("");
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  const loadSubmissions = async () => {
    if (isDemoMode) { setSubmissions(mockSubmissions); setLoading(false); return; }
    try {
      const { data } = await submissionApi.getAll();
      setSubmissions(data);
    } catch { setSubmissions([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSubmissions(); }, []);

  const normalStatus = (s) => {
    if (!s) return "";
    return s.replace(/_/g," ");
  };

  const counts = {
    All: submissions.length,
    Evaluated: submissions.filter(s => normalStatus(s.status).toLowerCase().includes("evaluated")).length,
    Pending: submissions.filter(s => !normalStatus(s.status).toLowerCase().includes("evaluated")).length,
  };

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchQ = s.teamName?.toLowerCase().includes(q) || s.projectTitle?.toLowerCase().includes(q);
    if (filter === "All") return matchQ;
    if (filter === "Evaluated") return matchQ && normalStatus(s.status).toLowerCase().includes("evaluated");
    return matchQ && !normalStatus(s.status).toLowerCase().includes("evaluated");
  });

  const openEdit = (sub) => {
    setEditTarget(sub);
    setScoreVal(sub.score || "");
    setRemarksVal(sub.remarks || "");
    setJudgeVal(sub.judge || user?.name || "");
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!isDemoMode) {
        await submissionApi.score(editTarget.id, {
          score: Number(scoreVal),
          remarks: remarksVal,
          judgeName: judgeVal,
        });
        await loadSubmissions();
      } else {
        setSubmissions(prev => prev.map(s => s.id === editTarget.id
          ? { ...s, score: Number(scoreVal), remarks: remarksVal, judge: judgeVal, status: "Evaluated" } : s
        ));
      }
      setSaved(true);
      setTimeout(() => { setEditTarget(null); setSaved(false); }, 600);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!isDemoMode) { try { await submissionApi.getAll(); } catch {} }
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const inp = `w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/60":"bg-white border-slate-300 text-slate-900 focus:border-violet-400"}`;
  const lbl = `block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`;

  return (
    <div className="space-y-5">
      <PageHeader title="All Submissions" subtitle="Manage and score every project submission"/>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(counts).map(([label,count],i) => {
          const bgs = [dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200",
                       dark?"bg-emerald-500/5 border-emerald-500/15":"bg-emerald-50 border-emerald-200",
                       dark?"bg-amber-500/5 border-amber-500/15":"bg-amber-50 border-amber-200"];
          const txt = [dark?"text-white":"text-slate-800","text-emerald-500","text-amber-500"];
          return (
            <motion.button key={label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              onClick={() => setFilter(label)}
              className={`p-4 rounded-xl border text-left transition-all ${bgs[i]} ${filter===label?"ring-2 ring-violet-500/30":""}`}>
              <p className={`text-2xl font-bold tabular-nums ${txt[i]}`}>{count}</p>
              <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-500"}`}>{label}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search submissions..."
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500":"bg-white border-slate-300 text-slate-900"}`}/>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-500"/></div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${dark?"border-white/[0.07]":"border-slate-100"}`}>
                  {["Team","Project","Submitted","Judge","Status","Score","Actions"].map(h=>(
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dark?"text-slate-400":"text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className={`text-center py-10 text-sm ${dark?"text-slate-500":"text-slate-400"}`}>No submissions found.</td></tr>
                ) : filtered.map((sub,i) => (
                  <motion.tr key={sub.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className={`border-b transition-colors ${dark?"border-white/[0.04] hover:bg-white/[0.03]":"border-slate-50 hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center text-xs font-bold text-violet-300">{sub.teamName?.charAt(0)}</div>
                        <span className={`text-sm font-medium ${dark?"text-white":"text-slate-800"}`}>{sub.teamName}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${dark?"text-slate-300":"text-slate-600"}`}>{sub.projectTitle}</td>
                    <td className={`px-4 py-3 text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{sub.submittedAt}</td>
                    <td className={`px-4 py-3 text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{sub.judge || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={normalStatus(sub.status)}/></td>
                    <td className="px-4 py-3">
                      {sub.score != null && sub.score !== "" ? (
                        <div className="flex items-center gap-1.5">
                          <Star size={12} className="text-amber-400 fill-amber-400"/>
                          <span className={`text-sm font-bold ${dark?"text-white":"text-slate-800"}`}>{sub.score}</span>
                        </div>
                      ) : <span className={`text-xs ${dark?"text-slate-600":"text-slate-400"}`}>Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(sub)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-violet-500/15 text-violet-300 hover:bg-violet-500/25":"bg-violet-50 text-violet-600 hover:bg-violet-100"}`}>
                          <Edit2 size={11}/> Edit
                        </button>
                        <button onClick={() => setDeleteTarget(sub)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-red-500/10 text-red-400 hover:bg-red-500/20":"bg-red-50 text-red-500 hover:bg-red-100"}`}>
                          <Trash2 size={11}/> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)}
        title={`Score — ${editTarget?.teamName}`} subtitle={editTarget?.projectTitle}>
        <div className="space-y-4">
          <div className={`p-3 rounded-lg border ${dark?"bg-white/5 border-white/10":"bg-slate-50 border-slate-200"}`}>
            <p className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>Submitted: <span className="font-medium">{editTarget?.submittedAt}</span></p>
          </div>
          <div><label className={lbl}>Score (0–100)</label><input type="number" min="0" max="100" value={scoreVal} onChange={e=>setScoreVal(e.target.value)} placeholder="e.g. 88.5" className={inp}/></div>
          <div><label className={lbl}>Judge Name</label><input value={judgeVal} onChange={e=>setJudgeVal(e.target.value)} placeholder="Judge name" className={inp}/></div>
          <div><label className={lbl}>Remarks</label><textarea value={remarksVal} onChange={e=>setRemarksVal(e.target.value)} rows={3} placeholder="Evaluation feedback..." className={`${inp} resize-none`}/></div>
          <button onClick={handleSave} disabled={saving||saved||!scoreVal}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-violet-500/20 disabled:opacity-60 transition-all">
            {saving?<><Loader2 size={14} className="animate-spin"/>Saving...</>:saved?<><CheckCircle2 size={14}/>Saved!</>:"Save Score"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget.id)}
        title="Delete Submission?" message={`Remove the submission from ${deleteTarget?.teamName}? This cannot be undone.`}
        confirmLabel="Delete"/>
    </div>
  );
}
