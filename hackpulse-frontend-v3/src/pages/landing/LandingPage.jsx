import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Trophy, Users, FileText, BarChart2, Shield, Github, ArrowRight, CheckCircle2, Star, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const stats = [
  { value: "2,400+", label: "Participants" },
  { value: "480+",   label: "Teams" },
  { value: "120+",   label: "Projects" },
  { value: "98%",    label: "Satisfaction" },
];

const features = [
  { icon: Trophy,    title: "Live Leaderboard",     desc: "Real-time rankings updated instantly as judges score projects. Never miss a position change." },
  { icon: BarChart2, title: "Analytics Dashboard",  desc: "Deep insights with charts, trends, and submission analytics for organizers and participants." },
  { icon: Shield,    title: "Role-Based Access",     desc: "Separate views for Admins, Judges, and Participants — everyone sees only what they need." },
  { icon: Users,     title: "Team Management",       desc: "Create teams, add members, link your GitHub and demo URLs. Everything in one place." },
  { icon: FileText,  title: "Submission Tracking",   desc: "Submit projects, track evaluation status, and receive judge remarks in real time." },
  { icon: Globe,     title: "Multi-Hackathon Ready", desc: "Scalable platform built for events of any size — from 10 teams to 500 teams." },
];

const testimonials = [
  { name:"Priya Mehta",   role:"ML Engineer, Neural Ninjas", text:"HackPulse made our hackathon experience seamless. The leaderboard updates were instant!" },
  { name:"Rahul Gupta",   role:"Team Lead, Quantum Leap",    text:"As a team lead, I loved being able to track our submission status and score in real time." },
  { name:"Dr. Anjali V.", role:"Judge, HackPulse 2025",      text:"The judge dashboard made scoring so efficient. I could manage all my assigned projects easily." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className={`min-h-screen ${dark ? "dark bg-[#060b14] text-white" : "bg-white text-slate-900"} transition-colors duration-300`}>

      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${dark ? "bg-[#060b14]/90 border-white/10" : "bg-white/90 border-slate-200"} border-b backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold font-display" style={{fontFamily:"'Syne',sans-serif"}}>
                Hack<span className="text-violet-500">Pulse</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {["About","Features","Stats","Testimonials","Contact"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-violet-600"}`}>
                  {item}
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button onClick={toggle} className={`p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>
                {dark ? <Sun size={18}/> : <Moon size={18}/>}
              </button>
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${dark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-violet-600 hover:bg-violet-50"}`}>
                  Sign In
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-500/25 transition-all">
                  Get Started
                </Link>
              </div>
              <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white">
                {menuOpen ? <X size={20}/> : <Menu size={20}/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden border-t ${dark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"} px-4 py-4 space-y-3`}>
            {["About","Features","Stats","Testimonials","Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {item}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className={`flex-1 text-center py-2 text-sm rounded-lg border ${dark ? "border-white/20 text-white" : "border-slate-300 text-slate-700"}`}>Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-sm rounded-lg bg-violet-600 text-white font-semibold">Register</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          {dark && <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"28px 28px"}} />}
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border ${dark ? "bg-violet-500/10 text-violet-300 border-violet-500/20" : "bg-violet-50 text-violet-600 border-violet-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              HackPulse 2025 — Now Live
            </span>
          </motion.div>

          <motion.h1
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{fontFamily:"'Syne',sans-serif"}}
          >
            The Platform That{" "}
            <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Powers Hackathons
            </span>
          </motion.h1>

          <motion.p
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}}
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}
          >
            Real-time leaderboards, role-based dashboards, submission tracking, and deep analytics — everything you need to run a world-class hackathon.
          </motion.p>

          <motion.div
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/register"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-violet-400 shadow-xl shadow-violet-500/25 transition-all text-sm">
              Start for Free <ArrowRight size={16}/>
            </Link>
            <a href="#features"
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
              See Features
            </a>
          </motion.div>
        </div>

        {/* Hero card mockup */}
        <motion.div
          initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.4}}
          className="max-w-4xl mx-auto mt-16 relative"
        >
          <div className={`rounded-2xl border shadow-2xl overflow-hidden ${dark ? "bg-[#0d1117] border-white/10 shadow-violet-500/10" : "bg-slate-50 border-slate-200 shadow-slate-300/50"}`}>
            <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${dark ? "border-white/10" : "border-slate-200"}`}>
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className={`ml-3 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>hackpulse.io/leaderboard</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[{l:"Participants",v:"248",c:"violet"},{l:"Teams",v:"52",c:"cyan"},{l:"Submissions",v:"41",c:"emerald"},{l:"Avg Score",v:"74.3",c:"amber"}].map(s => (
                  <div key={s.l} className={`p-3 rounded-xl border text-center ${dark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                    <p className={`text-xl font-bold text-${s.c}-${dark?"300":"600"}`}>{s.v}</p>
                    <p className={`text-xs mt-0.5 ${dark?"text-slate-500":"text-slate-500"}`}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div className={`rounded-xl border overflow-hidden ${dark ? "border-white/10" : "border-slate-200"}`}>
                {[{r:1,t:"Neural Ninjas",p:"MediScan AI",s:96.5},{r:2,t:"ByteForge",p:"EcoTrack",s:93.2},{r:3,t:"Quantum Leap",p:"FinFlow",s:91.8}].map((row,i) => (
                  <div key={row.r} className={`flex items-center gap-4 px-4 py-3 ${i<2 ? (dark?"border-b border-white/5":"border-b border-slate-100") : ""} ${dark?"hover:bg-white/5":"hover:bg-slate-50"}`}>
                    <span className="text-lg">{["🥇","🥈","🥉"][i]}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>{row.t}</p>
                      <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{row.p}</p>
                    </div>
                    <span className={`text-sm font-bold ${dark?"text-violet-300":"text-violet-600"}`}>{row.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section id="stats" className={`py-16 ${dark ? "bg-white/[0.02]" : "bg-slate-50"}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s,i) => (
              <motion.div key={s.label} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent" style={{fontFamily:"'Syne',sans-serif"}}>{s.value}</p>
                <p className={`text-sm mt-1 ${dark?"text-slate-400":"text-slate-600"}`}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${dark?"text-violet-400":"text-violet-600"}`}>About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily:"'Syne',sans-serif"}}>
                Built by hackers,<br/>for hackers
              </h2>
              <p className={`mb-4 leading-relaxed ${dark?"text-slate-400":"text-slate-600"}`}>
                HackPulse was born out of frustration with outdated spreadsheet-based hackathon management. We built a modern, real-time platform that brings clarity to every stakeholder — organizers, judges, and participants alike.
              </p>
              <p className={`mb-6 leading-relaxed ${dark?"text-slate-400":"text-slate-600"}`}>
                Our mission is simple: remove the chaos from hackathons so that teams can focus entirely on building amazing things.
              </p>
              <div className="space-y-2">
                {["Real-time updates with zero lag","Secure role-based access control","Beautiful, intuitive interface"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0"/>
                    <span className={`text-sm ${dark?"text-slate-300":"text-slate-700"}`}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
              className="grid grid-cols-2 gap-4">
              {[
                {title:"For Admins",   desc:"Full control. Manage teams, users, scores, and view deep analytics.",         color:"violet"},
                {title:"For Judges",   desc:"Review and score your assigned submissions with an elegant interface.",         color:"cyan"  },
                {title:"For Teams",    desc:"Track your ranking, manage your team, and submit your project with ease.",      color:"emerald"},
                {title:"Open API",     desc:"Spring Boot REST API. Integrate with your existing hackathon tools easily.",   color:"amber" },
              ].map((card,i) => (
                <div key={card.title} className={`p-4 rounded-xl border ${dark?"bg-white/[0.03] border-white/10":"bg-white border-slate-200 shadow-sm"}`}>
                  <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center bg-${card.color}-500/15`}>
                    <div className={`w-3 h-3 rounded-full bg-${card.color}-500`}/>
                  </div>
                  <h4 className={`text-sm font-bold mb-1 ${dark?"text-white":"text-slate-800"}`}>{card.title}</h4>
                  <p className={`text-xs leading-relaxed ${dark?"text-slate-500":"text-slate-500"}`}>{card.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className={`py-20 px-4 ${dark?"bg-white/[0.02]":"bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${dark?"text-violet-400":"text-violet-600"}`}>Features</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{fontFamily:"'Syne',sans-serif"}}>Everything you need</h2>
            <p className={`mt-3 max-w-xl mx-auto text-sm ${dark?"text-slate-400":"text-slate-600"}`}>A complete suite of tools to manage every aspect of your hackathon.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f,i) => (
              <motion.div key={f.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                className={`p-5 rounded-xl border transition-all hover:-translate-y-1 ${dark?"bg-white/[0.03] border-white/10 hover:border-violet-500/30":"bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${dark?"bg-violet-500/15":"bg-violet-50"}`}>
                  <f.icon size={20} className={dark?"text-violet-400":"text-violet-600"} />
                </div>
                <h3 className={`font-bold mb-2 ${dark?"text-white":"text-slate-800"}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark?"text-slate-400":"text-slate-600"}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${dark?"text-violet-400":"text-violet-600"}`}>Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{fontFamily:"'Syne',sans-serif"}}>Loved by participants</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t,i) => (
              <motion.div key={t.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className={`p-5 rounded-xl border ${dark?"bg-white/[0.03] border-white/10":"bg-white border-slate-200 shadow-sm"}`}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_,j) => <Star key={j} size={13} className="text-amber-400 fill-amber-400"/>)}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${dark?"text-slate-300":"text-slate-700"}`}>"{t.text}"</p>
                <div>
                  <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-800"}`}>{t.name}</p>
                  <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`p-10 rounded-2xl border ${dark?"bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/20":"bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-200"}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Ready to run your hackathon?</h2>
            <p className={`mb-8 ${dark?"text-slate-400":"text-slate-600"}`}>Join hundreds of organizers who trust HackPulse to power their events.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-violet-400 transition-all text-sm">
                Get Started Free <ArrowRight size={16}/>
              </Link>
              <Link to="/login" className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${dark?"border-white/20 text-white hover:bg-white/10":"border-slate-300 text-slate-700 hover:bg-white"}`}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className={`py-16 px-4 border-t ${dark?"border-white/10":"border-slate-200"}`}>
        <div className="max-w-5xl mx-auto text-center">
          <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${dark?"text-violet-400":"text-violet-600"}`}>Contact</span>
          <h2 className="text-2xl font-bold mb-2" style={{fontFamily:"'Syne',sans-serif"}}>Get in touch</h2>
          <p className={`text-sm mb-4 ${dark?"text-slate-400":"text-slate-600"}`}>Have questions? We'd love to hear from you.</p>
          <a href="mailto:support@hackpulse.io" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">support@hackpulse.io</a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`border-t py-8 px-4 ${dark?"border-white/10 bg-[#0d1117]":"border-slate-200 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap size={12} className="text-white"/>
            </div>
            <span className={`text-sm font-bold ${dark?"text-white":"text-slate-800"}`} style={{fontFamily:"'Syne',sans-serif"}}>HackPulse</span>
          </div>
          <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>© 2025 HackPulse. Built for the builders.</p>
          <div className="flex gap-5">
            {["Privacy","Terms","Contact"].map(l => (
              <a key={l} href="#" className={`text-xs transition-colors ${dark?"text-slate-500 hover:text-white":"text-slate-400 hover:text-slate-700"}`}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
