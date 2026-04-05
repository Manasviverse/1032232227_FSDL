import QuizQuestion from "../models/QuizQuestion.js";

// GET /api/quiz
export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find().lean();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

// GET /api/quiz/subject/:subject
export const getBySubject = async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find({
      subject: new RegExp(req.params.subject, "i"),
    }).lean();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};
