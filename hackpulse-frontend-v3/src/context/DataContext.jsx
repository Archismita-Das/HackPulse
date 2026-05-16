import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { submissionApi, leaderboardApi, teamApi, statsApi } from "../services/api";
import {
  mockSubmissions,
  allMockTeams,
  mockLeaderboard,
  mockStats,
} from "../services/mockData";

const DataContext = createContext(null);

const isDemoMode = () => localStorage.getItem("hp_token") === "demo-token";

export function DataProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);
  const [teams, setTeams]             = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats]             = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // ── Load all shared data on mount (or when auth changes) ────────────
  const loadAll = useCallback(async () => {
    setLoadingData(true);
    if (isDemoMode()) {
      // Offline / demo mode — use mock data
      setSubmissions(mockSubmissions);
      setTeams(allMockTeams);
      setLeaderboard(mockLeaderboard);
      setStats(mockStats);
      setLoadingData(false);
      return;
    }
    try {
      const [lbRes, teamsRes, statsRes] = await Promise.allSettled([
        leaderboardApi.get(),
        teamApi.getAll(),
        statsApi.getSummary(),
      ]);
      if (lbRes.status === "fulfilled") setLeaderboard(lbRes.value.data);
      if (teamsRes.status === "fulfilled") setTeams(teamsRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
    } catch {
      // If backend is down, silently fall back to mocks for display
      setLeaderboard(mockLeaderboard);
      setTeams(allMockTeams);
      setStats(mockStats);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Load submissions (admin/judge uses their own hook) ────────────────
  const loadSubmissions = useCallback(async () => {
    if (isDemoMode()) { setSubmissions(mockSubmissions); return; }
    try {
      const { data } = await submissionApi.getAll();
      setSubmissions(data);
    } catch {
      setSubmissions(mockSubmissions);
    }
  }, []);

  // ── Score a submission (called by admin panel) ────────────────────────
  const scoreSubmission = async (id, score, remarks, judgeName = "") => {
    const numScore = Number(score);
    if (!isDemoMode()) {
      try {
        await submissionApi.score(id, { score: numScore, remarks, judgeName });
      } catch (err) {
        console.error("Score API error", err);
      }
    }
    // Optimistic update in state
    setSubmissions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, score: numScore, remarks, status: "EVALUATED" } : s
      )
    );
    setLeaderboard(prev => {
      const sub = submissions.find(s => s.id === id);
      if (!sub) return prev;
      const updated = prev.map(t =>
        t.teamName === sub.teamName ? { ...t, score: numScore, status: "EVALUATED" } : t
      );
      return [...updated]
        .sort((a, b) => b.score - a.score)
        .map((t, i) => ({ ...t, rank: i + 1 }));
    });
  };

  const deleteSubmission = async (id) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  // ── Team CRUD (admin) ─────────────────────────────────────────────────
  const addTeam = async (team) => {
    if (!isDemoMode()) {
      try {
        const { data } = await teamApi.create(team);
        setTeams(prev => [...prev, data]);
        return data;
      } catch (err) { console.error(err); }
    } else {
      const newTeam = { ...team, id: Date.now(), rank: teams.length + 1, score: 0,
                        submissionStatus: "Not Submitted", remarks: "", members: team.members || [] };
      setTeams(prev => [...prev, newTeam]);
    }
  };

  const updateTeam = async (id, updates) => {
    if (!isDemoMode()) {
      try { await teamApi.update(id, updates); } catch (err) { console.error(err); }
    }
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTeam = async (id) => {
    if (!isDemoMode()) {
      try { await teamApi.delete(id); } catch (err) { console.error(err); }
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    setLeaderboard(prev => {
      const team = teams.find(t => t.id === id);
      return team ? prev.filter(t => t.teamName !== team.teamName) : prev;
    });
  };

  // ── Leaderboard score edit (admin) ────────────────────────────────────
  const updateLeaderboardScore = async (teamName, score, remarks) => {
    const numScore = Number(score);
    setLeaderboard(prev => {
      const updated = prev.map(t =>
        t.teamName === teamName ? { ...t, score: numScore, status: "EVALUATED" } : t
      );
      return [...updated]
        .sort((a, b) => b.score - a.score)
        .map((t, i) => ({ ...t, rank: i + 1 }));
    });
    setSubmissions(prev =>
      prev.map(s =>
        s.teamName === teamName
          ? { ...s, score: numScore, remarks: remarks || s.remarks, status: "EVALUATED" }
          : s
      )
    );
  };

  // ── Derived stats ─────────────────────────────────────────────────────
  const getStats = () => {
    if (stats) return stats;
    const evaluated = submissions.filter(s => s.status === "EVALUATED" && s.score);
    const avg = evaluated.length
      ? evaluated.reduce((a, b) => a + Number(b.score), 0) / evaluated.length
      : 0;
    return {
      totalParticipants: 248,
      activeTeams: teams.length,
      totalSubmissions: submissions.length,
      averageScore: Math.round(avg * 10) / 10,
    };
  };

  return (
    <DataContext.Provider value={{
      submissions, teams, leaderboard, loadingData,
      loadSubmissions, loadAll,
      scoreSubmission, deleteSubmission,
      addTeam, updateTeam, deleteTeam,
      updateLeaderboardScore,
      getStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
