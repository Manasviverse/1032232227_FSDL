import mongoose from "mongoose";

const memberAvatarSchema = new mongoose.Schema(
  { initials: String, color: String },
  { _id: false }
);

const studyRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    members: { type: Number, default: 0 },
    maxMembers: { type: Number, default: 20 },
    resources: { type: Number, default: 0 },
    hasQuiz: { type: Boolean, default: false },
    tags: [{ type: String }],
    gradient: { type: String, default: "linear-gradient(135deg, #2F80ED, #7B61FF)" },
    icon: { type: String, default: "📚" },
    description: { type: String, default: "" },
    activeNow: { type: Boolean, default: false },
    memberAvatars: [memberAvatarSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("StudyRoom", studyRoomSchema);
