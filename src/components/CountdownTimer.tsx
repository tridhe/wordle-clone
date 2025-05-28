import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { getTimeUntilNextPuzzle } from '../utils/time';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextPuzzle());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextPuzzle());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Timer className="w-4 h-4" />
      <span className="text-sm font-medium">
        Next puzzle in: {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;