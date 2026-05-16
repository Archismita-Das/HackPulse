import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, FileText, BarChart2, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../components/shared";
import { mockScoreChart, mockSubmissionTimeline, mockTechDistribution } from "../../services/mockData";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { submissionApi, statsApi } from "../../services/api";

const PIE_COLORS = ["#8b5cf6","#06b6d4","#10b981","#f59e0b","#f43f5e"];
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p,i) => <p key={i} style={{color:p.color}} className="font-semibold">{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminDashboard() {
  const { dark } = useTheme();
  const { leaderboard } = useData();
  const [submissions, setSubmissions] = useState([]);
  const [liveStats, setLiveStats]     = useState(null);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const load = async () => {
      if (isDemoMode) return;
      try {
        const [subRes, statRes] = await Promise.allSettled([
          submissionApi.getAll(),
          statsApi.getSummary(),
        ]);
        if (subRes.status === "fulfilled")  setSubmissions(subRes.value.data);
        if (statRes.status === "fulfilled") setLiveStats(statRes.value.data);
      } catch {}
    };
    load();
  }, []);

  // Derive stats from live data or mock
  const stats = liveStats || {
    totalParticipants: 248,
    activeTeams: leaderboard.length || 52,
    totalSubmissions: submissions.length || 41,
    averageScore: submissions.filter(s => s.score).length
      ? (submissions.filter(s => s.score).reduce((a,b) => a + Number(b.score), 0) / submissions.filter(s => s.score).length).toFixed(1)
      : 74.3,
  };

  const pendingCount = submissions.filter(s =>
    s.status === "SUBMITTED" || s.status === "UNDER_REVIEW" || s.status === "Under Review"
  ).length;

  const ax = dark ? "#475569" : "#94a3b8";
  const gr = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="Full platform overview — HackPulse 2025" />

      {pendingCount > 0 && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${dark?"bg-amber-500/10 border-amber-500/20 text-amber-300":"bg-amber-50 border-amber-200 text-amber-700"}`}>
          <AlertCircle size={16} className="flex-shrink-0"/>
          <span className="flex-1">{pendingCount} submission{pendingCount>1?"s":""} awaiting evaluation.</span>
          <Link to="/admin/submissions" className={`flex items-center gap-1 text-xs font-bold underline ${dark?"text-amber-200":"text-amber-800"}`}>
            Manage <ArrowRight size={12}/>
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Participants" value={stats.totalParticipants} icon={Users}     color="violet"  trend="up" trendValue="+12%" delay={0}    />
        <StatCard title="Teams"        value={stats.activeTeams}       icon={Trophy}    color="cyan"    trend="up" trendValue="+4"   delay={0.05} />
        <StatCard title="Submissions"  value={stats.totalSubmissions}  icon={FileText}  color="emerald" trend="up" trendValue="+8"   delay={0.1}  />
        <StatCard title="Avg Score"    value={stats.averageScore}      icon={BarChart2} color="amber"   trend="up" trendValue="+2.1" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          className={`lg:col-span-2 p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Score Progression</h3>
              <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-400"}`}>Average across rounds</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
              <TrendingUp size={11}/> +9.3%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockScoreChart}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gr}/>
              <XAxis dataKey="name" tick={{fill:ax,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,85]} tick={{fill:ax,fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="avg" name="Avg Score" stroke="#8b5cf6" strokeWidth={2} fill="url(#sg)" dot={{fill:"#8b5cf6",r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <h3 className={`text-sm font-semibold mb-1 ${dark?"text-white":"text-slate-800"}`}>Tech Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={mockTechDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {mockTechDistribution.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} stroke="transparent"/>)}
              </Pie>
              <Tooltip content={<CT/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {mockTechDistribution.map((item,i)=>(
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/>{item.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <h3 className={`text-sm font-semibold mb-3 ${dark?"text-white":"text-slate-800"}`}>Daily Submissions</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={mockSubmissionTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={gr}/>
              <XAxis dataKey="day" tick={{fill:ax,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:ax,fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Bar dataKey="submissions" name="Submissions" fill="#06b6d4" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
          className={`lg:col-span-2 p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>Top 5 Teams</h3>
            <Link to="/admin/leaderboard" className={`text-xs font-medium flex items-center gap-1 ${dark?"text-violet-400":"text-violet-600"}`}>
              View all <ArrowRight size={11}/>
            </Link>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(0,5).map((team)=>(
              <div key={team.rank} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${dark?"hover:bg-white/5":"hover:bg-slate-50"}`}>
                <span className={`w-5 text-center text-xs font-bold ${dark?"text-slate-500":"text-slate-400"}`}>#{team.rank}</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{team.teamName?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${dark?"text-white":"text-slate-800"}`}>{team.teamName}</p>
                  <p className={`text-xs truncate ${dark?"text-slate-500":"text-slate-400"}`}>{team.projectTitle}</p>
                </div>
                <div className="flex items-center gap-2 w-28">
                  <div className={`flex-1 h-1.5 rounded-full ${dark?"bg-white/5":"bg-slate-200"}`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{width:`${team.score}%`}}/>
                  </div>
                  <span className={`text-xs font-bold tabular-nums w-10 text-right ${dark?"text-slate-300":"text-slate-700"}`}>{team.score}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
