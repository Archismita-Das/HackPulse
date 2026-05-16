import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hp_token");
  if (token && token !== "demo-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("hp_token");
      localStorage.removeItem("hp_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────────────
export const authApi = {
  login:    (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
};

// ── Current user ─────────────────────────────────────────────────────
export const userApi = {
  getMe:     ()       => api.get("/users/me"),
  getMyTeam: ()       => api.get("/users/me/team"),
  getAll:    ()       => api.get("/users"),
};

// ── Teams ─────────────────────────────────────────────────────────────
export const teamApi = {
  getAll:   ()           => api.get("/teams"),
  getById:  (id)         => api.get(`/teams/${id}`),
  create:   (data)       => api.post("/teams", data),
  update:   (id, data)   => api.put(`/teams/${id}`, data),
  delete:   (id)         => api.delete(`/teams/${id}`),
  addMember:(teamId, userId) => api.post(`/teams/${teamId}/members`, { userId }),
};

// ── Submissions ───────────────────────────────────────────────────────
export const submissionApi = {
  getAll:           ()             => api.get("/submissions"),
  getMyAssignments: ()             => api.get("/submissions/my-assignments"),
  getByTeam:        (teamId)       => api.get(`/submissions/team/${teamId}`),
  submit:           (teamId, data) => api.post(`/submissions/team/${teamId}`, data),
  score:            (id, data)     => api.put(`/submissions/${id}/score`, data),
  assignJudge:      (id, data)     => api.put(`/submissions/${id}/assign-judge`, data),
};

// ── Leaderboard ───────────────────────────────────────────────────────
export const leaderboardApi = {
  get: () => api.get("/leaderboard"),
};

// ── Stats ─────────────────────────────────────────────────────────────
export const statsApi = {
  getSummary: () => api.get("/stats/summary"),
};

export default api;
