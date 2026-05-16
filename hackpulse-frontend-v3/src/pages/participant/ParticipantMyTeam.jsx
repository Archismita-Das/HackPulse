import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Code2, Users, Star, MessageSquare, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { userApi } from "../../services/api";
import { myTeamData } from "../../services/mockData";
import { StatusBadge, RankBadge, PageHeader } from "../../components/shared";

export default function ParticipantMyTeam() {
  const { dark }  = useTheme();
  const [team, setTeam]       = useState(null);
  const [loading, setLoading] = useState(true);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const fetchTeam = async () => {
      if (isDemoMode) { setTeam(myTeamData); setLoading(false); return; }
      try {
        const { data } = await userApi.getMyTeam();
        setTeam(data?.message === "not_in_team" ? null : data);
      } catch {
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-emerald-500"/>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-3xl space-y-5">
        <PageHeader title="My Team" subtitle="Your team details and project info"/>
        <div className={`p-8 rounded-xl border text-center ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <Users size={40} className={`mx-auto mb-3 ${dark?"text-slate-500":"text-slate-300"}`}/>
          <p className={`text-sm font-medium ${dark?"text-slate-300":"text-slate-600"}`}>You haven't been assigned to a team yet.</p>
          <p className={`text-xs mt-1 ${dark?"text-slate-500":"text-slate-400"}`}>Contact your hackathon administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="My Team" subtitle="Your team details and project info"/>

      {/* Hero */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        className={`p-6 rounded-xl border relative overflow-hidden ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"/>
        <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/40 to-cyan-500/30 border border-white/10 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {team.teamName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className={`text-xl font-bold ${dark?"text-white":"text-slate-900"}`} style={{fontFamily:"'Syne',sans-serif"}}>{team.teamName}</h2>
              {team.rank > 0 && <RankBadge rank={team.rank}/>}
              <StatusBadge status={team.submissionStatus}/>
            </div>
            <p className={`text-sm font-medium mb-2 ${dark?"text-emerald-300":"text-emerald-600"}`}>{team.projectTitle}</p>
            <p className={`text-sm leading-relaxed ${dark?"text-slate-400":"text-slate-500"}`}>{team.description || "No description provided."}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-3xl font-bold ${dark?"text-white":"text-slate-900"}`}>{team.score || "—"}</p>
            <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-400"}`}>Total score</p>
          </div>
        </div>
        {(team.githubUrl || team.demoUrl) && (
          <div className={`flex gap-2 mt-5 pt-5 border-t ${dark?"border-white/[0.06]":"border-slate-100"}`}>
            {team.githubUrl && (
              <a href={team.githubUrl} target="_blank" rel="noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark?"bg-white/5 border-white/10 text-slate-300 hover:bg-white/10":"bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                <Github size={13}/> GitHub
              </a>
            )}
            {team.demoUrl && (
              <a href={team.demoUrl} target="_blank" rel="noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark?"bg-emerald-500/15 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25":"bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"}`}>
                <ExternalLink size={13}/> Live Demo
              </a>
            )}
          </div>
        )}
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Members */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <Users size={15} className="text-emerald-500"/>
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Team Members</h3>
          </div>
          {(team.members || []).length === 0
            ? <p className={`text-xs italic ${dark?"text-slate-500":"text-slate-400"}`}>No members listed.</p>
            : (
              <div className="space-y-3">
                {team.members.map((m,i) => (
                  <motion.div key={m.name} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.15+i*0.05}}
                    className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {m.avatar || m.name?.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${dark?"text-white":"text-slate-800"}`}>{m.name}</p>
                      <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{m.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          }
        </motion.div>

        {/* Tech stack */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={15} className="text-cyan-500"/>
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(team.techStack || []).length === 0
              ? <p className={`text-xs italic ${dark?"text-slate-500":"text-slate-400"}`}>Not specified yet.</p>
              : team.techStack.map((t,i) => (
                <motion.span key={t} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.2+i*0.04}}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${dark?"bg-emerald-500/10 border-emerald-500/20 text-emerald-300":"bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                  {t}
                </motion.span>
              ))
            }
          </div>
        </motion.div>

        {/* Score breakdown — only show if scored */}
        {team.score > 0 && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={15} className="text-amber-400"/>
              <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Score Breakdown</h3>
            </div>
            {[
              { label:"Innovation",   pct:0.28 },
              { label:"Technical",    pct:0.32 },
              { label:"Impact",       pct:0.22 },
              { label:"Presentation", pct:0.18 },
            ].map((item,i) => {
              const val = Math.round(team.score * item.pct);
              const max = Math.round(100 * item.pct);
              return (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={dark?"text-slate-400":"text-slate-600"}>{item.label}</span>
                    <span className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>{val}/{max}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${dark?"bg-white/5":"bg-slate-100"}`}>
                    <motion.div initial={{width:0}} animate={{width:`${(val/max)*100}%`}}
                      transition={{delay:0.3+i*0.07,duration:0.6}}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"/>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Remarks */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={15} className="text-violet-400"/>
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Judge Remarks</h3>
          </div>
          {team.remarks ? (
            <blockquote className={`border-l-2 border-emerald-500/40 pl-3 text-sm italic leading-relaxed ${dark?"text-slate-300":"text-slate-600"}`}>
              "{team.remarks}"
            </blockquote>
          ) : (
            <p className={`text-sm italic ${dark?"text-slate-500":"text-slate-400"}`}>Evaluation pending...</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
