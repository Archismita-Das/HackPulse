import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Upload, CheckCircle2, Clock, Star, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { userApi } from "../../services/api";
import { myTeamData } from "../../services/mockData";
import { StatusBadge, RankBadge } from "../../components/shared";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();

  const [team, setTeam]       = useState(null);
  const [loading, setLoading] = useState(true);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const fetchMyTeam = async () => {
      if (isDemoMode) {
        // In demo mode, simulate participant sees mock team #1
        setTeam(myTeamData);
        setLoading(false);
        return;
      }
      try {
        const { data } = await userApi.getMyTeam();
        if (data?.message === "not_in_team") {
          setTeam(null);
        } else {
          setTeam(data);
        }
      } catch {
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTeam();
  }, []);

  const quickLinks = [
    { to:"/dashboard/my-team",     icon:Users,    label:"View My Team",     color:"emerald", desc:"See members & tech stack"  },
    { to:"/dashboard/leaderboard", icon:Trophy,   label:"Leaderboard",      color:"cyan",    desc:"Check current rankings"    },
    { to:"/dashboard/submit",      icon:Upload,   label:"Submit Project",   color:"violet",  desc:"Upload your project link"  },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-emerald-500"/>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
          className={`p-5 rounded-xl border bg-gradient-to-br ${dark?"from-emerald-500/10 to-cyan-500/5 border-emerald-500/20":"from-emerald-50 to-cyan-50 border-emerald-200"}`}>
          <h2 className={`text-xl font-bold mb-1 ${dark?"text-white":"text-slate-900"}`} style={{fontFamily:"'Syne',sans-serif"}}>
            Hey {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
          <p className={`text-sm ${dark?"text-slate-400":"text-slate-600"}`}>
            You haven't been assigned to a team yet. Please contact an admin.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(({to,icon:Icon,label,color,desc},i) => (
            <motion.div key={to} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} whileHover={{y:-2}}>
              <Link to={to} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${dark?`bg-${color}-500/5 border-${color}-500/15 hover:border-${color}-500/30`:`bg-${color}-50 border-${color}-200 hover:border-${color}-300`}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark?`bg-${color}-500/15`:`bg-${color}-100`}`}>
                  <Icon size={18} className={`text-${color}-500`}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>{label}</p>
                  <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-500"}`}>{desc}</p>
                </div>
                <ArrowRight size={14} className={`flex-shrink-0 text-${color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}/>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const scoreData = [{ name: "Score", value: team.score || 0, fill: "#10b981" }];
  const isTop3    = team.rank && team.rank <= 3;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className={`p-5 rounded-xl border bg-gradient-to-br ${dark?"from-emerald-500/10 to-cyan-500/5 border-emerald-500/20":"from-emerald-50 to-cyan-50 border-emerald-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold mb-1 ${dark?"text-white":"text-slate-900"}`} style={{fontFamily:"'Syne',sans-serif"}}>
              Hey {user?.name?.split(" ")[0] || "there"} 👋
            </h2>
            <p className={`text-sm ${dark?"text-slate-400":"text-slate-600"}`}>
              You're on team{" "}
              <span className={`font-semibold ${dark?"text-emerald-300":"text-emerald-600"}`}>{team.teamName}</span>.{" "}
              {team.rank
                ? <>Your project is currently ranked <span className={`font-bold ${dark?"text-white":"text-slate-900"}`}>#{team.rank}</span>.</>
                : "Scores pending."}
            </p>
          </div>
          {isTop3 && (
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${dark?"bg-emerald-500/15 text-emerald-300 border-emerald-500/25":"bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
              🏆 Top 3
            </div>
          )}
        </div>
      </motion.div>

      {/* Score card + team info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score radial */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className={`p-5 rounded-xl border text-center ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${dark?"text-slate-400":"text-slate-500"}`}>Your Score</p>
          <div className="relative h-32 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={scoreData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: dark?"rgba(255,255,255,0.05)":"#f1f5f9" }}/>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <p className={`text-3xl font-bold ${dark?"text-white":"text-slate-900"}`}>{team.score || "—"}</p>
                <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>/ 100</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1 text-emerald-500 text-xs font-medium">
            <TrendingUp size={12}/>
            {team.rank ? `Rank #${team.rank}` : "Not ranked yet"}
          </div>
        </motion.div>

        {/* Team snapshot */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
          className={`lg:col-span-2 p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${dark?"text-white":"text-slate-800"}`}>{team.teamName}</h3>
              <p className={`text-xs mt-0.5 ${dark?"text-slate-400":"text-slate-500"}`}>{team.projectTitle}</p>
            </div>
            <StatusBadge status={team.submissionStatus}/>
          </div>
          <p className={`text-xs leading-relaxed mb-4 ${dark?"text-slate-400":"text-slate-500"}`}>{team.description || "No description yet."}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(team.techStack || []).map(t => (
              <span key={t} className={`px-2 py-0.5 text-xs rounded-md border ${dark?"bg-emerald-500/10 border-emerald-500/20 text-emerald-300":"bg-emerald-50 border-emerald-200 text-emerald-700"}`}>{t}</span>
            ))}
          </div>
          {(team.members || []).length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {team.members.map(m => (
                  <div key={m.name} className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-[#0d1117] flex items-center justify-center text-[9px] font-bold text-white" title={m.name}>
                    {m.avatar || m.name?.charAt(0)}
                  </div>
                ))}
              </div>
              <span className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{team.members.length} members</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({to,icon:Icon,label,color,desc},i) => (
          <motion.div key={to} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.07}} whileHover={{y:-2,transition:{duration:0.2}}}>
            <Link to={to} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${dark?`bg-${color}-500/5 border-${color}-500/15 hover:border-${color}-500/30`:`bg-${color}-50 border-${color}-200 hover:border-${color}-300`}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark?`bg-${color}-500/15`:`bg-${color}-100`}`}>
                <Icon size={18} className={`text-${color}-500`}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-500"}`}>{desc}</p>
              </div>
              <ArrowRight size={14} className={`flex-shrink-0 text-${color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}/>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Judge remarks */}
      {team.remarks && (
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-amber-400 fill-amber-400"/>
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Judge Feedback</h3>
          </div>
          <blockquote className={`border-l-2 border-emerald-500/40 pl-3 text-sm italic leading-relaxed ${dark?"text-slate-300":"text-slate-600"}`}>
            "{team.remarks}"
          </blockquote>
        </motion.div>
      )}
    </div>
  );
}
