import Achievement from "../models/Achievement.js";

// GET /api/achievements  — all global achievements
export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ userId: null }).lean();
    res.json(achievements);
  } catch (err) {
    next(err);
  }
};

// GET /api/achievements/me  (auth required)
export const getMyAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id }).lean();
    res.json(achievements);
  } catch (err) {
    next(err);
  }
};
