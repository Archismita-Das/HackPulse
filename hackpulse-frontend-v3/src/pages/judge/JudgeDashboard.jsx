import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, Star, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { submissionApi } from "../../services/api";
import { mockSubmissions } from "../../services/mockData";
import { StatusBadge } from "../../components/shared";

export default function JudgeDashboard() {
  const { user } = useAuth();
  const { dark }  = useTheme();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const fetchAssigned = async () => {
      if (isDemoMode) {
        // Demo: show a subset of mock submissions as "assigned"
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
    fetchAssigned();
  }, []);

  const evaluated = submissions.filter(s => s.status === "EVALUATED" || s.status === "Evaluated");
  const pending   = submissions.filter(s => s.status !== "EVALUATED" && s.status !== "Evaluated");
  const avgScore  = evaluated.length
    ? (evaluated.reduce((a,b) => a + (Number(b.score)||0), 0) / evaluated.length).toFixed(1)
    : "—";

  const cards = [
    { label:"Assigned",  value:submissions.length, color:"amber",   icon:FileText     },
    { label:"Evaluated", value:evaluated.length,   color:"emerald", icon:CheckCircle2 },
    { label:"Pending",   value:pending.length,     color:"orange",  icon:Clock        },
    { label:"Avg Score", value:avgScore,            color:"cyan",    icon:Star         },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className={`p-5 rounded-xl border bg-gradient-to-br ${dark?"from-amber-500/10 to-orange-500/5 border-amber-500/20":"from-amber-50 to-orange-50 border-amber-200"}`}>
        <h2 className={`text-xl font-bold mb-1 ${dark?"text-white":"text-slate-900"}`} style={{fontFamily:"'Syne',sans-serif"}}>
          Judge Dashboard
        </h2>
        <p className={`text-sm ${dark?"text-slate-400":"text-slate-600"}`}>
          Welcome, <span className={`font-semibold ${dark?"text-amber-300":"text-amber-700"}`}>{user?.name || "Judge"}</span>.{" "}
          {loading
            ? "Loading your assignments..."
            : pending.length > 0
              ? <><span className={`font-bold ${dark?"text-white":"text-slate-900"}`}>{pending.length}</span> submission{pending.length !== 1 ? "s" : ""} still need your evaluation.</>
              : submissions.length === 0
                ? "No submissions assigned to you yet."
                : <span className="text-emerald-500 font-semibold">All submissions evaluated! Great work.</span>
          }
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({label,value,color,icon:Icon},i) => (
          <motion.div key={label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
            className={`p-4 rounded-xl border ${dark?`bg-${color}-500/5 border-${color}-500/15`:`bg-${color}-50 border-${color}-200`}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${dark?"text-slate-400":"text-slate-500"}`}>{label}</p>
                <p className={`text-2xl font-bold text-${color}-500`}>{loading ? "—" : value}</p>
              </div>
              <div className={`p-2 rounded-lg ${dark?`bg-${color}-500/15`:`bg-${color}-100`}`}>
                <Icon size={16} className={`text-${color}-500`}/>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submissions list */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Your Assigned Submissions</h3>
            <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-400"}`}>
              {isDemoMode ? "Demo mode — showing sample data" : "Live from database"}
            </p>
          </div>
          <Link to="/judge/submissions" className={`flex items-center gap-1 text-xs font-medium ${dark?"text-amber-400":"text-amber-600"}`}>
            Score all <ArrowRight size={12}/>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-amber-500"/>
          </div>
        ) : submissions.length === 0 ? (
          <p className={`text-sm text-center py-8 ${dark?"text-slate-500":"text-slate-400"}`}>No submissions assigned yet.</p>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub,i) => (
              <motion.div key={sub.id} layout initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.25+i*0.06}}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${dark?"bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]":"bg-slate-50 border-slate-100 hover:bg-slate-100"}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {sub.teamName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${dark?"text-white":"text-slate-800"}`}>{sub.teamName}</p>
                  <p className={`text-xs truncate ${dark?"text-slate-500":"text-slate-400"}`}>{sub.projectTitle}</p>
                </div>
                <StatusBadge status={sub.status}/>
                {sub.score ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={12} className="text-amber-400 fill-amber-400"/>
                    <span className={`text-sm font-bold ${dark?"text-white":"text-slate-800"}`}>{sub.score}</span>
                  </div>
                ) : (
                  <Link to="/judge/submissions"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors ${dark?"bg-amber-500/20 text-amber-300 hover:bg-amber-500/30":"bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                    Score Now
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
