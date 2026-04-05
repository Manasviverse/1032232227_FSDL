import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, avatar } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      avatar,
    });
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        color: user.color,
        role: user.role,
        level: user.level,
        xp: user.xp,
        totalXP: user.totalXP,
        rank: user.rank,
        badge: user.badge,
        badgeColor: user.badgeColor,
        streak: user.streak,
        quizWins: user.quizWins,
        resourcesShared: user.resourcesShared,
        joinedRooms: user.joinedRooms,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        color: user.color,
        role: user.role,
        level: user.level,
        xp: user.xp,
        totalXP: user.totalXP,
        rank: user.rank,
        badge: user.badge,
        badgeColor: user.badgeColor,
        streak: user.streak,
        quizWins: user.quizWins,
        resourcesShared: user.resourcesShared,
        joinedRooms: user.joinedRooms,
      },
    });
  } catch (err) {
    next(err);
  }
};
