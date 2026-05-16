import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Shield, UserCheck, Users, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader } from "../../components/shared";
import Modal from "../../components/shared/Modal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useTheme } from "../../context/ThemeContext";
import { userApi } from "../../services/api";

// Demo fallback users
const DEMO_USERS = [
  { id:1, name:"Arjun Sharma",     email:"arjun@hackpulse.io",  role:"participant", teamId:1, teamName:"Neural Ninjas", joined:"2025-03-01" },
  { id:2, name:"Dr. Anjali Verma", email:"anjali@hackpulse.io", role:"judge",       teamId:null, teamName:"—",          joined:"2025-02-20" },
  { id:3, name:"Admin User",       email:"admin@hackpulse.io",  role:"admin",       teamId:null, teamName:"—",          joined:"2025-01-10" },
  { id:4, name:"Priya Mehta",      email:"priya@hackpulse.io",  role:"participant", teamId:1, teamName:"Neural Ninjas", joined:"2025-03-01" },
  { id:5, name:"Prof. Ravi Kumar", email:"ravi@hackpulse.io",   role:"judge",       teamId:null, teamName:"—",          joined:"2025-02-22" },
  { id:6, name:"Aditya Singh",     email:"aditya@hackpulse.io", role:"participant", teamId:2, teamName:"ByteForge",     joined:"2025-03-02" },
];

const RoleBadge = ({ role, dark }) => {
  const r = (role || "").toUpperCase();
  const s = {
    ADMIN:       dark?"bg-violet-500/15 text-violet-300 border-violet-500/20":"bg-violet-50 text-violet-700 border-violet-200",
    JUDGE:       dark?"bg-amber-500/15 text-amber-300 border-amber-500/20":"bg-amber-50 text-amber-700 border-amber-200",
    PARTICIPANT: dark?"bg-emerald-500/15 text-emerald-300 border-emerald-500/20":"bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const icons = { ADMIN:Shield, JUDGE:UserCheck, PARTICIPANT:Users };
  const Icon = icons[r] || Users;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s[r]||""}`}><Icon size={10}/>{r}</span>;
};

const emptyUser = { name:"", email:"", role:"participant", teamName:"" };

export default function AdminUsers() {
  const { dark } = useTheme();
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [addOpen, setAddOpen]       = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]             = useState(emptyUser);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  const isDemoMode = localStorage.getItem("hp_token") === "demo-token";

  useEffect(() => {
    const load = async () => {
      if (isDemoMode) { setUsers(DEMO_USERS); setLoading(false); return; }
      try {
        const { data } = await userApi.getAll();
        setUsers(data);
      } catch { setUsers(DEMO_USERS); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchQ && (roleFilter === "All" || u.role?.toUpperCase() === roleFilter);
  });

  const openAdd  = () => { setForm(emptyUser); setSaved(false); setAddOpen(true); };
  const openEdit = (u) => { setEditTarget(u); setForm({ name:u.name, email:u.email, role:u.role, teamName:u.teamName||"" }); setSaved(false); };

  const handleSave = async (isEdit) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    if (isEdit) {
      setUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...form } : u));
    } else {
      setUsers(prev => [...prev, { ...form, id: Date.now(), joined: new Date().toISOString().split("T")[0] }]);
    }
    setSaving(false); setSaved(true);
    setTimeout(() => { setAddOpen(false); setEditTarget(null); setSaved(false); }, 600);
  };

  const inp = `w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/60":"bg-white border-slate-300 text-slate-900 focus:border-violet-400"}`;
  const lbl = `block text-xs font-semibold mb-1.5 ${dark?"text-slate-400":"text-slate-600"}`;

  const UserForm = ({ isEdit }) => (
    <div className="space-y-3">
      <div><label className={lbl}>Full Name</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" className={inp}/></div>
      <div><label className={lbl}>Email</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="user@example.com" className={inp}/></div>
      <div>
        <label className={lbl}>Role</label>
        <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
          className={`${inp} cursor-pointer`}>
          <option value="participant">Participant</option>
          <option value="judge">Judge</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div><label className={lbl}>Team (optional)</label><input value={form.teamName} onChange={e=>setForm(f=>({...f,teamName:e.target.value}))} placeholder="Team name" className={inp}/></div>
      <button onClick={() => handleSave(isEdit)} disabled={saving||saved||!form.name||!form.email}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl text-sm mt-2 disabled:opacity-60 transition-all">
        {saving?<><Loader2 size={14} className="animate-spin"/>Saving...</>:saved?<><CheckCircle2 size={14}/>Saved!</>:isEdit?"Save Changes":"Add User"}
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader title="User Management" subtitle={`${users.length} users registered`}>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-violet-400 transition-all">
          <Plus size={15}/> Add User
        </button>
      </PageHeader>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark?"text-slate-500":"text-slate-400"}`}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark?"bg-white/5 border-white/10 text-white placeholder-slate-500":"bg-white border-slate-300 text-slate-900"}`}/>
        </div>
        {["All","PARTICIPANT","JUDGE","ADMIN"].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${roleFilter===r
              ? dark?"bg-violet-500/20 border-violet-500/30 text-violet-300":"bg-violet-100 border-violet-300 text-violet-700"
              : dark?"border-white/10 text-slate-400 hover:bg-white/5":"border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-500"/></div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${dark?"bg-white/[0.03] border-white/[0.07]":"bg-white border-slate-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${dark?"border-white/[0.07]":"border-slate-100"}`}>
                  {["User","Email","Role","Team","Actions"].map(h=>(
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dark?"text-slate-400":"text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u,i) => (
                  <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className={`border-b transition-colors ${dark?"border-white/[0.04] hover:bg-white/[0.03]":"border-slate-50 hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-500/30 flex items-center justify-center text-xs font-bold text-white">
                          {u.name?.charAt(0)}
                        </div>
                        <span className={`text-sm font-medium ${dark?"text-white":"text-slate-800"}`}>{u.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${dark?"text-slate-400":"text-slate-500"}`}>{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} dark={dark}/></td>
                    <td className={`px-4 py-3 text-sm ${dark?"text-slate-400":"text-slate-500"}`}>{u.teamName || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(u)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-violet-500/15 text-violet-300 hover:bg-violet-500/25":"bg-violet-50 text-violet-600 hover:bg-violet-100"}`}>
                          <Edit2 size={11}/> Edit
                        </button>
                        <button onClick={() => setDeleteTarget(u)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark?"bg-red-500/10 text-red-400 hover:bg-red-500/20":"bg-red-50 text-red-500 hover:bg-red-100"}`}>
                          <Trash2 size={11}/> Remove
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add User" subtitle="Register a new user">
        <UserForm isEdit={false}/>
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit — ${editTarget?.name}`} subtitle={editTarget?.email}>
        <UserForm isEdit={true}/>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { setUsers(prev => prev.filter(u => u.id !== deleteTarget.id)); }}
        title="Remove User?" message={`Remove ${deleteTarget?.name} from the platform? This cannot be undone.`}
        confirmLabel="Remove"/>
    </div>
  );
}
