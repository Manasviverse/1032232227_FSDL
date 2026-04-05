import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    userInitials: { type: String, required: true },
    userColor: { type: String, default: "#2F80ED" },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    target: { type: String, required: true },
    time: { type: String, default: "Just now" },
    type: {
      type: String,
      enum: ["upload", "quiz", "join", "solve", "achievement", "streak"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
