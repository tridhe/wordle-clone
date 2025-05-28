import React from 'react';
import { GuessResult } from '../types/game';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  usedLetters: Record<string, 'correct' | 'present' | 'absent' | undefined>;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onDelete, onEnter, usedLetters }) => {
  const getKeyClass = (key: string) => {
    const status = usedLetters[key];
    const baseClass = 'px-2 py-4 rounded-lg font-bold text-sm sm:text-base transition-colors dark:text-gray-100';
    
    if (key === 'ENTER' || key === '⌫') {
      return `${baseClass} bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100`;
    }

    switch (status) {
      case 'correct':
        return `${baseClass} bg-green-500 text-white`;
      case 'present':
        return `${baseClass} bg-yellow-500 text-white`;
      case 'absent':
        return `${baseClass} bg-gray-600 text-white`;
      default:
        return `${baseClass} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100`;
    }
  };

  const handleClick = (key: string) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === '⌫') {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={getKeyClass(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;