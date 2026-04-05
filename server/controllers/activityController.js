import Activity from "../models/Activity.js";

// GET /api/activities  — last 20
export const getAllActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(20).lean();
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

// POST /api/activities  (auth required)
export const createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create({ ...req.body, userRef: req.user.id });
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};
