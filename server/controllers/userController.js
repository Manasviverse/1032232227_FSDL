import User from "../models/User.js";

// GET /api/users  — leaderboard sorted by xp
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ xp: -1 }).lean();
    // Assign rank in response
    const ranked = users.map((u, i) => ({ ...u, rank: i + 1 }));
    res.json(ranked);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
// POST /api/users
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id  — only self or admin
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const forbidden = ["password", "email", "role"];
    forbidden.forEach((f) => delete req.body[f]);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
