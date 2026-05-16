import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Trophy, Users, FileText, LogOut, Menu, X, Sun, Moon, Zap, Bell, ChevronRight, Settings, UserCog } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { to:"/admin",             icon:LayoutDashboard, label:"Dashboard"   },
  { to:"/admin/leaderboard", icon:Trophy,          label:"Leaderboard" },
  { to:"/admin/teams",       icon:Users,           label:"Teams"       },
  { to:"/admin/submissions", icon:FileText,        label:"Submissions" },
  { to:"/admin/users",       icon:UserCog,         label:"Users"       },
];

export default function AdminLayout({ children }) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className={`flex h-screen overflow-hidden ${dark?"bg-[#060b14]":"bg-slate-100"}`}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}/>
        )}
      </AnimatePresence>

      {/* Sidebar — deep purple for admin */}
      <motion.aside
        animate={{width: collapsed ? 72 : 240}}
        transition={{duration:0.3,ease:[0.4,0,0.2,1]}}
        className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col overflow-hidden shadow-2xl
          ${dark?"bg-[#0d1117] border-r border-white/5":"bg-[#1e1b4b] border-r border-indigo-900/50"}
          ${mobileOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"} transition-transform duration-300 lg:transition-none`}
        style={{minWidth: collapsed ? 72 : 240}}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={15} className="text-white"/>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="flex-1 min-w-0">
                <p className="text-white font-bold text-base truncate" style={{fontFamily:"'Syne',sans-serif"}}>Hack<span className="text-violet-400">Pulse</span></p>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({to,icon:Icon,label}) => (
            <NavLink key={to} to={to} end={to==="/admin"}
              className={({isActive}) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative
                ${isActive?"bg-violet-500/20 text-violet-300":"text-slate-400 hover:bg-white/5 hover:text-white"}`
              }>
              {({isActive}) => (
                <>
                  {isActive && <motion.div layoutId="admin-nav" className="absolute inset-0 bg-violet-500/10 rounded-lg border border-violet-500/20"/>}
                  <Icon size={17} className="flex-shrink-0 relative z-10"/>
                  <AnimatePresence>
                    {!collapsed && <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="relative z-10 whitespace-nowrap">{label}</motion.span>}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 px-2 py-2 ${collapsed?"justify-center":""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0)||"A"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name||"Admin"}</p>
                  <p className="text-[10px] text-violet-400 font-semibold uppercase">Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button onClick={handleLogout} className="p-1.5 text-slate-500 hover:text-red-400 rounded-md hover:bg-red-400/10 transition-colors">
                <LogOut size={13}/>
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(c=>!c)}
          className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#1e1b4b] border border-indigo-700/50 rounded-full items-center justify-center text-slate-400 hover:text-white transition-all shadow-lg">
          <ChevronRight size={12} className={`transition-transform ${collapsed?"":"rotate-180"}`}/>
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className={`h-16 flex items-center gap-4 px-4 lg:px-6 border-b ${dark?"bg-[#060b14]/80 border-white/5":"bg-white border-slate-200"} backdrop-blur-md`}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg">
            <Menu size={20}/>
          </button>
          <div className="flex-1">
            <span className={`text-sm font-medium ${dark?"text-slate-400":"text-slate-500"}`}>
              Admin Panel — <span className={dark?"text-white":"text-slate-900"}>Full Control</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-400 hover:text-violet-400 rounded-lg transition-colors">
              <Bell size={17}/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full"/>
            </button>
            <button onClick={toggle} className={`p-2 rounded-lg transition-colors ${dark?"text-slate-400 hover:text-white":"text-slate-500 hover:text-slate-900"}`}>
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
          </div>
        </header>
        <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${dark?"":"bg-slate-50"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
