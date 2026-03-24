import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GradientButton } from "../components/GradientButton";
import { FloatingCard } from "../components/FloatingCard";
import {
  ArrowLeft,
  Play,
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Users
} from "lucide-react";

interface QuizProps {
  onBack: () => void;
}

export function Quiz({ onBack }: QuizProps) {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "results">("lobby");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1
    },
    {
      question: "Which data structure uses LIFO?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correct: 1
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
      correct: 1
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah J.", score: 2850, avatar: "S", color: "from-[#FFC72C] to-[#FFD154]" },
    { rank: 2, name: "Mike R.", score: 2720, avatar: "M", color: "from-[#C0C0C0] to-[#E8E8E8]" },
    { rank: 3, name: "You", score: 2680, avatar: "😊", color: "from-[#CD7F32] to-[#E8A87C]" },
    { rank: 4, name: "Priya K.", score: 2540, avatar: "P", color: "from-[#0047BA] to-[#0056D6]" },
    { rank: 5, name: "Alex M.", score: 2430, avatar: "A", color: "from-[#6FDA44] to-[#5BC936]" }
  ];

  useEffect(() => {
    if (gameState === "playing" && !showFeedback) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        handleAnswer(null);
      }
    }
  }, [timeLeft, gameState, showFeedback]);

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 100);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(15);
      } else {
        setShowConfetti(true);
        setTimeout(() => {
          setGameState("results");
        }, 2000);
      }
    }, 2000);
  };

  const startQuiz = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] relative overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3"
                style={{
                  backgroundColor: ["#0047BA", "#6FDA44", "#EC008C", "#FFC72C"][Math.floor(Math.random() * 4)],
                  borderRadius: Math.random() > 0.5 ? "50%" : "0%"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold">Live Quiz Arena</h1>
            <p className="text-sm text-gray-600">Test your knowledge in real-time</p>
          </div>
        </div>

        {gameState === "playing" && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent">
                {score}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Lobby */}
          {gameState === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-8xl mb-4"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
                <p className="text-gray-600 text-lg">Answer questions quickly to earn more points!</p>
              </div>

              <FloatingCard className="mb-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0047BA] to-[#0056D6] flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Fast-Paced</h3>
                    <p className="text-sm text-gray-600">15 seconds per question</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC008C] to-[#FF1A9E] flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Competitive</h3>
                    <p className="text-sm text-gray-600">Climb the leaderboard</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6FDA44] to-[#5BC936] flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Social</h3>
                    <p className="text-sm text-gray-600">Play with friends</p>
                  </div>
                </div>
              </FloatingCard>

              <div className="flex justify-center">
                <GradientButton variant="primary" size="lg" onClick={startQuiz}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </GradientButton>
              </div>

              {/* Mini Leaderboard Preview */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4 text-center">Top Players This Week</h3>
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
                  {leaderboard.slice(0, 3).map((player) => (
                    <FloatingCard key={player.rank} className={player.rank === 2 ? "order-first md:order-none" : player.rank === 1 ? "md:-mt-4" : ""}>
                      <div className="text-center">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-white text-3xl mx-auto mb-3 shadow-lg`}>
                          {player.avatar}
                        </div>
                        <div className="text-3xl mb-2">{player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}</div>
                        <h4 className="font-semibold mb-1">{player.name}</h4>
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent">
                          {player.score.toLocaleString()}
                        </p>
                      </div>
                    </FloatingCard>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Playing */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl mx-auto"
            >
              {/* Timer Ring */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#timer-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "352", strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: 352 * (1 - timeLeft / 15) }}
                      transition={{ duration: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0047BA" />
                        <stop offset="100%" stopColor="#EC008C" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-3xl font-bold">{timeLeft}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0047BA] to-[#EC008C]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <FloatingCard className="mb-6" hoverable={false}>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {questions[currentQuestion].question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    const isCorrect = index === questions[currentQuestion].correct;
                    const isSelected = selectedAnswer === index;
                    
                    let buttonClass = "bg-white border-2 border-gray-200 hover:border-[#0047BA] hover:bg-blue-50";
                    if (showFeedback) {
                      if (isCorrect) {
                        buttonClass = "bg-gradient-to-br from-[#6FDA44] to-[#5BC936] text-white border-[#6FDA44]";
                      } else if (isSelected && !isCorrect) {
                        buttonClass = "bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-[#EF4444]";
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        className={`p-6 rounded-2xl transition-all text-left font-medium ${buttonClass} flex items-center justify-between`}
                      >
                        <span>{option}</span>
                        {showFeedback && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                        {showFeedback && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                      </motion.button>
                    );
                  })}
                </div>
              </FloatingCard>

              {/* Immediate Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    {selectedAnswer === questions[currentQuestion].correct ? (
                      <div className="text-2xl">
                        🎉 Correct! <span className="text-[#6FDA44]">+100 points</span>
                      </div>
                    ) : (
                      <div className="text-2xl">
                        😅 Oops! Better luck next time
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results */}
          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>

              <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-gray-600 text-lg mb-8">Here's how you did</p>

              <FloatingCard className="mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent mb-2">
                    {score}
                  </div>
                  <p className="text-gray-600 mb-4">Total Points</p>
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Top 15% of players!</span>
                  </div>
                </div>
              </FloatingCard>

              <div className="flex gap-4 justify-center">
                <GradientButton variant="primary" size="lg" onClick={startQuiz}>
                  Play Again
                </GradientButton>
                <GradientButton variant="secondary" size="lg" onClick={onBack}>
                  Back to Dashboard
                </GradientButton>
              </div>

              {/* Full Leaderboard */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Leaderboard</h3>
                <FloatingCard hoverable={false}>
                  <div className="space-y-3">
                    {leaderboard.map((player, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          player.name === "You" ? "bg-gradient-to-r from-blue-50 to-pink-50 border-2 border-[#0047BA]" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-400 w-8">
                          #{player.rank}
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-white text-lg`}>
                          {player.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{player.name}</div>
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent">
                          {player.score.toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </FloatingCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
