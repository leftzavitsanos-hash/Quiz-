import React, { useState, useEffect } from 'react';
import { Island, QuizQuestion } from '../types';
import { getIslandFunFact } from '../services/geminiService';

interface QuizCardProps {
  question: QuizQuestion;
  onCorrect: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  onCorrect, 
  questionNumber, 
  totalQuestions 
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedIds(new Set());
    setIsCorrect(false);
    setFunFact(null);
  }, [question]);

  const handleOptionClick = async (island: Island) => {
    if (isCorrect) return;

    if (island.id === question.correctIsland.id) {
      setIsCorrect(true);
      setLoadingFact(true);
      const fact = await getIslandFunFact(island.name);
      setFunFact(fact);
      setLoadingFact(false);
    } else {
      setSelectedIds(prev => new Set(prev).add(island.id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
      <div className="relative h-64 sm:h-80 w-full bg-blue-100">
        <img 
          src={question.correctIsland.imageUrl} 
          alt={question.correctIsland.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white">
            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
              ΕΡΩΤΗΣΗ {questionNumber} / {totalQuestions}
            </span>
            <h2 className="text-2xl font-bold">{question.correctIsland.landmark}</h2>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-6 font-medium">Σε ποιο νησί ανήκει αυτό το στοιχείο;</p>
        
        <div className="grid gap-4">
          {question.options.map((option) => {
            const isWrong = selectedIds.has(option.id);
            const isRight = isCorrect && option.id === question.correctIsland.id;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={isCorrect}
                className={`
                  w-full p-4 rounded-xl text-lg font-semibold transition-all duration-200 border-2
                  ${isRight ? 'bg-green-100 border-green-500 text-green-700' : 
                    isWrong ? 'bg-red-100 border-red-500 text-red-700 cursor-not-allowed opacity-80' : 
                    'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'}
                `}
              >
                {option.name}
                {isRight && ' ✓'}
                {isWrong && ' ✗'}
              </button>
            );
          })}
        </div>

        {isCorrect && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <h4 className="text-blue-800 font-bold text-sm uppercase mb-1 flex items-center">
                <span className="mr-2">💡</span> Το ήξερες;
              </h4>
              <p className="text-blue-900 italic">
                {loadingFact ? 'Φορτώνω πληροφορίες...' : funFact}
              </p>
            </div>
            
            <button
              onClick={onCorrect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all"
            >
              ΕΠΟΜΕΝΟ ΝΗΣΙ →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
