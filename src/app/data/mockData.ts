export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  color: string;
  level: number;
  xp: number;
  totalXP: number;
  rank: number;
  badge: string;
  badgeColor: string;
  streak: number;
  quizWins: number;
  resourcesShared: number;
  joinedRooms: number;
}

export interface StudyRoom {
  id: number;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  resources: number;
  hasQuiz: boolean;
  tags: string[];
  gradient: string;
  icon: string;
  description: string;
  activeNow: boolean;
  memberAvatars: { initials: string; color: string }[];
}

export interface Resource {
  id: number;
  title: string;
  type: 'PDF' | 'Notes' | 'Video' | 'Code' | 'Slides';
  subject: string;
  uploader: string;
  uploaderColor: string;
  uploaderInitials: string;
  downloads: number;
  likes: number;
  tags: string[];
  uploadedAt: string;
  size: string;
}

export interface Activity {
  id: number;
  user: string;
  userInitials: string;
  userColor: string;
  action: string;
  target: string;
  time: string;
  type: 'upload' | 'quiz' | 'join' | 'solve' | 'achievement' | 'streak';
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 1, name: "Apurva Sharma", username: "@apurva_s", avatar: "AS", color: "#7B61FF", level: 42, xp: 8420, totalXP: 10000, rank: 1, badge: "Quiz Master", badgeColor: "#FACC15", streak: 28, quizWins: 47, resourcesShared: 23, joinedRooms: 8 },
  { id: 2, name: "Nirupam Surse", username: "@nirupam_d", avatar: "ND", color: "#2F80ED", level: 38, xp: 7650, totalXP: 10000, rank: 2, badge: "Scholar", badgeColor: "#2DD4BF", streak: 21, quizWins: 39, resourcesShared: 31, joinedRooms: 6 },
  { id: 3, name: "Kavya Reddy", username: "@kavya_r", avatar: "KR", color: "#2DD4BF", level: 35, xp: 6890, totalXP: 10000, rank: 3, badge: "Top Contributor", badgeColor: "#7B61FF", streak: 15, quizWins: 28, resourcesShared: 45, joinedRooms: 9 },
  { id: 4, name: "Rohit Verma", username: "@rohit_v", avatar: "RV", color: "#FACC15", level: 32, xp: 6120, totalXP: 10000, rank: 4, badge: "Speed Solver", badgeColor: "#2F80ED", streak: 12, quizWins: 22, resourcesShared: 18, joinedRooms: 5 },
  { id: 5, name: "Priya Singh", username: "@priya_s", avatar: "PS", color: "#FB7185", level: 29, xp: 5430, totalXP: 10000, rank: 5, badge: "Rising Star", badgeColor: "#FB7185", streak: 9, quizWins: 15, resourcesShared: 27, joinedRooms: 7 },
  { id: 6, name: "Aditya Kumar", username: "@aditya_k", avatar: "AK", color: "#F97316", level: 26, xp: 4780, totalXP: 10000, rank: 6, badge: "Problem Solver", badgeColor: "#F97316", streak: 7, quizWins: 12, resourcesShared: 15, joinedRooms: 4 },
  { id: 7, name: "Meera Nair", username: "@meera_n", avatar: "MN", color: "#A78BFA", level: 24, xp: 4320, totalXP: 10000, rank: 7, badge: "Consistent", badgeColor: "#A78BFA", streak: 5, quizWins: 9, resourcesShared: 20, joinedRooms: 6 },
  { id: 8, name: "Sagar Patel", username: "@sagar_p", avatar: "SP", color: "#34D399", level: 22, xp: 3890, totalXP: 10000, rank: 8, badge: "Note Keeper", badgeColor: "#34D399", streak: 4, quizWins: 7, resourcesShared: 34, joinedRooms: 3 },
  { id: 9, name: "Divya Iyer", username: "@divya_i", avatar: "DI", color: "#F472B6", level: 19, xp: 3210, totalXP: 10000, rank: 9, badge: "Explorer", badgeColor: "#F472B6", streak: 3, quizWins: 5, resourcesShared: 12, joinedRooms: 5 },
  { id: 10, name: "Karan Mehta", username: "@karan_m", avatar: "KM", color: "#38BDF8", level: 17, xp: 2760, totalXP: 10000, rank: 10, badge: "Newcomer", badgeColor: "#38BDF8", streak: 2, quizWins: 3, resourcesShared: 8, joinedRooms: 2 },
];

