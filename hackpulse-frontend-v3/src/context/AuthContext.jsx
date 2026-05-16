import { createContext, useContext, useState } from "react";
import { authApi, userApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("hp_token"));
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem("hp_user") || "null"));

  const persist = (token, user) => {
    localStorage.setItem("hp_token", token);
    localStorage.setItem("hp_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      persist(data.token, data.user);
      return data.user;
    } catch (err) {
      // Demo mode fallback when backend is offline
      if (err.code === "ERR_NETWORK" || !err.response) {
        const demoUser = getDemoUser(email);
        persist("demo-token", demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await authApi.register(payload);
      persist(data.token, data.user);
      return data.user;
    } catch (err) {
      if (err.code === "ERR_NETWORK" || !err.response) {
        const demoUser = {
          name: payload.name,
          email: payload.email,
          role: (payload.role || "PARTICIPANT").toLowerCase(),
          teamId: null,
        };
        persist("demo-token", demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  /**
   * Refresh the user object from the backend.
   * Useful after admin assigns the user to a team.
   */
  const refreshUser = async () => {
    if (token === "demo-token") return;
    try {
      const { data } = await userApi.getMe();
      const updated = { ...user, ...data };
      localStorage.setItem("hp_user", JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch {
      // silently ignore
    }
  };

  const logout = () => {
    localStorage.removeItem("hp_token");
    localStorage.removeItem("hp_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Demo users for offline mode ─────────────────────────────────────
function getDemoUser(email) {
  if (email.includes("admin")) return { id: 1, name: "Admin User",   email, role: "admin",       teamId: null };
  if (email.includes("judge")) return { id: 2, name: "Judge User",   email, role: "judge",       teamId: null };
  return                               { id: 3, name: "Participant",  email, role: "participant", teamId: 1    };
}

export const useAuth = () => useContext(AuthContext);
