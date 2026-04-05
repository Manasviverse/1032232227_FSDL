# EduSync Full-Stack Integration

Convert the EduSync React/TypeScript frontend (Vite + Tailwind) from mock data to a real Node.js + Express + MongoDB backend. An empty backend folder `/server` already exists with barebones `server.js` and `config/db.js`. All 6 data entities are identified from `mockData.ts`.

## User Review Required

> [!IMPORTANT]
> **MongoDB URI needed**: You must add your MongoDB Atlas (or local) connection string to `/server/.env`.
> After implementation, fill in: `MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/edusync`

> [!NOTE]
> **JWT Auth is added**: Register and Login will return a JWT token stored in `localStorage`. Protected routes on the backend require `Authorization: Bearer <token>`. The frontend stores the user+token in a React Context.

---

## Proposed Changes

### Backend — Config & Entry

#### [MODIFY] [server.js](file:///e:/EduSync%20Collaborative%20Learning%20Platform/server/server.js)
- Import `connectDB` from `./config/db.js`
- Mount all route groups under `/api/*`
- Add error-handler middleware at the end
- Use `process.env.PORT`

#### [MODIFY] [.env](file:///e:/EduSync%20Collaborative%20Learning%20Platform/server/.env)
- Add `MONGO_URI`, `PORT=5000`, `JWT_SECRET`

#### [MODIFY] [package.json](file:///e:/EduSync%20Collaborative%20Learning%20Platform/server/package.json)
- Add `"dev": "nodemon server.js"` and `"start": "node server.js"` scripts

---

### Backend — Models (`/server/models/`)

| File | Schema fields |
|------|--------------|
| `User.js` | name, username, email, password(hashed), avatar, color, level, xp, totalXP, rank, badge, badgeColor, streak, quizWins, resourcesShared, joinedRooms, role |
| `StudyRoom.js` | name, subject, members, maxMembers, resources, hasQuiz, tags, gradient, icon, description, activeNow, memberAvatars |
| `Resource.js` | title, type, subject, uploader, uploaderColor, uploaderInitials, downloads, likes, tags, uploadedAt, size |
| `Activity.js` | user, userInitials, userColor, action, target, time, type |
| `Achievement.js` | name, description, icon, color, unlocked, rarity, userId |
| `QuizQuestion.js` | question, options, correct, subject |

---

### Backend — Middleware (`/server/middleware/`)

#### [NEW] authMiddleware.js
- Verify `Authorization: Bearer <token>` using `jsonwebtoken`
- Attach `req.user` on success

#### [NEW] errorHandler.js
- Global error handler (status + message JSON response)

#### [NEW] logger.js
- Simple request logger (method, url, timestamp)

---

### Backend — Controllers (`/server/controllers/`)

#### [NEW] authController.js
- `register` — hash password with bcrypt, create User, return JWT
- `login` — compare hash, return JWT + user object

#### [NEW] userController.js
- `getAllUsers` — paginated leaderboard list
- `getUserById`
- `updateUser` (protected)
- `getMe` (returns logged-in user from JWT)

#### [NEW] studyRoomController.js
- Full CRUD: `getAll`, `getById`, `create` (protected), `update` (protected), `delete` (protected)

#### [NEW] resourceController.js
- `getAll` (filterable by type/subject), `getById`, `create` (protected), `delete` (protected)
- `likeResource` (protected) — increments likes

#### [NEW] activityController.js
- `getAll` (latest 20), `create` (protected)

#### [NEW] achievementController.js
- `getAll`, `getUserAchievements` (protected)

#### [NEW] quizController.js
- `getAll`, `getBySubject`

#### [NEW] analyticsController.js
- `getWeeklyStats` (protected) — returns studyHours, quizzes, rank, xp, streak, roomsJoined per user
- `getStudyHoursData`, `getQuizPerformance`, `getContributionData`

---

### Backend — Routes (`/server/routes/`)

#### [NEW] authRoutes.js — `/api/auth`
- `POST /register`, `POST /login`

#### [NEW] userRoutes.js — `/api/users`
- `GET /`, `GET /me` (auth), `GET /:id`, `PUT /:id` (auth)

#### [NEW] studyRoomRoutes.js — `/api/study-rooms`
- `GET /`, `GET /:id`, `POST /` (auth), `PUT /:id` (auth), `DELETE /:id` (auth)

