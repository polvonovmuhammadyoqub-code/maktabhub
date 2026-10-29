import React, { useState, useEffect, useRef } from 'react';
import type { QuizQuestion } from '../types';
import { 
  Gamepad2, 
  Timer, 
  Trophy, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw
} from 'lucide-react';

interface QuizArenaViewProps {
  questions: QuizQuestion[];
  onEarnCoins: (amount: number, xp: number) => void;
}

const optionColors = [
  'bg-rose-500 hover:bg-rose-600',
  'bg-blue-600 hover:bg-blue-700',
  'bg-amber-500 hover:bg-amber-600',
  'bg-emerald-600 hover:bg-emerald-700',
];

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({ questions, onEarnCoins }) => {
  const [roomCode, setRoomCode] = useState('849102');
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'answered' | 'finished'>('lobby');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Accumulated Game Stats
  const [totalScore, setTotalScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const activeQuestions = questions && questions.length > 0 ? questions : [
    {
      id: 'default-1',
      subject: 'Informatika',
      title: 'Pythonda konsolga ma’lumot chiqarish uchun qaysi standart funksiya ishlatiladi?',
      timeLimit: 15,
      points: 800,
      coinsReward: 20,
      options: [
        { id: 1, text: 'console.log()', isRight: false },
        { id: 2, text: 'print()', isRight: true },
        { id: 3, text: 'echo()', isRight: false },
        { id: 4, text: 'System.out.println()', isRight: false },
      ],
      explanation: 'Python tilida print() funksiyasi ishlatiladi.',
    }
  ];

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  const handleSelectOption = (optionId: number) => {
    setSelectedOptionId(optionId);
    const chosen = currentQ.options.find((o) => o.id === optionId);
    const right = chosen ? chosen.isRight : false;
    setIsCorrect(right);
    setGameState('answered');

    if (right) {
      const earnedScore = Math.max(400, timeLeft * 50 + currentQ.points);
      const earnedCoins = currentQ.coinsReward || 20;
      setTotalScore((prev) => prev + earnedScore);
      setTotalCoins((prev) => prev + earnedCoins);
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleSelectOptionRef = useRef(handleSelectOption);
  useEffect(() => {
    handleSelectOptionRef.current = handleSelectOption;
  });

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSelectOptionRef.current(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentIndex(0);
    setTotalScore(0);
    setTotalCoins(0);
    setCorrectCount(0);
    setGameState('playing');
    setTimeLeft(currentQ.timeLimit || 15);
    setSelectedOptionId(null);
    setIsCorrect(null);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(activeQuestions[nextIdx].timeLimit || 15);
      setSelectedOptionId(null);
      setIsCorrect(null);
      setGameState('playing');
    } else {
      // Finished all questions!
      setGameState('finished');
      if (totalCoins > 0) {
        onEarnCoins(totalCoins, Math.round(totalScore / 10));
      }
    }
  };

  const handleReset = () => {
    setGameState('lobby');
    setCurrentIndex(0);
    setTimeLeft(15);
    setSelectedOptionId(null);
    setIsCorrect(null);
    setTotalScore(0);
    setTotalCoins(0);
    setCorrectCount(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* ============================================================== */}
      {/* 1. LOBBY / PIN CODE ENTRY SCREEN                               */}
      {/* ============================================================== */}
      {gameState === 'lobby' && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500 text-white flex items-center justify-center mx-auto mb-5 shadow-xl shadow-rose-500/30">
            <Gamepad2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full border border-white/10">
            Kahoot uslubidagi Jonli Viktorina
          </span>

          <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2 tracking-tight">
            Cyber Arena xonasiga ulanish ⚡
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-md mx-auto mb-8">
            O‘qituvchi e’lon qilgan 6 xonali o‘yin PIN-kodini kiriting. O‘qituvchi va administrator tomonidan joylangan haqiqiy savollar bilan bellashing!
          </p>

          <form onSubmit={handleJoinGame} className="max-w-sm mx-auto space-y-4">
            <div>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="000 000"
                maxLength={6}
                className="w-full text-center tracking-[0.3em] font-black text-2xl sm:text-3xl py-3.5 px-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Viktorinaga kirish ({activeQuestions.length} ta savol)</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-indigo-300">
            <span>📚 Mavjud savollar: <strong className="text-white">{activeQuestions.length} ta</strong></span>
            <span>👨‍🏫 O‘qituvchi: S. Qodirov</span>
            <span>👥 Qatnashuvchilar: 18 o‘quvchi</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2 & 3. LIVE QUESTION & OPTION CARDS SCREEN                     */}
      {/* ============================================================== */}
      {(gameState === 'playing' || gameState === 'answered') && (
        <div className="space-y-6">
          
          {/* Top Bar: Progress, Timer, Subject, Coins */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-rose-100 text-rose-800">
                {currentIndex + 1} / {activeQuestions.length}-Savol
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                {currentQ.subject}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>+{currentQ.coinsReward} Tanga</span>
              </div>

              {/* Countdown Clock */}
              <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-black border transition-all ${
                timeLeft <= 5
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft} s</span>
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 text-center shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Cyber Arena Savoli
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug max-w-2xl mx-auto">
              {currentQ.title}
            </h2>
          </div>

          {/* 4 Colored Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const colorClass = optionColors[idx % optionColors.length];

              return (
                <button
                  key={opt.id}
                  disabled={gameState === 'answered'}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-6 sm:p-8 rounded-2xl text-white font-extrabold text-base sm:text-lg text-left shadow-lg transition-all flex items-center justify-between ${
                    colorClass
                  } ${
                    gameState === 'answered' && opt.isRight
                      ? 'ring-4 ring-white shadow-2xl scale-[1.02]'
                      : ''
                  } ${
                    gameState === 'answered' && isSelected && !opt.isRight
                      ? 'opacity-40 line-through'
                      : ''
                  } ${
                    gameState === 'playing' ? 'hover:scale-[1.01]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {gameState === 'answered' && opt.isRight && (
                    <CheckCircle2 className="w-7 h-7 stroke-[3] text-white" />
                  )}
                  {gameState === 'answered' && isSelected && !opt.isRight && (
                    <XCircle className="w-7 h-7 stroke-[3] text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback Banner */}
          {gameState === 'answered' && (
            <div className={`p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                : 'bg-gradient-to-r from-rose-600 to-red-700'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  {isCorrect ? <Sparkles className="w-7 h-7 text-amber-300" /> : <XCircle className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="font-black text-lg">
                    {isCorrect ? "Ajoyib natija! To‘g‘ri javob! 🎉" : "Afsuski, javob noto‘g‘ri! 😕"}
                  </h3>
                  <p className="text-xs text-white/90 mt-0.5">
                    {isCorrect
                      ? `Siz bu savoldan +${currentQ.coinsReward} Tanga jamg‘ardingiz!`
                      : `To‘g‘ri javob: ${currentQ.options.find(o => o.isRight)?.text}`}
                  </p>
                  {currentQ.explanation && (
                    <p className="text-[11px] text-white/80 mt-1.5 italic bg-white/10 px-3 py-1.5 rounded-lg inline-block">
                      💡 {currentQ.explanation}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className="px-6 py-3.5 bg-white text-slate-900 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:bg-slate-100 shrink-0"
              >
                <span>
                  {currentIndex + 1 < activeQuestions.length
                    ? `Keyingi savolga o‘tish (${currentIndex + 2}/${activeQuestions.length})`
                    : "G‘oliblar shohsupasini ko‘rish 🏆"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. FINISHED PODIUM & FINAL RESULTS SCREEN                      */}
      {/* ============================================================== */}
      {gameState === 'finished' && (
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 text-center shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              Cyber Arena Bellashuvi Yakunlandi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Ajoyib bellashuv bo‘ldi! 🏅
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Siz {activeQuestions.length} ta savoldan <strong>{correctCount} tasiga</strong> to‘g‘ri javob berdingiz va hisobingizga mukofot tangalari qo‘shildi!
            </p>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">To‘g‘ri javob</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600">{correctCount} / {activeQuestions.length}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">To‘plangan Ball</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-700">{totalScore}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Yutilgan Tanga</span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 fill-amber-500" />
                +{totalCoins}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan bellashish</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
