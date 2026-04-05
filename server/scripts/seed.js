/**
 * Seed script — populates MongoDB with all mock data.
 * Run: node scripts/seed.js  (from the /server directory)
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from parent server directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

import User from "../models/User.js";
import StudyRoom from "../models/StudyRoom.js";
import Resource from "../models/Resource.js";
import Activity from "../models/Activity.js";
import Achievement from "../models/Achievement.js";
import QuizQuestion from "../models/QuizQuestion.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected for seeding");

// ── Clear collections ──────────────────────────────────────────────────────────
await Promise.all([
  User.deleteMany(),
  StudyRoom.deleteMany(),
  Resource.deleteMany(),
  Activity.deleteMany(),
  Achievement.deleteMany(),
  QuizQuestion.deleteMany(),
]);
console.log("🗑  Collections cleared");

// ── Users ─────────────────────────────────────────────────────────────────────
// Note: User pre-save hook hashes the password automatically
const usersRaw = [
  { name: "Apurva Sharma",    username: "@apurva_s",  email: "apurva@edusync.app",  password: "password123", avatar: "AS", color: "#7B61FF", level: 42, xp: 8420, totalXP: 10000, rank: 1,  badge: "Quiz Master",     badgeColor: "#FACC15", streak: 28, quizWins: 47, resourcesShared: 23, joinedRooms: 8 },
  { name: "Nirupam Surse",    username: "@nirupam_d", email: "nirupam@edusync.app", password: "password123", avatar: "ND", color: "#2F80ED", level: 38, xp: 7650, totalXP: 10000, rank: 2,  badge: "Scholar",         badgeColor: "#2DD4BF", streak: 21, quizWins: 39, resourcesShared: 31, joinedRooms: 6 },
  { name: "Kavya Reddy",      username: "@kavya_r",   email: "kavya@edusync.app",   password: "password123", avatar: "KR", color: "#2DD4BF", level: 35, xp: 6890, totalXP: 10000, rank: 3,  badge: "Top Contributor", badgeColor: "#7B61FF", streak: 15, quizWins: 28, resourcesShared: 45, joinedRooms: 9 },
  { name: "Rohit Verma",      username: "@rohit_v",   email: "rohit@edusync.app",   password: "password123", avatar: "RV", color: "#FACC15", level: 32, xp: 6120, totalXP: 10000, rank: 4,  badge: "Speed Solver",    badgeColor: "#2F80ED", streak: 12, quizWins: 22, resourcesShared: 18, joinedRooms: 5 },
  { name: "Priya Singh",      username: "@priya_s",   email: "priya@edusync.app",   password: "password123", avatar: "PS", color: "#FB7185", level: 29, xp: 5430, totalXP: 10000, rank: 5,  badge: "Rising Star",     badgeColor: "#FB7185", streak:  9, quizWins: 15, resourcesShared: 27, joinedRooms: 7 },
  { name: "Aditya Kumar",     username: "@aditya_k",  email: "aditya@edusync.app",  password: "password123", avatar: "AK", color: "#F97316", level: 26, xp: 4780, totalXP: 10000, rank: 6,  badge: "Problem Solver",  badgeColor: "#F97316", streak:  7, quizWins: 12, resourcesShared: 15, joinedRooms: 4 },
  { name: "Meera Nair",       username: "@meera_n",   email: "meera@edusync.app",   password: "password123", avatar: "MN", color: "#A78BFA", level: 24, xp: 4320, totalXP: 10000, rank: 7,  badge: "Consistent",      badgeColor: "#A78BFA", streak:  5, quizWins:  9, resourcesShared: 20, joinedRooms: 6 },
  { name: "Sagar Patel",      username: "@sagar_p",   email: "sagar@edusync.app",   password: "password123", avatar: "SP", color: "#34D399", level: 22, xp: 3890, totalXP: 10000, rank: 8,  badge: "Note Keeper",     badgeColor: "#34D399", streak:  4, quizWins:  7, resourcesShared: 34, joinedRooms: 3 },
  { name: "Divya Iyer",       username: "@divya_i",   email: "divya@edusync.app",   password: "password123", avatar: "DI", color: "#F472B6", level: 19, xp: 3210, totalXP: 10000, rank: 9,  badge: "Explorer",        badgeColor: "#F472B6", streak:  3, quizWins:  5, resourcesShared: 12, joinedRooms: 5 },
  { name: "Karan Mehta",      username: "@karan_m",   email: "karan@edusync.app",   password: "password123", avatar: "KM", color: "#38BDF8", level: 17, xp: 2760, totalXP: 10000, rank: 10, badge: "Newcomer",        badgeColor: "#38BDF8", streak:  2, quizWins:  3, resourcesShared:  8, joinedRooms: 2 },
];

const users = await User.insertMany(usersRaw);
console.log(`👥 Inserted ${users.length} users`);

// ── Study Rooms ───────────────────────────────────────────────────────────────
const rooms = await StudyRoom.insertMany([
  { name: "Advanced Mathematics",   subject: "Mathematics", members: 12, maxMembers: 20, resources: 34, hasQuiz: true,  tags: ["Calculus", "Linear Algebra", "Stats"],         gradient: "linear-gradient(135deg, #2F80ED, #7B61FF)", icon: "📐", description: "Deep dive into advanced math topics with weekly problem sets and quiz battles.",       activeNow: true,  memberAvatars: [{ initials: "AS", color: "#7B61FF" }, { initials: "ND", color: "#2F80ED" }, { initials: "KR", color: "#2DD4BF" }, { initials: "RV", color: "#FACC15" }] },
  { name: "Machine Learning Hub",   subject: "AI / ML",    members:  8, maxMembers: 15, resources: 21, hasQuiz: false, tags: ["Neural Networks", "Python", "PyTorch"],        gradient: "linear-gradient(135deg, #7B61FF, #F472B6)", icon: "🤖", description: "Collaborative space for ML enthusiasts. Share models, papers, and code.",              activeNow: true,  memberAvatars: [{ initials: "PS", color: "#FB7185" }, { initials: "AK", color: "#F97316" }, { initials: "MN", color: "#A78BFA" }] },
  { name: "DBMS Study Group",       subject: "CS Core",    members: 15, maxMembers: 20, resources: 18, hasQuiz: true,  tags: ["SQL", "Normalization", "Indexing"],             gradient: "linear-gradient(135deg, #2DD4BF, #2F80ED)", icon: "🗄️", description: "Master database concepts with hands-on practice and mock exams.",                     activeNow: false, memberAvatars: [{ initials: "SP", color: "#34D399" }, { initials: "DI", color: "#F472B6" }, { initials: "KM", color: "#38BDF8" }] },
  { name: "Computer Networks",      subject: "CS Core",    members:  6, maxMembers: 10, resources: 12, hasQuiz: false, tags: ["TCP/IP", "Routing", "Security"],               gradient: "linear-gradient(135deg, #FACC15, #F97316)", icon: "🌐", description: "Networking protocols, concepts and exam preparation.",                                    activeNow: true,  memberAvatars: [{ initials: "ND", color: "#2F80ED" }, { initials: "KR", color: "#2DD4BF" }] },
  { name: "Data Structures & Algo", subject: "CS Core",    members: 18, maxMembers: 25, resources: 29, hasQuiz: true,  tags: ["Trees", "Graphs", "DP", "Sorting"],            gradient: "linear-gradient(135deg, #FB7185, #F97316)", icon: "🌳", description: "Competitive programming and DSA mastery for placements and olympiads.",               activeNow: true,  memberAvatars: [{ initials: "AS", color: "#7B61FF" }, { initials: "RV", color: "#FACC15" }, { initials: "PS", color: "#FB7185" }, { initials: "AK", color: "#F97316" }] },
  { name: "Physics Mechanics Lab",  subject: "Physics",    members:  9, maxMembers: 15, resources:  8, hasQuiz: false, tags: ["Mechanics", "Waves", "Thermodynamics"],        gradient: "linear-gradient(135deg, #A78BFA, #F472B6)", icon: "⚛️", description: "Physics lab preparation and theory discussion with solved examples.",                  activeNow: false, memberAvatars: [{ initials: "MN", color: "#A78BFA" }, { initials: "DI", color: "#F472B6" }, { initials: "KM", color: "#38BDF8" }] },
]);
console.log(`🏠 Inserted ${rooms.length} study rooms`);

// ── Resources ─────────────────────────────────────────────────────────────────
await Resource.insertMany([
  { title: "Linear Algebra Complete Notes",  type: "PDF",    subject: "Mathematics", uploader: "Apurva Sharma", uploaderColor: "#7B61FF", uploaderInitials: "AS", downloads: 234, likes: 67, tags: ["Matrices", "Eigenvalues"],    uploadedAt: "2h ago",  size: "4.2 MB"  },
  { title: "Neural Network Fundamentals",    type: "Slides", subject: "AI/ML",       uploader: "Nirupam Surse", uploaderColor: "#2F80ED", uploaderInitials: "ND", downloads: 189, likes: 54, tags: ["Deep Learning", "Backprop"],   uploadedAt: "5h ago",  size: "12.8 MB" },
  { title: "SQL Query Masterclass",          type: "Notes",  subject: "DBMS",        uploader: "Kavya Reddy",   uploaderColor: "#2DD4BF", uploaderInitials: "KR", downloads: 312, likes: 89, tags: ["SQL", "Joins", "Indices"],     uploadedAt: "1d ago",  size: "2.1 MB"  },
  { title: "Graph Algorithms in Python",     type: "Code",   subject: "DSA",         uploader: "Rohit Verma",   uploaderColor: "#FACC15", uploaderInitials: "RV", downloads: 156, likes: 42, tags: ["BFS", "DFS", "Dijkstra"],      uploadedAt: "2d ago",  size: "8.6 MB"  },
  { title: "TCP/IP Protocol Stack",          type: "PDF",    subject: "Networks",    uploader: "Priya Singh",   uploaderColor: "#FB7185", uploaderInitials: "PS", downloads:  98, likes: 31, tags: ["Protocols", "OSI"],            uploadedAt: "3d ago",  size: "3.4 MB"  },
  { title: "Dynamic Programming Patterns",   type: "Notes",  subject: "DSA",         uploader: "Aditya Kumar",  uploaderColor: "#F97316", uploaderInitials: "AK", downloads: 267, likes: 78, tags: ["DP", "Memoization"],           uploadedAt: "4d ago",  size: "1.8 MB"  },
  { title: "Thermodynamics Laws Video",      type: "Video",  subject: "Physics",     uploader: "Meera Nair",    uploaderColor: "#A78BFA", uploaderInitials: "MN", downloads: 143, likes: 45, tags: ["Entropy", "Heat"],             uploadedAt: "5d ago",  size: "245 MB"  },
  { title: "Database Normalization Guide",   type: "PDF",    subject: "DBMS",        uploader: "Sagar Patel",   uploaderColor: "#34D399", uploaderInitials: "SP", downloads: 201, likes: 59, tags: ["1NF", "2NF", "3NF"],           uploadedAt: "1w ago",  size: "5.7 MB"  },
]);
console.log("📄 Inserted resources");

// ── Activities ────────────────────────────────────────────────────────────────
await Activity.insertMany([
  { user: "Apurva Sharma", userInitials: "AS", userColor: "#7B61FF", action: "uploaded",           target: "Linear Algebra Complete Notes",  time: "2 min ago",  type: "upload"      },
  { user: "Nirupam Surse", userInitials: "ND", userColor: "#2F80ED", action: "solved a doubt in",  target: "Advanced Mathematics",           time: "7 min ago",  type: "solve"       },
  { user: "Kavya Reddy",   userInitials: "KR", userColor: "#2DD4BF", action: "won Quiz Battle in", target: "DBMS Study Group",               time: "15 min ago", type: "quiz"        },
  { user: "Rohit Verma",   userInitials: "RV", userColor: "#FACC15", action: "joined",             target: "Data Structures & Algo room",    time: "22 min ago", type: "join"        },
  { user: "Priya Singh",   userInitials: "PS", userColor: "#FB7185", action: "earned the",         target: "🏆 Rising Star badge",           time: "35 min ago", type: "achievement" },
  { user: "Aditya Kumar",  userInitials: "AK", userColor: "#F97316", action: "extended streak to", target: "7 days 🔥",                      time: "1h ago",     type: "streak"      },
  { user: "Meera Nair",    userInitials: "MN", userColor: "#A78BFA", action: "uploaded",           target: "Thermodynamics Laws Video",      time: "2h ago",     type: "upload"      },
  { user: "Sagar Patel",   userInitials: "SP", userColor: "#34D399", action: "solved a doubt in",  target: "Computer Networks",              time: "3h ago",     type: "solve"       },
]);
console.log("📡 Inserted activities");

// ── Achievements ──────────────────────────────────────────────────────────────
await Achievement.insertMany([
  { name: "Quiz Master",      description: "Win 50 quiz battles",       icon: "🏆", color: "#FACC15", unlocked: true,  rarity: "legendary" },
  { name: "Scholar+",         description: "Reach level 30",            icon: "📚", color: "#7B61FF", unlocked: true,  rarity: "epic"      },
  { name: "Streak Champion",  description: "Maintain 14-day streak",    icon: "🔥", color: "#F97316", unlocked: true,  rarity: "epic"      },
  { name: "Top Contributor",  description: "Share 20+ resources",       icon: "⭐", color: "#2DD4BF", unlocked: true,  rarity: "rare"      },
  { name: "Speed Solver",     description: "Answer in under 5 seconds", icon: "⚡", color: "#2F80ED", unlocked: true,  rarity: "rare"      },
  { name: "Social Butterfly", description: "Join 5+ study rooms",       icon: "🦋", color: "#F472B6", unlocked: true,  rarity: "common"    },
  { name: "Night Owl",        description: "Study after midnight",      icon: "🦉", color: "#A78BFA", unlocked: false, rarity: "rare"      },
  { name: "Perfectionist",    description: "Score 100% in 10 quizzes",  icon: "💎", color: "#38BDF8", unlocked: false, rarity: "legendary" },
  { name: "Team Player",      description: "Help 30 students",          icon: "🤝", color: "#34D399", unlocked: false, rarity: "epic"      },
  { name: "Marathon",         description: "Study 100 hours total",     icon: "🏃", color: "#FB7185", unlocked: false, rarity: "epic"      },
  { name: "First Blood",      description: "Win first quiz",            icon: "🎯", color: "#FACC15", unlocked: true,  rarity: "common"    },
  { name: "Bookworm",         description: "Read 50 resources",         icon: "🐛", color: "#34D399", unlocked: true,  rarity: "common"    },
]);
console.log("🏅 Inserted achievements");

// ── Quiz Questions ────────────────────────────────────────────────────────────
await QuizQuestion.insertMany([
  { question: "What is the time complexity of Binary Search?",           options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"],                                  correct: 1, subject: "DSA"      },
  { question: "Which SQL clause is used to filter rows after grouping?", options: ["WHERE", "FILTER", "HAVING", "ORDER BY"],                                    correct: 2, subject: "DBMS"     },
  { question: "What does the backpropagation algorithm compute?",        options: ["Forward pass activations", "Weight gradients", "Loss function values", "Learning rate"], correct: 1, subject: "AI/ML" },
  { question: "Which layer in OSI model handles routing?",               options: ["Data Link", "Transport", "Network", "Session"],                             correct: 2, subject: "Networks"  },
  { question: "What is the determinant of an identity matrix?",          options: ["0", "1", "-1", "Undefined"],                                                correct: 1, subject: "Mathematics" },
]);
console.log("❓ Inserted quiz questions");

await mongoose.disconnect();
console.log("\n🌱 Seeding complete! All collections populated.");