export const currentUser: User = {
  id: 0, name: "You (Alex Ray)", username: "@alex_r", avatar: "AR", color: "#2F80ED",
  level: 31, xp: 5800, totalXP: 7000, rank: 4, badge: "Scholar+", badgeColor: "#7B61FF",
  streak: 14, quizWins: 19, resourcesShared: 22, joinedRooms: 6,
};

// ─── Study Rooms ──────────────────────────────────────────────────────────────
export const studyRooms: StudyRoom[] = [
  {
    id: 1, name: "Advanced Mathematics", subject: "Mathematics", members: 12, maxMembers: 20,
    resources: 34, hasQuiz: true, tags: ["Calculus", "Linear Algebra", "Stats"],
    gradient: "linear-gradient(135deg, #2F80ED, #7B61FF)", icon: "📐",
    description: "Deep dive into advanced math topics with weekly problem sets and quiz battles.",
    activeNow: true,
    memberAvatars: [
      { initials: "AS", color: "#7B61FF" }, { initials: "ND", color: "#2F80ED" },
      { initials: "KR", color: "#2DD4BF" }, { initials: "RV", color: "#FACC15" },
    ],
  },
  {
    id: 2, name: "Machine Learning Hub", subject: "AI / ML", members: 8, maxMembers: 15,
    resources: 21, hasQuiz: false, tags: ["Neural Networks", "Python", "PyTorch"],
    gradient: "linear-gradient(135deg, #7B61FF, #F472B6)", icon: "🤖",
    description: "Collaborative space for ML enthusiasts. Share models, papers, and code.",
    activeNow: true,
    memberAvatars: [
      { initials: "PS", color: "#FB7185" }, { initials: "AK", color: "#F97316" },
      { initials: "MN", color: "#A78BFA" },
    ],
  },
  {
    id: 3, name: "DBMS Study Group", subject: "CS Core", members: 15, maxMembers: 20,
    resources: 18, hasQuiz: true, tags: ["SQL", "Normalization", "Indexing"],
    gradient: "linear-gradient(135deg, #2DD4BF, #2F80ED)", icon: "🗄️",
    description: "Master database concepts with hands-on practice and mock exams.",
    activeNow: false,
    memberAvatars: [
      { initials: "SP", color: "#34D399" }, { initials: "DI", color: "#F472B6" },
      { initials: "KM", color: "#38BDF8" },
    ],
  },
  {
    id: 4, name: "Computer Networks", subject: "CS Core", members: 6, maxMembers: 10,
    resources: 12, hasQuiz: false, tags: ["TCP/IP", "Routing", "Security"],
    gradient: "linear-gradient(135deg, #FACC15, #F97316)", icon: "🌐",
    description: "Networking protocols, concepts and exam preparation.",
    activeNow: true,
    memberAvatars: [
      { initials: "ND", color: "#2F80ED" }, { initials: "KR", color: "#2DD4BF" },
    ],
  },
  {
    id: 5, name: "Data Structures & Algo", subject: "CS Core", members: 18, maxMembers: 25,
    resources: 29, hasQuiz: true, tags: ["Trees", "Graphs", "DP", "Sorting"],
    gradient: "linear-gradient(135deg, #FB7185, #F97316)", icon: "🌳",
    description: "Competitive programming and DSA mastery for placements and olympiads.",
    activeNow: true,
    memberAvatars: [
      { initials: "AS", color: "#7B61FF" }, { initials: "RV", color: "#FACC15" },
      { initials: "PS", color: "#FB7185" }, { initials: "AK", color: "#F97316" },
    ],
  },
  {
    id: 6, name: "Physics Mechanics Lab", subject: "Physics", members: 9, maxMembers: 15,
    resources: 8, hasQuiz: false, tags: ["Mechanics", "Waves", "Thermodynamics"],
    gradient: "linear-gradient(135deg, #A78BFA, #F472B6)", icon: "⚛️",
    description: "Physics lab preparation and theory discussion with solved examples.",
    activeNow: false,
    memberAvatars: [
      { initials: "MN", color: "#A78BFA" }, { initials: "DI", color: "#F472B6" },
      { initials: "KM", color: "#38BDF8" },
    ],
  },
];

