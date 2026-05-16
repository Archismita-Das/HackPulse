import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Github, ExternalLink, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { PageHeader } from "../../components/shared";
import { userApi, submissionApi } from "../../services/api";
import { myTeamData } from "../../services/mockData";

export default function ParticipantSubmit() {
  const { dark }  = useTheme();

  const [myTeam, setMyTeam]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ githubUrl: "", demoUrl: "", description: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const init = async () => {
      if (isDemoMode) {
        setMyTeam(myTeamData);
        setForm({
          githubUrl:   myTeamData.githubUrl,
          demoUrl:     myTeamData.demoUrl,
          description: myTeamData.description,
          notes: "",
        });
        setSubmitted(myTeamData.submissionStatus === "Evaluated");
        setLoading(false);
        return;
      }
      try {
        const { data: team } = await userApi.getMyTeam();
        if (!team || team.message) { setLoading(false); return; }
        setMyTeam(team);
        setForm({
          githubUrl:   team.githubUrl || "",
          demoUrl:     team.demoUrl   || "",
          description: team.description || "",
          notes: "",
        });
        setSubmitted(
          team.submissionStatus === "Evaluated" ||
          team.submissionStatus === "EVALUATED" ||
          team.submissionStatus === "Under Review" ||
          team.submissionStatus === "UNDER_REVIEW"
        );
      } catch {
        setMyTeam(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!myTeam) return;
    setSubmitting(true);
    try {
      if (!isDemoMode) {
        await submissionApi.submit(myTeam.id, {
          githubUrl:   form.githubUrl,
          demoUrl:     form.demoUrl,
          description: form.description,
          notes:       form.notes,
        });
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const inp = `w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-emerald-500/60":"bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-400"}`;
  const lbl = `block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-emerald-500"/>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="max-w-xl space-y-5">
        <PageHeader title="Submit Project" subtitle="Your project submission"/>
        <div className={`p-8 rounded-xl border text-center ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <Upload size={40} className={`mx-auto mb-3 ${dark?"text-slate-500":"text-slate-300"}`}/>
          <p className={`text-sm font-medium ${dark?"text-slate-300":"text-slate-600"}`}>You need to be part of a team before submitting.</p>
          <p className={`text-xs mt-1 ${dark?"text-slate-500":"text-slate-400"}`}>Contact your hackathon administrator.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl space-y-5">
        <PageHeader title="Submit Project" subtitle="Your project submission"/>
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
          className={`p-8 rounded-xl border text-center ${dark?"bg-emerald-500/10 border-emerald-500/20":"bg-emerald-50 border-emerald-200"}`}>
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4"/>
          <h3 className={`text-lg font-bold mb-2 ${dark?"text-white":"text-slate-900"}`}>Project Submitted!</h3>
          <p className={`text-sm mb-4 ${dark?"text-slate-400":"text-slate-500"}`}>
            Your project <span className="font-semibold">{myTeam.projectTitle}</span> has been submitted and is currently{" "}
            <span className="font-semibold text-emerald-500">{myTeam.submissionStatus || "Under Review"}</span>.
          </p>
          {myTeam.remarks && (
            <div className={`p-3 rounded-lg text-left border mb-4 ${dark?"bg-white/5 border-white/10":"bg-white border-slate-200"}`}>
              <p className={`text-xs mb-1 ${dark?"text-slate-500":"text-slate-400"}`}>Judge Feedback:</p>
              <p className={`text-sm italic ${dark?"text-slate-300":"text-slate-600"}`}>"{myTeam.remarks}"</p>
            </div>
          )}
          <button onClick={() => setSubmitted(false)} className={`text-sm underline ${dark?"text-emerald-400":"text-emerald-600"}`}>
            Update submission
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-5">
      <PageHeader title="Submit Project" subtitle="Submit your project for evaluation"/>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>

        <div className={`flex items-center gap-3 p-3 rounded-lg border mb-5 ${dark?"bg-emerald-500/5 border-emerald-500/20":"bg-emerald-50 border-emerald-200"}`}>
          <Upload size={16} className="text-emerald-500 flex-shrink-0"/>
          <div>
            <p className={`text-sm font-semibold ${dark?"text-emerald-300":"text-emerald-700"}`}>Submitting as: {myTeam.teamName}</p>
            <p className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>Project: {myTeam.projectTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={lbl}><Github size={12} className="inline mr-1"/>GitHub Repository URL</label>
            <input name="githubUrl" value={form.githubUrl} onChange={handleChange}
              placeholder="https://github.com/your-team/project" className={inp} required/>
          </div>
          <div>
            <label className={lbl}><ExternalLink size={12} className="inline mr-1"/>Live Demo URL</label>
            <input name="demoUrl" value={form.demoUrl} onChange={handleChange}
              placeholder="https://your-demo.vercel.app" className={inp}/>
          </div>
          <div>
            <label className={lbl}><FileText size={12} className="inline mr-1"/>Project Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Describe your project briefly..." required className={`${inp} resize-none`}/>
          </div>
          <div>
            <label className={lbl}>Additional Notes for Judges (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              placeholder="Any special instructions or highlights..." className={`${inp} resize-none`}/>
          </div>
          <motion.button type="submit" disabled={submitting}
            whileHover={{scale:1.01}} whileTap={{scale:0.99}}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-60 transition-all">
            {submitting ? <><Loader2 size={15} className="animate-spin"/>Submitting...</> : <><Upload size={15}/>Submit Project</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
