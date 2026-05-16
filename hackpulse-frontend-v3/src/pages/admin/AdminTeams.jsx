import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Github, ExternalLink, CheckCircle2, Loader2, X } from "lucide-react";
import { StatusBadge, RankBadge, PageHeader } from "../../components/shared";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";

const emptyForm = { teamName: "", projectTitle: "", description: "", techStack: "", githubUrl: "", demoUrl: "" };

export default function AdminTeams() {
  const { dark } = useTheme();
  const { teams, addTeam, updateTeam, deleteTeam } = useData();

  const [search, setSearch]             = useState("");
  const [addOpen, setAddOpen]           = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const filtered = teams.filter(t =>
    t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
    t.projectTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setSaved(false);
    setSaving(false);
    setAddOpen(true);
  };

  const openEdit = (team) => {
    setEditTarget(team);
    setForm({
      teamName: team.teamName,
      projectTitle: team.projectTitle,
      description: team.description || "",
      techStack: Array.isArray(team.techStack) ? team.techStack.join(", ") : team.techStack || "",
      githubUrl: team.githubUrl || "",
      demoUrl: team.demoUrl || "",
    });
    setSaved(false);
    setSaving(false);
  };

  const handleSave = async (isEdit) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    const payload = {
      ...form,
      techStack: form.techStack.split(",").map(s => s.trim()).filter(Boolean),
    };
    if (isEdit) updateTeam(editTarget.id, payload);
    else addTeam(payload);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setAddOpen(false); setEditTarget(null); setSaved(false); }, 600);
  };

  // Reusable inline modal with sticky footer button
  const TeamModal = ({ open, onClose, isEdit }) => {
    if (!open) return null;
    const inp = {
      width: "100%",
      padding: "0.6rem 0.875rem",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      outline: "none",
      border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1",
      background: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
      color: dark ? "#f1f5f9" : "#0f172a",
    };
    const lbl = {
      display: "block",
      fontSize: "0.75rem",
      fontWeight: 600,
      marginBottom: "0.375rem",
      color: dark ? "#94a3b8" : "#475569",
    };

    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 9998 }}
            />

            {/* Dialog */}
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
  onClick={(e) => e.stopPropagation()}
  style={{
    position: "fixed",
    top: "5vh",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "calc(100vw - 2rem)",
    maxWidth: "32rem",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "1rem",
    border: dark
      ? "1px solid rgba(255,255,255,0.1)"
      : "1px solid #e2e8f0",
    background: dark ? "#0d1117" : "#ffffff",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    overflow: "hidden",
  }}
>
  {/* ── Header ── */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.5rem",
      borderBottom: dark
        ? "1px solid rgba(255,255,255,0.07)"
        : "1px solid #f1f5f9",
      flexShrink: 0,
    }}
  >
    <div>
      <h3
        style={{
          fontSize: "0.9rem",
          fontWeight: 700,
          color: dark ? "#f1f5f9" : "#0f172a",
          margin: 0,
        }}
      >
        {isEdit ? `Edit — ${editTarget?.teamName}` : "Add Team"}
      </h3>

      <p
        style={{
          fontSize: "0.72rem",
          color: dark ? "#64748b" : "#94a3b8",
          marginTop: "0.15rem",
        }}
      >
        {isEdit
          ? "Update team details"
          : "Register a new team for the hackathon"}
      </p>
    </div>

    <button
      onClick={onClose}
      style={{
        padding: "0.35rem",
        borderRadius: "0.5rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: dark ? "#64748b" : "#94a3b8",
      }}
    >
      <X size={16} />
    </button>
  </div>

  {/* ── Scrollable Body ── */}
  <div
  style={{
    overflowY: "auto",
    padding: "1.25rem 1.5rem",
    maxHeight: "60vh",
  }}
