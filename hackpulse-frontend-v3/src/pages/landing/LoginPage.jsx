import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function LoginPage() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const { login }   = useAuth();
  const { dark, toggle } = useTheme();
  const navigate    = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await login(form.email, form.password);
      const role = user?.role?.toLowerCase();
      if (role === "admin")  navigate("/admin");
      else if (role === "judge") navigate("/judge");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${dark ? "bg-[#060b14]" : "bg-slate-50"}`}>
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <button onClick={toggle} className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${dark?"text-slate-400 hover:text-white hover:bg-white/10":"text-slate-500 hover:text-slate-900 hover:bg-slate-200"}`}>
        {dark ? <Sun size={18}/> : <Moon size={18}/>}
      </button>

      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="w-full max-w-md relative">
        <div className={`rounded-2xl p-8 shadow-2xl border ${dark?"bg-white/[0.03] border-white/[0.08]":"bg-white border-slate-200"}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={18} className="text-white"/>
            </div>
            <span className="text-xl font-bold" style={{fontFamily:"'Syne',sans-serif"}}>
              Hack<span className="text-violet-500">Pulse</span>
            </span>
          </Link>

          <h1 className={`text-2xl font-bold mb-1 ${dark?"text-white":"text-slate-900"}`}>Welcome back</h1>
          <p className={`text-sm mb-6 ${dark?"text-slate-400":"text-slate-500"}`}>Sign in to your account</p>

          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`}>Email</label>
              <div className="relative">
                <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/60":"bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-violet-400"}`}/>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`}>Password</label>
              <div className="relative">
                <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
                <input name="password" type={showPw?"text":"password"} required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/60":"bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-violet-400"}`}/>
                <button type="button" onClick={() => setShowPw(s=>!s)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark?"text-slate-500 hover:text-slate-300":"text-slate-400 hover:text-slate-600"}`}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{scale:1.01}} whileTap={{scale:0.99}}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-lg text-sm shadow-lg shadow-violet-500/25 disabled:opacity-70 transition-all mt-2">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <>Sign in <ArrowRight size={16}/></>}
            </motion.button>
          </form>

          <p className={`mt-6 text-center text-sm ${dark?"text-slate-500":"text-slate-500"}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">Register</Link>
          </p>

          <div className={`mt-4 p-3 rounded-lg text-center border ${dark?"bg-white/[0.02] border-white/[0.06]":"bg-slate-50 border-slate-200"}`}>
            <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>Demo: use <span className="font-mono">admin@x.com</span>, <span className="font-mono">judge@x.com</span>, or any email for participant</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
