import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Zap, Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Confetti } from '../components/Confetti';
import { quizQuestions, users } from '../data/mockData';

const QUESTION_TIME = 20;
const R = 54;
const CIRCUMFERENCE = 2 * Math.PI * R;

const liveLeaderboard = [
  { ...users[0], score: 40, answers: 4 },
  { ...users[2], score: 30, answers: 3 },
  { ...users[1], score: 30, answers: 3 },
  { id: 0, name: 'You (Alex)', avatar: 'AR', color: '#2F80ED', score: 20, answers: 2, badge: 'You' },
  { ...users[3], score: 20, answers: 2 },
];

type AnswerState = null | 'correct' | 'wrong';

export default function QuizArena() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState(liveLeaderboard);

  const question = quizQuestions[currentQ];
  const progress = ((currentQ) / quizQuestions.length) * 100;
  const timerPercent = timeLeft / QUESTION_TIME;
  const offset = CIRCUMFERENCE * (1 - timerPercent);
  const timerColor = timeLeft > 10 ? '#2F80ED' : timeLeft > 5 ? '#FACC15' : '#FB7185';
  const isUrgent = timeLeft <= 5;

  const goNext = useCallback(() => {
    if (currentQ + 1 >= quizQuestions.length) {
      setIsFinished(true);
      if (correct >= 3) setShowConfetti(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setAnswerState(null);
      setTimeLeft(QUESTION_TIME);
    }
  }, [currentQ, correct]);

  const handleAnswer = (idx: number) => {
    if (selected !== null || !quizStarted) return;
    setSelected(idx);
    const isCorrect = idx === question.correct;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrect(prev => prev + 1);
      // Update leaderboard
      setLeaderboard(prev => prev.map(u =>
        u.id === 0 ? { ...u, score: u.score + 10 } : u
      ).sort((a, b) => b.score - a.score));
    }
    setTimeout(goNext, 1800);
  };

  useEffect(() => {
    if (!quizStarted || selected !== null || isFinished) return;
    if (timeLeft <= 0) {
      setAnswerState('wrong');
      setSelected(-1);
      setTimeout(goNext, 1500);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected, quizStarted, isFinished, goNext]);

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswerState(null);
    setTimeLeft(QUESTION_TIME);
    setScore(0);
    setCorrect(0);
    setIsFinished(false);
    setShowConfetti(false);
    setLeaderboard(liveLeaderboard);
    setQuizStarted(false);
  };

  const getOptionStyle = (idx: number) => {
    if (selected === null) return {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(226,232,240,0.85)',
    };
    if (idx === question.correct) return {
      background: 'rgba(52,211,153,0.12)',
      border: '1px solid rgba(52,211,153,0.5)',
      color: '#34D399',
      boxShadow: '0 0 20px rgba(52,211,153,0.2)',
    };
    if (idx === selected && idx !== question.correct) return {
      background: 'rgba(251,113,133,0.12)',
      border: '1px solid rgba(251,113,133,0.5)',
      color: '#FB7185',
      boxShadow: '0 0 20px rgba(251,113,133,0.2)',
    };
    return {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      color: 'rgba(226,232,240,0.3)',
    };
  };

  if (!quizStarted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: 480 }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>⚡</div>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif', color: 'white',
            fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px',
          }}>
            DSA Battle Royale
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', marginBottom: 24, lineHeight: 1.6 }}>
            {quizQuestions.length} questions • 20 seconds each • 10 XP per correct answer
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
            {[
              { icon: '🏆', label: 'Prize', value: '100 XP' },
              { icon: '👥', label: 'Players', value: '28' },
              { icon: '⏱️', label: 'Duration', value: '~10 min' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '12px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>{s.value}</div>
                <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setQuizStarted(true)}
            style={{
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              border: 'none', borderRadius: '14px',
              padding: '14px 40px',
              color: 'white', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(47,128,237,0.5)',
              display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
            }}
          >
            <Zap size={18} /> Start Quiz Battle
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((correct / quizQuestions.length) * 100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: 500, width: '100%' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 8 }}>
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎯' : '📚'}
          </div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '1.5rem', margin: '0 0 6px' }}>
            {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', marginBottom: 24 }}>
            Quiz complete! Here's your performance.
          </p>

          {/* Result Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Score', value: `${score}`, icon: '⭐', color: '#FACC15' },
              { label: 'Correct', value: `${correct}/${quizQuestions.length}`, icon: '✅', color: '#34D399' },
              { label: 'Accuracy', value: `${percentage}%`, icon: '🎯', color: '#2F80ED' },
            ].map(s => (
              <div key={s.label} style={{
                background: `${s.color}10`, border: `1px solid ${s.color}30`,
                borderRadius: '12px', padding: '14px',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                <div style={{ color: s.color, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif' }}>{s.value}</div>
                <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP Earned */}
          <div style={{
            background: 'rgba(123,97,255,0.1)', border: '1px solid rgba(123,97,255,0.25)',
            borderRadius: '12px', padding: '14px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Zap size={20} style={{ color: '#7B61FF' }} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
              +{score} XP Earned!
            </span>
            <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.8rem' }}>
              Added to your profile
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={resetQuiz}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '10px 20px',
                color: 'rgba(226,232,240,0.7)', cursor: 'pointer', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <RotateCcw size={14} /> Try Again
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              border: 'none', borderRadius: '12px', padding: '10px 20px',
              color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Trophy size={14} /> View Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.75rem' }}>
            Question {currentQ + 1} of {quizQuestions.length}
          </span>
          <span style={{ color: '#FACC15', fontSize: '0.75rem', fontWeight: 600 }}>
            Score: {score} XP
          </span>
        </div>
        <div style={{
          height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${((currentQ) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2F80ED, #7B61FF)',
              borderRadius: 3,
              boxShadow: '0 0 8px rgba(47,128,237,0.5)',
            }}
          />
        </div>
      </div>

      <div className="quiz-arena-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Quiz Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Timer + Subject */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Timer Ring */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width={124} height={124} viewBox="0 0 124 124">
                <circle cx={62} cy={62} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
                <motion.circle
                  cx={62} cy={62} r={R}
                  fill="none" stroke={timerColor} strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  transform="rotate(-90 62 62)"
                  style={{
                    filter: `drop-shadow(0 0 8px ${timerColor})`,
                    transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                  }}
                />
                {isUrgent && (
                  <circle
                    cx={62} cy={62} r={R + 5}
                    fill="none" stroke={timerColor} strokeWidth={1} opacity={0.3}
                    style={{ animation: 'pulse 0.5s ease-in-out infinite' }}
                  />
                )}
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <motion.p
                  key={timeLeft}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  style={{
                    color: timerColor,
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '1.6rem', fontWeight: 800, lineHeight: 1,
                    filter: `drop-shadow(0 0 6px ${timerColor})`,
                  }}
                >
                  {timeLeft}
                </motion.p>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.6rem' }}>seconds</p>
              </div>
            </div>

            {/* Subject Badge & Question Info */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(47,128,237,0.12)',
                border: '1px solid rgba(47,128,237,0.3)',
                borderRadius: '20px', padding: '4px 12px', marginBottom: 8,
              }}>
                <Zap size={12} style={{ color: '#2F80ED' }} />
                <span style={{ color: '#2F80ED', fontSize: '0.72rem', fontWeight: 600 }}>
                  {question.subject}
                </span>
              </div>
              <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem' }}>
                {isUrgent ? '⚠️ Hurry up!' : timeLeft <= 10 ? '⏰ Running out!' : '🧠 Think carefully...'}
              </p>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '20px',
                padding: '28px',
              }}
            >
              <p style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                lineHeight: 1.5,
                margin: '0 0 24px',
              }}>
                {question.question}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={selected === null ? { x: 4 } : {}}
                    whileTap={selected === null ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    style={{
                      ...getOptionStyle(idx),
                      borderRadius: '12px',
                      padding: '14px 18px',
                      cursor: selected === null ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        width: 26, height: 26,
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                        color: 'inherit',
                      }}>
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{option}</span>
                    </div>
                    {selected !== null && idx === question.correct && (
                      <CheckCircle size={18} style={{ color: '#34D399', flexShrink: 0 }} />
                    )}
                    {selected === idx && idx !== question.correct && (
                      <XCircle size={18} style={{ color: '#FB7185', flexShrink: 0 }} />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Answer Feedback */}
              <AnimatePresence>
                {answerState && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: 16,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: answerState === 'correct' ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
                      border: `1px solid ${answerState === 'correct' ? 'rgba(52,211,153,0.3)' : 'rgba(251,113,133,0.3)'}`,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {answerState === 'correct'
                      ? <><CheckCircle size={16} style={{ color: '#34D399' }} /><span style={{ color: '#34D399', fontSize: '0.85rem', fontWeight: 600 }}>Correct! +10 XP</span></>
                      : <><XCircle size={16} style={{ color: '#FB7185' }} /><span style={{ color: '#FB7185', fontSize: '0.85rem', fontWeight: 600 }}>Wrong! The answer was "{question.options[question.correct]}"</span></>
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Leaderboard */}
        <div>
          <GlassCard className="p-4" animate={false} hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Trophy size={14} style={{ color: '#FACC15' }} />
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Live Scores</p>
              <div style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3,
                background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)',
                borderRadius: '10px', padding: '2px 8px',
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FB7185', boxShadow: '0 0 4px #FB7185' }} />
                <span style={{ color: '#FB7185', fontSize: '0.6rem', fontWeight: 600 }}>LIVE</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leaderboard.map((player, i) => {
                const isYou = player.id === 0;
                return (
                  <motion.div
                    key={player.id}
                    layout
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: '10px',
                      background: isYou ? 'rgba(47,128,237,0.1)' : 'rgba(255,255,255,0.02)',
                      border: isYou ? '1px solid rgba(47,128,237,0.25)' : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <span style={{
                      width: 18, textAlign: 'center', flexShrink: 0,
                      color: i === 0 ? '#FACC15' : 'rgba(226,232,240,0.4)',
                      fontSize: i === 0 ? '0.9rem' : '0.72rem',
                      fontWeight: 700,
                    }}>
                      {i === 0 ? '👑' : `#${i + 1}`}
                    </span>
                    <div style={{
                      width: 26, height: 26, borderRadius: '8px',
                      background: player.color + '30', border: `1px solid ${player.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, color: player.color,
                      flexShrink: 0,
                    }}>
                      {player.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: isYou ? '#2F80ED' : 'rgba(226,232,240,0.85)',
                        fontSize: '0.75rem', fontWeight: isYou ? 600 : 400,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        margin: 0,
                      }}>
                        {player.name.split(' ')[0]}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{
                        color: '#FACC15', fontSize: '0.8rem', fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif', margin: 0,
                      }}>
                        {player.score}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Questions Progress */}
            <div style={{ marginTop: 14, padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem', marginBottom: 6 }}>
                Questions answered by you
              </p>
              <div style={{ display: 'flex', gap: 4 }}>
                {quizQuestions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: i < currentQ
                      ? (i < correct ? '#34D399' : '#FB7185')
                      : i === currentQ ? 'rgba(47,128,237,0.5)' : 'rgba(255,255,255,0.06)',
                    boxShadow: i < currentQ && i < correct ? '0 0 4px #34D399' : 'none',
                  }} />
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
