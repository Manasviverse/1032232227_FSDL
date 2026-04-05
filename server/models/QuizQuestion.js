import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    correct: { type: Number, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QuizQuestion", quizQuestionSchema);