#### [NEW] resourceRoutes.js — `/api/resources`
- `GET /`, `GET /:id`, `POST /` (auth), `DELETE /:id` (auth), `PUT /:id/like` (auth)

#### [NEW] activityRoutes.js — `/api/activities`
- `GET /`, `POST /` (auth)

#### [NEW] achievementRoutes.js — `/api/achievements`
- `GET /`, `GET /me` (auth)

#### [NEW] quizRoutes.js — `/api/quiz`
- `GET /`, `GET /subject/:subject`

#### [NEW] analyticsRoutes.js — `/api/analytics`
- `GET /weekly-stats` (auth), `GET /study-hours`, `GET /quiz-performance`, `GET /contributions`

---

### Backend — Seed Script

#### [NEW] scripts/seed.js
- Seeds all mock data (users with hashed passwords, study rooms, resources, activities, achievements, quiz questions) into MongoDB

---

### Frontend — API Service Layer (`/src/app/services/`)

#### [NEW] api.ts
- Base `apiFetch(endpoint, options)` wrapper
- Attaches `Authorization: Bearer <token>` from localStorage
- Handles 401 (logout user)

#### [NEW] authService.ts — `register()`, `login()`
#### [NEW] userService.ts — `getUsers()`, `getMe()`, `updateMe()`
#### [NEW] studyRoomService.ts — `getRooms()`, `getRoomById()`, `createRoom()`
#### [NEW] resourceService.ts — `getResources()`, `likeResource()`
#### [NEW] activityService.ts — `getActivities()`
#### [NEW] analyticsService.ts — `getWeeklyStats()`, `getStudyHours()`, `getQuizPerformance()`, `getContributions()`

---

### Frontend — Auth Context

#### [NEW] src/app/context/AuthContext.tsx
- Holds `user`, `token`, `isAuthenticated`
- Exposes `login()`, `logout()`, `register()`
- Loads token from localStorage on mount

#### [MODIFY] src/main.tsx
- Wrap app in `<AuthProvider>`

#### [MODIFY] src/app/App.tsx or routes.tsx
- Show `<Auth>` page if not authenticated

---

### Frontend — Page Integration

All pages below: replace mock data imports with API service calls, add loading spinner state, add error state.

#### [MODIFY] Auth.tsx — call `authService.login/register`, store token
#### [MODIFY] Dashboard.tsx — fetch study rooms + activities from API
#### [MODIFY] StudyRooms.tsx — fetch rooms list
#### [MODIFY] Resources.tsx — fetch resources list, like button calls API
#### [MODIFY] Leaderboard.tsx — fetch users list
#### [MODIFY] Analytics.tsx — fetch analytics data
#### [MODIFY] Profile.tsx — fetch current user from `/api/users/me`

---

## Verification Plan

### Automated Tests
No existing test suite found. The following manual tests cover all critical flows.

### Manual Verification Steps

**Step 1 — Start Backend:**
```
cd "e:\EduSync Collaborative Learning Platform\server"
npm run dev
```
Expect: `Server running on port 5000` and `MongoDB connected`

**Step 2 — Seed the database:**
```
cd "e:\EduSync Collaborative Learning Platform\server"
node scripts/seed.js
```
Expect: `Seeding complete` in the console.

**Step 3 — Test Auth Endpoints (use curl or Postman):**
```
POST http://localhost:5000/api/auth/register
Body: { "name":"Test User","email":"test@test.com","password":"pass1234","role":"student","avatar":"😊" }
→ Expect: { token: "...", user: {...} }

POST http://localhost:5000/api/auth/login
Body: { "email":"test@test.com","password":"pass1234" }
→ Expect: { token: "...", user: {...} }
```

**Step 4 — Test Data Endpoints:**
```
GET http://localhost:5000/api/study-rooms → array of rooms
GET http://localhost:5000/api/resources   → array of resources
GET http://localhost:5000/api/users       → array of users (leaderboard)
GET http://localhost:5000/api/quiz        → array of questions
GET http://localhost:5000/api/activities  → array of activities
```

**Step 5 — Start Frontend:**
```
cd "e:\EduSync Collaborative Learning Platform"
npm run dev
```
Open http://localhost:5173 — Auth page should appear. Register/login, then:
- Dashboard should show real rooms and activity feed
- Resources page should list real resources
- Leaderboard should show real user rankings
- Analytics page should show real chart data
- Profile page should show the logged-in user's data