// ─── Resources ────────────────────────────────────────────────────────────────
export const resources: Resource[] = [
  { id: 1, title: "Linear Algebra Complete Notes", type: "PDF", subject: "Mathematics", uploader: "Apurva Sharma", uploaderColor: "#7B61FF", uploaderInitials: "AS", downloads: 234, likes: 67, tags: ["Matrices", "Eigenvalues"], uploadedAt: "2h ago", size: "4.2 MB" },
  { id: 2, title: "Neural Network Fundamentals", type: "Slides", subject: "AI/ML", uploader: "Nirupam Das", uploaderColor: "#2F80ED", uploaderInitials: "ND", downloads: 189, likes: 54, tags: ["Deep Learning", "Backprop"], uploadedAt: "5h ago", size: "12.8 MB" },
  { id: 3, title: "SQL Query Masterclass", type: "Notes", subject: "DBMS", uploader: "Kavya Reddy", uploaderColor: "#2DD4BF", uploaderInitials: "KR", downloads: 312, likes: 89, tags: ["SQL", "Joins", "Indices"], uploadedAt: "1d ago", size: "2.1 MB" },
  { id: 4, title: "Graph Algorithms in Python", type: "Code", subject: "DSA", uploader: "Rohit Verma", uploaderColor: "#FACC15", uploaderInitials: "RV", downloads: 156, likes: 42, tags: ["BFS", "DFS", "Dijkstra"], uploadedAt: "2d ago", size: "8.6 MB" },
  { id: 5, title: "TCP/IP Protocol Stack", type: "PDF", subject: "Networks", uploader: "Priya Singh", uploaderColor: "#FB7185", uploaderInitials: "PS", downloads: 98, likes: 31, tags: ["Protocols", "OSI"], uploadedAt: "3d ago", size: "3.4 MB" },
  { id: 6, title: "Dynamic Programming Patterns", type: "Notes", subject: "DSA", uploader: "Aditya Kumar", uploaderColor: "#F97316", uploaderInitials: "AK", downloads: 267, likes: 78, tags: ["DP", "Memoization"], uploadedAt: "4d ago", size: "1.8 MB" },
  { id: 7, title: "Thermodynamics Laws Video", type: "Video", subject: "Physics", uploader: "Meera Nair", uploaderColor: "#A78BFA", uploaderInitials: "MN", downloads: 143, likes: 45, tags: ["Entropy", "Heat"], uploadedAt: "5d ago", size: "245 MB" },
  { id: 8, title: "Database Normalization Guide", type: "PDF", subject: "DBMS", uploader: "Sagar Patel", uploaderColor: "#34D399", uploaderInitials: "SP", downloads: 201, likes: 59, tags: ["1NF", "2NF", "3NF"], uploadedAt: "1w ago", size: "5.7 MB" },
];

// ─── Activities ───────────────────────────────────────────────────────────────
export const activities: Activity[] = [
  { id: 1, user: "Apurva Sharma", userInitials: "AS", userColor: "#7B61FF", action: "uploaded", target: "Linear Algebra Complete Notes", time: "2 min ago", type: "upload" },
  { id: 2, user: "Nirupam Das", userInitials: "ND", userColor: "#2F80ED", action: "solved a doubt in", target: "Advanced Mathematics", time: "7 min ago", type: "solve" },
  { id: 3, user: "Kavya Reddy", userInitials: "KR", userColor: "#2DD4BF", action: "won Quiz Battle in", target: "DBMS Study Group", time: "15 min ago", type: "quiz" },
  { id: 4, user: "Rohit Verma", userInitials: "RV", userColor: "#FACC15", action: "joined", target: "Data Structures & Algo room", time: "22 min ago", type: "join" },
  { id: 5, user: "Priya Singh", userInitials: "PS", userColor: "#FB7185", action: "earned the", target: "🏆 Rising Star badge", time: "35 min ago", type: "achievement" },
  { id: 6, user: "Aditya Kumar", userInitials: "AK", userColor: "#F97316", action: "extended streak to", target: "7 days 🔥", time: "1h ago", type: "streak" },
  { id: 7, user: "Meera Nair", userInitials: "MN", userColor: "#A78BFA", action: "uploaded", target: "Thermodynamics Laws Video", time: "2h ago", type: "upload" },
  { id: 8, user: "Sagar Patel", userInitials: "SP", userColor: "#34D399", action: "solved a doubt in", target: "Computer Networks", time: "3h ago", type: "solve" },
];

