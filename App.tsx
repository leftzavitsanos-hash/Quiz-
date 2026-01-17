
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Island, QuizQuestion } from './types';
import { ISLANDS } from './constants';
import QuizCard from './components/QuizCard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<string>('');

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const initGame = useCallback(() => {
    const shuffledIslands = shuffleArray(ISLANDS);
    const newQuestions: QuizQuestion[] = shuffledIslands.map((island) => {
      // Pick 2 other random islands for options
      const otherIslands = ISLANDS.filter(i => i.id !== island.id);
      const distractors = shuffleArray(otherIslands).slice(0, 2);
      const options = shuffleArray([island, ...distractors]);
      
      return {
        correctIsland: island,
        options
      };
    });

    setQuestions(newQuestions);
    setCurrentIdx(0);
    setGameState(GameState.PLAYING);
    setStartTime(Date.now());
  }, []);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const duration = Date.now() - startTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = ((duration % 60000) / 1000).toFixed(0);
      setFinalTime(`${minutes}λ ${seconds}δ`);
      setGameState(GameState.FINISHED);
    }
  };

  if (gameState === GameState.START) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-2xl">
          <div className="text-6xl mb-6">🏝️</div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Quiz Ελληνικών Νησιών</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Δοκίμασε τις γνώσεις σου! Μπορείς να αναγνωρίσεις 20 από τα ομορφότερα ελληνικά νησιά από τις φωτογραφίες και τα χαρακτηριστικά τους;
          </p>
          <button 
            onClick={initGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            ΠΑΙΞΕ ΤΩΡΑ
          </button>
        </div>
      </div>
    );
  }

  if (gameState === GameState.FINISHED) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-blue-500">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Συγχαρητήρια!</h2>
          <p className="text-lg text-gray-600 mb-6">Ολοκλήρωσες το ταξίδι στα 20 νησιά!</p>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="text-sm text-blue-600 uppercase font-bold mb-1">Χρόνος</div>
            <div className="text-4xl font-black text-blue-900">{finalTime}</div>
          </div>

          <button 
            onClick={() => setGameState(GameState.START)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            ΞΑΝΑΠΑΙΞΕ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl mb-8 flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white">
        <h1 className="text-xl font-bold text-blue-900 flex items-center">
          <span className="mr-2">🇬🇷</span> Quiz Νησιών
        </h1>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-blue-600">
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
      </header>

      <main className="w-full">
        {questions.length > 0 && (
          <QuizCard 
            key={questions[currentIdx].correctIsland.id}
            question={questions[currentIdx]}
            onCorrect={handleNext}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
          />
        )}
      </main>

      <footer className="mt-auto pt-10 text-center text-gray-500 text-sm">
        <p>© 2024 - Ανακαλύψτε την Ελλάδα 💙</p>
      </footer>
    </div>
  );
};

export default App;
