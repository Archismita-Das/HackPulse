import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, Loader2, Github, ExternalLink, X, Code2, Users, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { StatusBadge, PageHeader } from "../../components/shared";
import { submissionApi } from "../../services/api";
import { mockSubmissions } from "../../services/mockData";

export default function JudgeSubmissions() {
  const { dark }  = useTheme();
  const { user }  = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [expanded, setExpanded]       = useState(null);
  const [scoreForm, setScoreForm]     = useState({ score: "", remarks: "" });
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  const fetchAssigned = async () => {
    if (isDemoMode) {
      setSubmissions(mockSubmissions.slice(0, 5));
      setLoading(false);
      return;
    }
    try {
      const { data } = await submissionApi.getMyAssignments();
      setSubmissions(data);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssigned(); }, []);

  const openScore = (sub) => {
    setSelected(sub);
    setScoreForm({ score: sub.score || "", remarks: sub.remarks || "" });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!scoreForm.score) return;
    setSaving(true);
    try {
      if (!isDemoMode) {
        await submissionApi.score(selected.id, {
          score: Number(scoreForm.score),
          remarks: scoreForm.remarks,
          judgeName: user?.name || "",
        });
        // Re-fetch to get fresh data
        await fetchAssigned();
      } else {
        // Demo: update locally
        setSubmissions(prev =>
          prev.map(s => s.id === selected.id
            ? { ...s, score: Number(scoreForm.score), remarks: scoreForm.remarks, status: "Evaluated" }
            : s
          )
        );
      }
      setSaved(true);
      setTimeout(() => { setSelected(null); setSaved(false); }, 700);
    } catch (err) {
      console.error("Scoring failed", err);
    } finally {
      setSaving(false);
    }
  };

  const inp = `w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-amber-500/60":"bg-white border-slate-300 text-slate-900 focus:border-amber-400"}`;

  return (
    <div className="space-y-5">
      <PageHeader title="Score Submissions" subtitle="Review each project fully before scoring"/>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-amber-500"/>
        </div>
      ) : submissions.length === 0 ? (
        <div className={`text-center py-16 text-sm ${dark?"text-slate-500":"text-slate-400"}`}>
          No submissions assigned to you yet.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, i) => {
            const isExpanded = expanded === sub.id;
            return (
              <motion.div key={sub.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                className={`rounded-xl border overflow-hidden transition-all ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base font-bold text-white flex-shrink-0 shadow-lg shadow-amber-500/20">
                    {sub.teamName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`text-sm font-bold ${dark?"text-white":"text-slate-800"}`}>{sub.teamName}</h3>
                      <StatusBadge status={sub.status}/>
                    </div>
                    <p className={`text-xs font-semibold mb-1 ${dark?"text-amber-300":"text-amber-600"}`}>{sub.projectTitle}</p>
                    <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>Submitted: {sub.submittedAt}</p>
                    {sub.remarks && (sub.status === "EVALUATED" || sub.status === "Evaluated") && (
                      <p className={`text-xs italic mt-1.5 ${dark?"text-slate-400":"text-slate-500"}`}>Your remark: "{sub.remarks}"</p>
                    )}
                  </div>

                  {/* Right: score + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {sub.score ? (
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-amber-400 fill-amber-400"/>
                        <span className={`text-xl font-bold ${dark?"text-white":"text-slate-900"}`}>{sub.score}</span>
                        <span className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>/ 100</span>
                      </div>
                    ) : (
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${dark?"bg-amber-500/10 text-amber-400":"bg-amber-50 text-amber-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/> Awaiting score
                      </span>
                    )}
                    <div className="flex gap-2">
                      {/* Only show expand if we have project details */}
                      {(sub.description || sub.techStack?.length > 0 || sub.members?.length > 0) && (
                        <button onClick={() => setExpanded(isExpanded ? null : sub.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark?"border-white/10 text-slate-300 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                          <Eye size={12}/> {isExpanded ? "Hide" : "View Project"}
                          {isExpanded ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                        </button>
                      )}
                      <button onClick={() => openScore(sub)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${dark?"bg-amber-500/20 text-amber-300 hover:bg-amber-500/30":"bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                        <Star size={12}/> {sub.score ? "Re-score" : "Score Now"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Project Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:0.25}} className="overflow-hidden">
                      <div className={`px-5 pb-5 border-t ${dark?"border-white/[0.06]":"border-slate-100"}`}>
                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Description */}
                          <div className={`p-4 rounded-xl border ${dark?"bg-white/[0.02] border-white/[0.06]":"bg-slate-50 border-slate-200"}`}>
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark?"text-slate-400":"text-slate-500"}`}>Project Description</h4>
                            <p className={`text-sm leading-relaxed ${dark?"text-slate-300":"text-slate-600"}`}>
                              {sub.description || "No description provided."}
                            </p>
                            <div className="flex gap-2 mt-3">
                              {sub.githubUrl && (
                                <a href={sub.githubUrl} target="_blank" rel="noreferrer"
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark?"bg-white/5 border-white/10 text-slate-300 hover:bg-white/10":"bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                                  <Github size={12}/> GitHub Repo
                                </a>
                              )}
                              {sub.demoUrl && (
                                <a href={sub.demoUrl} target="_blank" rel="noreferrer"
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark?"bg-amber-500/15 border-amber-500/25 text-amber-300":"bg-amber-50 border-amber-200 text-amber-700"}`}>
                                  <ExternalLink size={12}/> Live Demo
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Tech Stack + Members */}
                          <div className="space-y-3">
                            {sub.techStack?.length > 0 && (
                              <div className={`p-4 rounded-xl border ${dark?"bg-white/[0.02] border-white/[0.06]":"bg-slate-50 border-slate-200"}`}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${dark?"text-slate-400":"text-slate-500"}`}>
                                  <Code2 size={11}/> Tech Stack
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {sub.techStack.map(t => (
                                    <span key={t} className={`px-2 py-0.5 text-xs rounded-md border ${dark?"bg-amber-500/10 border-amber-500/20 text-amber-300":"bg-amber-50 border-amber-200 text-amber-700"}`}>{t}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {sub.members?.length > 0 && (
                              <div className={`p-4 rounded-xl border ${dark?"bg-white/[0.02] border-white/[0.06]":"bg-slate-50 border-slate-200"}`}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${dark?"text-slate-400":"text-slate-500"}`}>
                                  <Users size={11}/> Team Members
                                </h4>
                                <div className="space-y-1.5">
                                  {sub.members.map(m => (
                                    <div key={m.name} className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                                        {m.avatar || m.name?.charAt(0)}
                                      </div>
                                      <span className={`text-xs ${dark?"text-slate-300":"text-slate-600"}`}>{m.name}</span>
                                      <span className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>· {m.role}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Score Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSelected(null)}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 p-6 rounded-2xl border shadow-2xl ${dark?"bg-[#0d1117] border-white/10":"bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-base font-bold ${dark?"text-white":"text-slate-900"}`}>Score Submission</h3>
                  <p className={`text-xs mt-0.5 ${dark?"text-slate-400":"text-slate-500"}`}>{selected.teamName} · {selected.projectTitle}</p>
                </div>
                <button onClick={() => setSelected(null)} className={`p-1.5 rounded-lg ${dark?"text-slate-400 hover:text-white hover:bg-white/10":"text-slate-400 hover:text-slate-700"}`}>
                  <X size={16}/>
                </button>
              </div>

              {/* Criteria guide */}
              <div className={`p-3 rounded-lg border text-xs mb-4 ${dark?"bg-white/[0.03] border-white/[0.06]":"bg-slate-50 border-slate-200"}`}>
                <p className={`font-semibold mb-1 ${dark?"text-slate-300":"text-slate-700"}`}>Scoring Criteria (out of 100):</p>
                <div className="grid grid-cols-2 gap-1">
                  {[["Innovation","30 pts"],["Technical Quality","30 pts"],["Impact & Usefulness","25 pts"],["Presentation","15 pts"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between">
                      <span className={dark?"text-slate-400":"text-slate-500"}>{k}</span>
                      <span className={`font-medium ${dark?"text-amber-300":"text-amber-600"}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`}>Final Score (0–100)</label>
                  <input type="number" min="0" max="100" step="0.5" value={scoreForm.score}
                    onChange={e => setScoreForm(f => ({...f, score: e.target.value}))}
                    placeholder="e.g. 87.5" className={inp}/>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`}>Remarks for Team</label>
                  <textarea value={scoreForm.remarks} rows={3}
                    onChange={e => setScoreForm(f => ({...f, remarks: e.target.value}))}
                    placeholder="Constructive feedback visible to the team..."
                    className={`${inp} resize-none`}/>
                </div>
                <motion.button onClick={handleSave} disabled={saving || saved || !scoreForm.score}
                  whileHover={{scale:1.01}} whileTap={{scale:0.99}}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/20 disabled:opacity-60 transition-all">
                  {saving ? <><Loader2 size={15} className="animate-spin"/>Saving...</>
                    : saved ? <><CheckCircle2 size={15}/>Score Submitted!</>
                    : <><Star size={15}/>Submit Score</>}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