>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
      }}
    >
      {/* Team Name */}
      <div>
        <label style={lbl}>Team Name *</label>
        <input
          value={form.teamName}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              teamName: e.target.value,
            }))
          }
          placeholder="e.g. Neural Ninjas"
          style={inp}
        />
      </div>

      {/* Project Title */}
      <div>
        <label style={lbl}>Project Title *</label>
        <input
          value={form.projectTitle}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              projectTitle: e.target.value,
            }))
          }
          placeholder="e.g. MediScan AI"
          style={inp}
        />
      </div>

      {/* Description */}
      <div>
        <label style={lbl}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              description: e.target.value,
            }))
          }
          rows={3}
          placeholder="Brief project description..."
          style={{
            ...inp,
            resize: "none",
          }}
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label style={lbl}>Tech Stack (comma separated)</label>
        <input
          value={form.techStack}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              techStack: e.target.value,
            }))
          }
          placeholder="React, Spring Boot, MySQL"
          style={inp}
        />
      </div>

      {/* URLs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
        }}
      >
        <div>
          <label style={lbl}>GitHub URL</label>
          <input
            value={form.githubUrl}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                githubUrl: e.target.value,
              }))
            }
            placeholder="https://github.com/..."
            style={inp}
          />
        </div>

        <div>
          <label style={lbl}>Demo URL</label>
          <input
            value={form.demoUrl}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                demoUrl: e.target.value,
              }))
            }
            placeholder="https://..."
            style={inp}
          />
        </div>
      </div>
    </div>
  </div>

  {/* ── Footer ── */}
  <div
    style={{
      padding: "1rem 1.5rem",
      borderTop: dark
        ? "1px solid rgba(255,255,255,0.07)"
        : "1px solid #f1f5f9",
      flexShrink: 0,
      background: dark ? "#0d1117" : "#ffffff",
    }}
  >
    <button
      onClick={() => handleSave(isEdit)}
      disabled={
        saving ||
        saved ||
        !form.teamName ||
        !form.projectTitle
      }
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.65rem 1rem",
        background:
          saving || saved
            ? "#6d28d9"
            : "linear-gradient(to right, #7c3aed, #8b5cf6)",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "0.875rem",
        borderRadius: "0.75rem",
        border: "none",
        cursor:
          saving ||
          saved ||
          !form.teamName ||
          !form.projectTitle
            ? "not-allowed"
            : "pointer",
        opacity:
          !form.teamName || !form.projectTitle
            ? 0.5
            : 1,
        boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
      }}
    >
      {saving ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Saving...
        </>
      ) : saved ? (
        <>
          <CheckCircle2 size={14} />
          Saved!
        </>
      ) : isEdit ? (
        "Save Changes"
      ) : (
        "Add Team"
      )}
    </button>
  </div>
</motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Team Management" subtitle={`${teams.length} teams registered`}>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-violet-400 transition-all">
          <Plus size={15} /> Add Team
        </button>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..."
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border ${dark ? "bg-white/5 border-white/10 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900"}`} />
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((team, i) => (
          <motion.div key={team.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`p-5 rounded-xl border transition-all ${dark ? "bg-white/[0.03] border-white/[0.07] hover:border-violet-500/25" : "bg-white border-slate-200 shadow-sm hover:shadow-md"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center text-base font-bold text-white">
                  {team.teamName?.charAt(0)}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{team.teamName}</h3>
                  <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{team.projectTitle}</p>
                </div>
              </div>
              {team.rank > 0 && <RankBadge rank={team.rank} />}
            </div>
            <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {team.description || "No description."}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(Array.isArray(team.techStack) ? team.techStack : (team.techStack || "").split(","))
                .slice(0, 4).map(t => (
                  <span key={t} className={`px-2 py-0.5 text-xs rounded-md border ${dark ? "bg-white/5 border-white/[0.08] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                    {t.trim()}
                  </span>
                ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={team.submissionStatus} />
                {team.score > 0 && <span className="text-xs font-bold text-emerald-500">{team.score} pts</span>}
              </div>
              <div className="flex items-center gap-1">
                {team.githubUrl && <a href={team.githubUrl} target="_blank" rel="noreferrer" className={`p-1.5 rounded-md ${dark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}><Github size={13} /></a>}
                {team.demoUrl   && <a href={team.demoUrl}   target="_blank" rel="noreferrer" className={`p-1.5 rounded-md ${dark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}><ExternalLink size={13} /></a>}
                <button onClick={() => openEdit(team)} className={`p-1.5 rounded-md transition-colors ${dark ? "text-slate-400 hover:text-violet-400 hover:bg-violet-400/10" : "text-slate-400 hover:text-violet-600"}`}><Edit2 size={13} /></button>
                <button onClick={() => setDeleteTarget(team)} className={`p-1.5 rounded-md transition-colors ${dark ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10" : "text-slate-400 hover:text-red-500"}`}><Trash2 size={13} /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className={`col-span-full py-16 text-center text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No teams found.</div>
        )}
      </div>

      {/* Modals */}
      <TeamModal open={addOpen}      onClose={() => setAddOpen(false)}    isEdit={false} />
      <TeamModal open={!!editTarget} onClose={() => setEditTarget(null)}  isEdit={true}  />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => deleteTeam(deleteTarget?.id)}
        title="Delete Team?"
        message={`Delete "${deleteTarget?.teamName}"? This cannot be undone.`}
        confirmLabel="Delete Team"
      />
    </div>
  );
}