// ─── Achievements ─────────────────────────────────────────────────────────────
export const achievements: Achievement[] = [
  { id: 1, name: "Quiz Master", description: "Win 50 quiz battles", icon: "🏆", color: "#FACC15", unlocked: true, rarity: "legendary" },
  { id: 2, name: "Scholar+", description: "Reach level 30", icon: "📚", color: "#7B61FF", unlocked: true, rarity: "epic" },
  { id: 3, name: "Streak Champion", description: "Maintain 14-day streak", icon: "🔥", color: "#F97316", unlocked: true, rarity: "epic" },
  { id: 4, name: "Top Contributor", description: "Share 20+ resources", icon: "⭐", color: "#2DD4BF", unlocked: true, rarity: "rare" },
  { id: 5, name: "Speed Solver", description: "Answer in under 5 seconds", icon: "⚡", color: "#2F80ED", unlocked: true, rarity: "rare" },
  { id: 6, name: "Social Butterfly", description: "Join 5+ study rooms", icon: "🦋", color: "#F472B6", unlocked: true, rarity: "common" },
  { id: 7, name: "Night Owl", description: "Study after midnight", icon: "🦉", color: "#A78BFA", unlocked: false, rarity: "rare" },
  { id: 8, name: "Perfectionist", description: "Score 100% in 10 quizzes", icon: "💎", color: "#38BDF8", unlocked: false, rarity: "legendary" },
  { id: 9, name: "Team Player", description: "Help 30 students", icon: "🤝", color: "#34D399", unlocked: false, rarity: "epic" },
  { id: 10, name: "Marathon", description: "Study 100 hours total", icon: "🏃", color: "#FB7185", unlocked: false, rarity: "epic" },
  { id: 11, name: "First Blood", description: "Win first quiz", icon: "🎯", color: "#FACC15", unlocked: true, rarity: "common" },
  { id: 12, name: "Bookworm", description: "Read 50 resources", icon: "🐛", color: "#34D399", unlocked: true, rarity: "common" },
];

// ─── Quiz Questions ───────────────────────────────────────────────────────────
export const quizQuestions: QuizQuestion[] = [
  { id: 1, question: "What is the time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], correct: 1, subject: "DSA" },
  { id: 2, question: "Which SQL clause is used to filter rows after grouping?", options: ["WHERE", "FILTER", "HAVING", "ORDER BY"], correct: 2, subject: "DBMS" },
  { id: 3, question: "What does the backpropagation algorithm compute?", options: ["Forward pass activations", "Weight gradients", "Loss function values", "Learning rate"], correct: 1, subject: "AI/ML" },
  { id: 4, question: "Which layer in OSI model handles routing?", options: ["Data Link", "Transport", "Network", "Session"], correct: 2, subject: "Networks" },
  { id: 5, question: "What is the determinant of an identity matrix?", options: ["0", "1", "-1", "Undefined"], correct: 1, subject: "Mathematics" },
];

// ─── Analytics Data ───────────────────────────────────────────────────────────
export const studyHoursData = [
  { day: "Mon", hours: 3.5, quizzes: 2 },
  { day: "Tue", hours: 4.2, quizzes: 3 },
  { day: "Wed", hours: 2.8, quizzes: 1 },
  { day: "Thu", hours: 5.1, quizzes: 4 },
  { day: "Fri", hours: 3.9, quizzes: 2 },
  { day: "Sat", hours: 6.3, quizzes: 5 },
  { day: "Sun", hours: 4.7, quizzes: 3 },
];

export const quizPerformanceData = [
  { subject: "DSA", score: 87, attempts: 12 },
  { subject: "DBMS", score: 92, attempts: 8 },
  { subject: "ML", score: 74, attempts: 6 },
  { subject: "Networks", score: 81, attempts: 9 },
  { subject: "Math", score: 95, attempts: 15 },
];

export const contributionData = [
  { name: "Notes", value: 35, color: "#2F80ED" },
  { name: "PDFs", value: 28, color: "#7B61FF" },
  { name: "Code", value: 20, color: "#2DD4BF" },
  { name: "Videos", value: 12, color: "#FACC15" },
  { name: "Slides", value: 5, color: "#FB7185" },
];

export const weeklyStats = {
  studyHours: 30.5,
  quizzesTaken: 20,
  rank: 4,
  xpEarned: 1240,
  streak: 14,
  roomsJoined: 6,
};
