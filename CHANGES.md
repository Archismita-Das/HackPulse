# HackPulse — Dynamic Fix Changelog

## Summary
All hardcoded/mock-data workflows replaced with real backend API integration.
Demo/offline fallback retained so the app works without a running backend.

---

## Backend Changes

### Entity Changes
| File | Change |
|------|--------|
| `User.java` | Added `@ManyToOne team` FK — links a participant to their team |
| `Submission.java` | Added `judgeEmail` column — used to filter submissions per judge |
| `AuthDto.java` | `UserInfo` now includes `teamId` in login/register response |

### New Endpoints
| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| `/api/users/me` | GET | Any auth | Returns logged-in user's profile including `teamId` |
| `/api/users/me/team` | GET | PARTICIPANT | Returns full team details for the current participant |
| `/api/users` | GET | ADMIN | All users with team assignments |
| `/api/submissions/my-assignments` | GET | JUDGE | Submissions assigned to logged-in judge (by email from JWT) |
| `/api/submissions/{id}/assign-judge` | PUT | ADMIN | Assign a judge to a submission |
| `/api/teams/{teamId}/members` | POST | ADMIN | Link a user to a team |

### Updated Endpoints
| Endpoint | Change |
|----------|--------|
| `PUT /api/submissions/{id}/score` | Now takes `judgeName` from body; `judgeEmail` auto-set from JWT — no spoofing |
| `GET /api/submissions` | Now requires JUDGE or ADMIN role |

### Schema Changes (`schema.sql`)
- `users.team_id` FK added
- `submissions.judge_email` column added
- Seed data updated with `judge_email` values for all existing submissions

---

## Frontend Changes

### `src/services/api.js`
- Full rewrite: exports `authApi`, `userApi`, `teamApi`, `submissionApi`, `leaderboardApi`, `statsApi`
- Clean separation of all API calls; single axios instance with JWT interceptor

### `src/context/AuthContext.jsx`
- `user` object now stores `teamId` (from backend login response)
- Added `refreshUser()` to re-fetch user after admin team assignment
- Demo mode fallback users updated to include `teamId`

### `src/context/DataContext.jsx`
- Full rewrite: loads leaderboard, teams, stats from backend on mount
- `scoreSubmission` now calls `submissionApi.score()` before optimistic update
- `addTeam`/`updateTeam`/`deleteTeam` call real API when not in demo mode
- Graceful fallback to mock data when backend is unreachable

### Participant Pages
| File | Fix |
|------|-----|
| `ParticipantDashboard.jsx` | Calls `GET /api/users/me/team` — each participant sees **their own** team |
| `ParticipantMyTeam.jsx` | Same — fully dynamic team data |
| `ParticipantLeaderboard.jsx` | Fetches own team for "You" highlight banner dynamically |
| `ParticipantSubmit.jsx` | Submits to real team ID via `POST /api/submissions/team/{id}` |

### Judge Pages
| File | Fix |
|------|-----|
| `JudgeDashboard.jsx` | Calls `GET /api/submissions/my-assignments` — shows only **assigned** submissions based on JWT identity |
| `JudgeSubmissions.jsx` | Same filtered fetch; scoring calls real API with judge name from `user` context; team details (description, techStack, members) embedded in submission DTO |
| `JudgeLeaderboard.jsx` | Uses live `leaderboard` from DataContext |

### Admin Pages
| File | Fix |
|------|-----|
| `AdminDashboard.jsx` | Live stats from `/api/stats/summary`; pending count from live submissions |
| `AdminSubmissions.jsx` | Full CRUD against real API; loads fresh on mount |
| `AdminTeams.jsx` | Calls real `teamApi` for create/update/delete |
| `AdminLeaderboard.jsx` | Score edits call real API; delete calls `teamApi.delete` |
| `AdminUsers.jsx` | Loads from `GET /api/users`; role filter works on live data |

---

## Demo Mode Behaviour
When the backend is offline, login with any email containing:
- `admin` → admin dashboard
- `judge` → judge dashboard (email: `judge@...` maps to mock assignments)
- anything else → participant dashboard (teamId: 1 = Neural Ninjas mock)

All UI interactions work with mock data as fallback.

---

## How to Run

### Backend
```bash
cd hackpulse-backend-fixed
# 1. Create DB and seed data
mysql -u root -p < schema.sql
# 2. Start Spring Boot
mvn spring-boot:run
```

### Frontend
```bash
cd hackpulse-frontend-v3
npm install
npm run dev
# Runs on http://localhost:5173 (Vite) or http://localhost:3000
```

### Test Accounts (after seeding)
| Email | Password | Role |
|-------|----------|------|
| admin@hackpulse.io | password123 | Admin |
| anjali@hackpulse.io | password123 | Judge (assigned to teams 1, 3, 4) |
| ravi@hackpulse.io | password123 | Judge (assigned to teams 2, 5) |
| arjun@hackpulse.io | password123 | Participant — Neural Ninjas |
| aditya@hackpulse.io | password123 | Participant — ByteForge |
| rahul@hackpulse.io | password123 | Participant — Quantum Leap |
