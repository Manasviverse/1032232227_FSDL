import User from "../models/User.js";
import Resource from "../models/Resource.js";

// GET /api/analytics/weekly-stats  (auth required)
export const getWeeklyStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      studyHours: 30.5,          // Would come from a StudySession model in full production
      quizzesTaken: user.quizWins || 0,
      rank: user.rank || 99,
      xpEarned: user.xp || 0,
      streak: user.streak || 0,
      roomsJoined: user.joinedRooms || 0,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/study-hours
export const getStudyHoursData = async (req, res, next) => {
  try {
    // In production this would aggregate StudySession records per day
    res.json([
      { day: "Mon", hours: 3.5, quizzes: 2 },
      { day: "Tue", hours: 4.2, quizzes: 3 },
      { day: "Wed", hours: 2.8, quizzes: 1 },
      { day: "Thu", hours: 5.1, quizzes: 4 },
      { day: "Fri", hours: 3.9, quizzes: 2 },
      { day: "Sat", hours: 6.3, quizzes: 5 },
      { day: "Sun", hours: 4.7, quizzes: 3 },
    ]);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/quiz-performance
export const getQuizPerformance = async (req, res, next) => {
  try {
    res.json([
      { subject: "DSA", score: 87, attempts: 12 },
      { subject: "DBMS", score: 92, attempts: 8 },
      { subject: "ML", score: 74, attempts: 6 },
      { subject: "Networks", score: 81, attempts: 9 },
      { subject: "Math", score: 95, attempts: 15 },
    ]);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/contributions
export const getContributions = async (req, res, next) => {
  try {
    // Aggregate resource types from DB
    const types = ["PDF", "Notes", "Code", "Video", "Slides"];
    const colorMap = {
      PDF: "#2F80ED",
      Notes: "#7B61FF",
      Code: "#2DD4BF",
      Video: "#FACC15",
      Slides: "#FB7185",
    };
    const results = await Promise.all(
      types.map(async (t) => ({
        name: t === "PDF" ? "PDFs" : t,
        value: await Resource.countDocuments({ type: t }),
        color: colorMap[t],
      }))
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};
