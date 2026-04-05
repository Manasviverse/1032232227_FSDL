import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "🏆" },
    color: { type: String, default: "#FACC15" },
    unlocked: { type: Boolean, default: false },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
