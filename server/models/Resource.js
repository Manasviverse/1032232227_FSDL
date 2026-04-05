import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["PDF", "Notes", "Video", "Code", "Slides"],
      required: true,
    },
    subject: { type: String, required: true },
    uploader: { type: String, required: true },
    uploaderColor: { type: String, default: "#2F80ED" },
    uploaderInitials: { type: String, default: "??" },
    uploaderRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    downloads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [String],
    uploadedAt: { type: String, default: "Just now" },
    size: { type: String, default: "Unknown" },
    fileUrl: { type: String, default: "" },
    fileType: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
