import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Trophy, AlertCircle, Home } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { puzzles } from '../data/puzzles';
import { GameState, GuessResult, GameStatus } from '../types/game';
import { getTodaysPuzzleIndex } from '../utils/time';
import { updateStats } from '../utils/stats';
import Grid from '../components/Grid';
import ShareResults from '../components/ShareResults';
import Keyboard from '../components/Keyboard';
import CountdownTimer from '../components/CountdownTimer';

const Game: React.FC = () => {
  const MAX_GUESSES = 6;
  const todaysPuzzle = puzzles[getTodaysPuzzleIndex()];
  
  const [gameState, setGameState] = useState<GameState>({
    currentGuess: '',
    guesses: [],
    gameStatus: 'playing' as GameStatus,
    showHint: false,
  });

  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const evaluateGuess = (guess: string): GuessResult => {
    const result: GuessResult = [];
    const word = todaysPuzzle.word.toUpperCase();
    
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === word[i]) {
        result.push({ letter: guess[i], status: 'correct' });
      } else if (word.includes(guess[i])) {
        result.push({ letter: guess[i], status: 'present' });
      } else {
        result.push({ letter: guess[i], status: 'absent' });
      }
    }
    
    return result;
  };

  const getUsedLetters = () => {
    const used: Record<string, 'correct' | 'present' | 'absent' | undefined> = {};
    gameState.guesses.forEach(guess => {
      const results = evaluateGuess(guess);
      results.forEach(({ letter, status }) => {
        if (!used[letter] || status === 'correct') {
          used[letter] = status;
        }
      });
    });
    return used;
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentGuess.length < todaysPuzzle.word.length) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key,
      }));
    }
  }, [gameState.gameStatus, gameState.currentGuess.length, todaysPuzzle.word.length]);

  const handleDelete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, []);

  const handleEnter = useCallback(() => {
    if (gameState.currentGuess.length !== todaysPuzzle.word.length) {
      setShowMessage('Not enough letters');
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess];
    let newStatus = gameState.gameStatus;

    if (gameState.currentGuess === todaysPuzzle.word.toUpperCase()) {
      newStatus = 'won';
      updateStats(true, newGuesses.length);
      setShowShareModal(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = 'lost';
      updateStats(false, MAX_GUESSES);
    }

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: newStatus,
    }));
  }, [gameState.currentGuess, gameState.guesses, todaysPuzzle.word, MAX_GUESSES]);

  const toggleHint = () => {
    setGameState(prev => ({ ...prev, showHint: !prev.showHint }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;
      if (gameState.currentGuess.length >= todaysPuzzle.word.length && e.key !== 'Backspace' && e.key !== 'Enter') return;
      
      if (e.key === 'Enter') {
        handleEnter();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, gameState.currentGuess.length, handleEnter, handleDelete, handleKeyPress, todaysPuzzle.word.length]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
      <header className="bg-white dark:bg-dark-secondary shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Home"
            >
              <Home className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Word Puzzle</h1>
          </div>
          <div className="flex items-center gap-4">
            <CountdownTimer />
            <ThemeToggle />
            <button
              onClick={toggleHint}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Show hint"
            >
              <HelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {showMessage}
          </div>
        )}

        {gameState.showHint && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>Hint:</strong> {todaysPuzzle.hint}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Category: {todaysPuzzle.category}
            </p>
          </div>
        )}

        {gameState.gameStatus !== 'playing' && (
          <div className="mb-6 p-4 rounded-lg text-center">
            {gameState.gameStatus === 'won' ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Trophy className="w-6 h-6" />
                <span className="font-bold">Congratulations! You won!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <span className="font-bold">Game Over! The word was {todaysPuzzle.word}</span>
              </div>
            )}
          </div>
        )}

        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          wordLength={todaysPuzzle.word.length}
          maxGuesses={MAX_GUESSES}
          evaluateGuess={evaluateGuess}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onEnter={handleEnter}
          usedLetters={getUsedLetters()}
        />
        
        {showShareModal && (
          <ShareResults
            word={todaysPuzzle.word}
            guesses={gameState.guesses}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Game;