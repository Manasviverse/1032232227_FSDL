import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "😊" },
    color: { type: String, default: "#2F80ED" },
    role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    totalXP: { type: Number, default: 1000 },
    rank: { type: Number, default: 99 },
    badge: { type: String, default: "Newcomer" },
    badgeColor: { type: String, default: "#38BDF8" },
    streak: { type: Number, default: 0 },
    quizWins: { type: Number, default: 0 },
    resourcesShared: { type: Number, default: 0 },
    joinedRooms: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;

  // Support legacy/plain-text records so older seeded users can still log in.
  // Once they do, we transparently upgrade the stored password to a bcrypt hash.
  if (!this.password.startsWith("$2")) {
    const isMatch = candidate === this.password;
    if (isMatch) {
      this.password = await bcrypt.hash(candidate, 12);
      await this.save();
    }
    return isMatch;
  }

  return bcrypt.compare(candidate, this.password);
};

// Auto-generate username from name if not provided
userSchema.pre("save", function () {
  if (!this.username && this.name) {
    this.username = "@" + this.name.toLowerCase().replace(/\s+/g, "_");
  }
});

export default mongoose.model("User", userSchema);
