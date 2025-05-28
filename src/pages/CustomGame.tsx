import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { HelpCircle, Trophy, AlertCircle, Home } from 'lucide-react';
import { GameState, GuessResult, Puzzle } from '../types/game';
import { decryptPuzzle } from '../utils/crypto';
import { updatePuzzleStats } from '../utils/puzzleStorage';
import Grid from '../components/Grid';
import ShareResults from '../components/ShareResults';
import Keyboard from '../components/Keyboard';

const CustomGame: React.FC = () => {
  const { puzzleId } = useParams();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
    try {
      if (!puzzleId) {
        setError('No puzzle ID provided');
        return;
      }
      
      const decrypted = decryptPuzzle(puzzleId);
      const decodedPuzzle = JSON.parse(decrypted);
      setPuzzle(decodedPuzzle);
    } catch (e) {
      setError('Invalid puzzle link');
    }
  }, [puzzleId]);

  const MAX_GUESSES = 6;
  
  const [gameState, setGameState] = useState<GameState>({
    currentGuess: '',
    guesses: [],
    gameStatus: 'playing',
    showHint: false,
  });

  const [showMessage, setShowMessage] = useState<string | null>(null);

  if (error || !puzzle) {
    return <Navigate to="/" replace />;
  }

  const evaluateGuess = (guess: string): GuessResult => {
    const result: GuessResult = [];
    const word = puzzle.word.toUpperCase();
    
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
    if (gameState.currentGuess.length < puzzle.word.length) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key,
      }));
    }
  }, [gameState.gameStatus, gameState.currentGuess.length, puzzle.word.length]);

  const handleDelete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, []);

  const handleEnter = useCallback(() => {
    if (gameState.currentGuess.length !== puzzle.word.length) {
      setShowMessage('Not enough letters');
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess];
    let newStatus = gameState.gameStatus;

    if (gameState.currentGuess === puzzle.word.toUpperCase()) {
      newStatus = 'won';
      updatePuzzleStats(window.location.href, true, newGuesses.length);
      setShowShareModal(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = 'lost';
      updatePuzzleStats(window.location.href, false, MAX_GUESSES);
    }

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: newStatus,
    }));
  }, [gameState.currentGuess, gameState.guesses, puzzle.word, MAX_GUESSES]);

  const toggleHint = () => {
    setGameState(prev => ({ ...prev, showHint: !prev.showHint }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;
      if (gameState.currentGuess.length >= puzzle.word.length && e.key !== 'Backspace' && e.key !== 'Enter') return;
      
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
  }, [gameState.gameStatus, gameState.currentGuess.length, handleEnter, handleDelete, handleKeyPress, puzzle.word.length]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-gray-100"
              title="Home"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Custom Puzzle</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleHint}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Show hint"
            >
              <HelpCircle className="w-6 h-6 text-gray-600" />
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

        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Puzzle by: <span className="font-medium">{puzzle.creator}</span>
          </p>
        </div>

        {gameState.showHint && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>Hint:</strong> {puzzle.hint}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Category: {puzzle.category}
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
                <span className="font-bold">Game Over! The word was {puzzle.word}</span>
              </div>
            )}
          </div>
        )}

        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          wordLength={puzzle.word.length}
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
            word={puzzle.word}
            guesses={gameState.guesses}
            isCustomPuzzle={true}
            shareableLink={window.location.href}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default CustomGame;