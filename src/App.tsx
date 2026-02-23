/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Question, Difficulty, GrammarPoint } from './types';
import { generateQuestions } from './services/geminiService';

// --- Components ---

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const variants = {
    default: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const variant = difficulty === Difficulty.Beginner ? 'success' : difficulty === Difficulty.Intermediate ? 'warning' : 'danger';
  return <Badge variant={variant}>{difficulty}</Badge>;
};

const ExplanationCard = ({ question, userAnswers, onNext }: { question: Question, userAnswers: (number | null)[], onNext: () => void }) => {
  const isCorrect = userAnswers.every((ans, idx) => ans === question.correctAnswers[idx]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
    >
      <div className={`p-4 flex items-center gap-3 ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        <h3 className="font-bold">{isCorrect ? '太棒了！回答正确' : '别灰心，再接再厉'}</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <BookOpen className="w-3 h-3" /> 语法详解
          </h4>
          <p className="text-zinc-800 leading-relaxed">{question.explanation.rule}</p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">典型例句</h4>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 italic text-zinc-700">
              "{question.explanation.example}"
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">常见错误</h4>
            <div className="p-3 bg-rose-50/30 rounded-lg border border-rose-100 text-zinc-700">
              {question.explanation.commonMistake}
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">本题解析</h4>
          <p className="text-zinc-600 text-sm">{question.explanation.analysis}</p>
        </section>

        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
          <a 
            href={`https://www.google.com/search?q=English+grammar+${question.grammarPoint}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          >
            查看更多关于 {question.grammarPoint} 的资料 <ExternalLink className="w-3 h-3" />
          </a>
          <button 
            onClick={onNext}
            className="px-6 py-2 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            下一题 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch questions from AI
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const newQuestions = await generateQuestions(5);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setIsSubmitted(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize questions
  React.useEffect(() => {
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  // Initialize user answers when question changes
  React.useEffect(() => {
    if (currentQuestion) {
      setUserAnswers(new Array(currentQuestion.options.length).fill(null));
      setIsSubmitted(false);
    }
  }, [currentIndex, currentQuestion]);

  const handleOptionSelect = (blankIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[blankIdx] = optionIdx;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (userAnswers.some(ans => ans === null)) return;
    
    const isCorrect = userAnswers.every((ans, idx) => ans === currentQuestion.correctAnswers[idx]);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  const renderSentence = () => {
    const parts = currentQuestion.sentence.split(/(\{\{\d+\}\})/);
    return (
      <div className="text-2xl md:text-3xl font-serif leading-relaxed text-zinc-800 mb-8">
        {parts.map((part, idx) => {
          const match = part.match(/\{\{(\d+)\}\}/);
          if (match) {
            const blankIdx = parseInt(match[1]);
            const selectedOptionIdx = userAnswers[blankIdx];
            const isCorrect = isSubmitted && selectedOptionIdx === currentQuestion.correctAnswers[blankIdx];
            const isWrong = isSubmitted && selectedOptionIdx !== null && selectedOptionIdx !== currentQuestion.correctAnswers[blankIdx];

            return (
              <span 
                key={idx}
                className={`
                  inline-block min-w-[120px] border-b-2 mx-2 px-2 text-center transition-all duration-300
                  ${!isSubmitted && selectedOptionIdx === null ? 'border-zinc-300 text-zinc-300 italic text-xl' : ''}
                  ${!isSubmitted && selectedOptionIdx !== null ? 'border-indigo-500 text-indigo-600' : ''}
                  ${isCorrect ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : ''}
                  ${isWrong ? 'border-rose-500 text-rose-600 bg-rose-50' : ''}
                `}
              >
                {selectedOptionIdx !== null 
                  ? currentQuestion.options[blankIdx][selectedOptionIdx] 
                  : '______'}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="w-12 h-12 text-indigo-600" />
        </motion.div>
        <h2 className="text-xl font-bold text-zinc-800 mb-2">正在为您生成全新题目...</h2>
        <p className="text-zinc-400 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> AI 正在精心编排语法挑战
        </p>
      </div>
    );
  }

  if (!currentQuestion) return <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">加载失败，请刷新重试。</div>;

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "继续努力，语法是英语的骨架！";
    if (percentage >= 90) message = "太出色了！你简直是语法大师！";
    else if (percentage >= 70) message = "做得好！你已经掌握了大部分核心语法。";

    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">练习完成！</h2>
          <p className="text-zinc-500 mb-8">你的得分情况如下</p>
          
          <div className="text-6xl font-black text-indigo-600 mb-4">
            {score}<span className="text-2xl text-zinc-300 font-normal"> / {questions.length}</span>
          </div>
          
          <div className="p-4 bg-zinc-50 rounded-2xl mb-8">
            <p className="text-zinc-700 font-medium italic">"{message}"</p>
          </div>

          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
          >
            <RotateCcw className="w-5 h-5" /> 重新开始
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-8 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">GM</span>
            </div>
            GrammarMaster
          </h1>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1">初中英语语法专项训练</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">当前进度</div>
            <div className="text-sm font-mono font-bold">{currentIndex + 1} / {questions.length}</div>
          </div>
          <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen className="w-32 h-32" />
          </div>

          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <DifficultyBadge difficulty={currentQuestion.difficulty} />
            <Badge variant="info">{currentQuestion.grammarPoint}</Badge>
          </div>

          {renderSentence()}

          {/* Options */}
          <div className="space-y-8">
            {currentQuestion.options.map((blankOptions, blankIdx) => (
              <div key={blankIdx} className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> 选择最合适的选项
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {blankOptions.map((option, optIdx) => {
                    const isSelected = userAnswers[blankIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleOptionSelect(blankIdx, optIdx)}
                        className={`
                          py-4 px-4 rounded-2xl font-bold transition-all duration-200 text-sm border-2
                          ${isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-[1.02]' 
                            : 'bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50'}
                          ${isSubmitted ? 'cursor-default opacity-80' : 'cursor-pointer'}
                        `}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!isSubmitted && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={userAnswers.some(ans => ans === null)}
                className={`
                  px-12 py-4 rounded-2xl font-bold text-lg transition-all
                  ${userAnswers.some(ans => ans === null)
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 active:scale-95'}
                `}
              >
                提交答案
              </button>
            </div>
          )}
        </div>

        {/* Feedback & Explanation */}
        <AnimatePresence>
          {isSubmitted && (
            <ExplanationCard 
              question={currentQuestion} 
              userAnswers={userAnswers} 
              onNext={handleNext} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto py-12 px-6 text-center text-zinc-400 text-xs">
        <p>© 2024 GrammarMaster 英语语法互动练习系统</p>
        <p className="mt-2 italic">“The limits of my language mean the limits of my world.” — Ludwig Wittgenstein</p>
      </footer>
    </div>
  );
}
