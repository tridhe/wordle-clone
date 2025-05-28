import React from 'react';
import { GuessResult } from '../types/game';

interface CellProps {
  letter: string;
  result?: GuessResult[number];
  index: number;
  isRevealing: boolean;
}

interface GridProps {
  guesses: string[];
  currentGuess: string;
  wordLength: number;
  maxGuesses: number;
  evaluateGuess: (guess: string) => GuessResult;
}

const Grid: React.FC<GridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxGuesses,
  evaluateGuess,
}) => {
  const [isRevealing, setIsRevealing] = React.useState(false);
  const [revealingRowIndex, setRevealingRowIndex] = React.useState(-1);

  React.useEffect(() => {
    if (guesses.length > 0) {
      setIsRevealing(true);
      setRevealingRowIndex(guesses.length - 1);
      const timer = setTimeout(() => {
        setIsRevealing(false);
        setRevealingRowIndex(-1);
      }, 1500); // Total animation duration for the row
      return () => clearTimeout(timer);
    }
  }, [guesses.length]);

  const remainingGuesses = Math.max(0, maxGuesses - guesses.length - (currentGuess.length > 0 ? 1 : 0));
  const allGuesses = [
    ...guesses,
    ...(currentGuess.length > 0 ? [currentGuess + ''.padEnd(wordLength - currentGuess.length)] : []),
    ...Array(remainingGuesses).fill(''.padEnd(wordLength)),
  ];

  const Cell: React.FC<CellProps> = ({ letter, result, index, isRevealing }) => {
    const baseClass = 'w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded dark:text-gray-100';
    const transitionClass = isRevealing
      ? `transition-all duration-500 delay-[${index * 300}ms]`
      : 'transition-colors duration-100';
    
    if (!letter) {
      return (
        <div className={`${baseClass} border-gray-300 dark:border-gray-600`}>
          {letter}
        </div>
      );
    }

    if (!result) {
      return (
        <div className={`${baseClass} border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300`}>
          {letter}
        </div>
      );
    }

    let colorClass = '';
    if (result.status === 'correct') {
      colorClass = 'bg-green-500 border-green-500 text-white';
    } else if (result.status === 'present') {
      colorClass = 'bg-yellow-500 border-yellow-500 text-white';
    } else {
      colorClass = 'bg-gray-600 border-gray-600 text-white';
    }

    return (
      <div
        className={`${baseClass} ${colorClass} ${transitionClass} ${
          isRevealing && (result.status === 'correct' || result.status === 'present') ? 'animate-flip-in' : ''
        }`}
      >
        {letter}
      </div>
    );
  };

  return (
    <div className="grid gap-1 mb-4">
      {allGuesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {guess.split('').map((letter, colIndex) => {
            const result = rowIndex < guesses.length ? evaluateGuess(guesses[rowIndex])[colIndex] : undefined;
            return (
              <Cell
                key={colIndex}
                letter={letter}
                result={result}
                index={colIndex}
                isRevealing={isRevealing && rowIndex === revealingRowIndex}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;