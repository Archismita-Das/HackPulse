import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import LandingPage    from "./pages/landing/LandingPage";
import LoginPage      from "./pages/landing/LoginPage";
import RegisterPage   from "./pages/landing/RegisterPage";

import AdminLayout       from "./components/admin/AdminLayout";
import ParticipantLayout from "./components/participant/ParticipantLayout";
import JudgeLayout       from "./components/judge/JudgeLayout";

import AdminDashboard    from "./pages/admin/AdminDashboard";
import AdminLeaderboard  from "./pages/admin/AdminLeaderboard";
import AdminTeams        from "./pages/admin/AdminTeams";
import AdminSubmissions  from "./pages/admin/AdminSubmissions";
import AdminUsers        from "./pages/admin/AdminUsers";

import ParticipantDashboard  from "./pages/participant/ParticipantDashboard";
import ParticipantMyTeam     from "./pages/participant/ParticipantMyTeam";
import ParticipantLeaderboard from "./pages/participant/ParticipantLeaderboard";
import ParticipantSubmit     from "./pages/participant/ParticipantSubmit";

import JudgeDashboard    from "./pages/judge/JudgeDashboard";
import JudgeSubmissions  from "./pages/judge/JudgeSubmissions";
import JudgeLeaderboard  from "./pages/judge/JudgeLeaderboard";

function RoleRouter() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  const role = user?.role?.toLowerCase();

  if (role === "admin") return (
    <AdminLayout>
      <Routes>
        <Route path="/admin"             element={<AdminDashboard />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
        <Route path="/admin/teams"       element={<AdminTeams />} />
        <Route path="/admin/submissions" element={<AdminSubmissions />} />
        <Route path="/admin/users"       element={<AdminUsers />} />
        <Route path="*"                  element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );

  if (role === "judge") return (
    <JudgeLayout>
      <Routes>
        <Route path="/judge"             element={<JudgeDashboard />} />
        <Route path="/judge/submissions" element={<JudgeSubmissions />} />
        <Route path="/judge/leaderboard" element={<JudgeLeaderboard />} />
        <Route path="*"                  element={<Navigate to="/judge" replace />} />
      </Routes>
    </JudgeLayout>
  );

  return (
    <ParticipantLayout>
      <Routes>
        <Route path="/dashboard"             element={<ParticipantDashboard />} />
        <Route path="/dashboard/my-team"     element={<ParticipantMyTeam />} />
        <Route path="/dashboard/leaderboard" element={<ParticipantLeaderboard />} />
        <Route path="/dashboard/submit"      element={<ParticipantSubmit />} />
        <Route path="*"                      element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ParticipantLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/"         element={<LandingPage />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/*"        element={<RoleRouter />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
