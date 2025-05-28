import React from 'react';
import { Trophy, Target, Zap, BarChart3 } from 'lucide-react';
import { GameStats } from '../types/stats';

interface StatsDisplayProps {
  stats: GameStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gray-50 dark:bg-dark-primary rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.gamesPlayed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Played</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-dark-primary rounded-lg">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.winPercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-dark-primary rounded-lg">
          <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.winStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-dark-primary rounded-lg">
          <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.averageGuesses.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Guesses</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Guess Distribution</h3>
        {stats.guessDistribution.map((count, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 text-gray-600 dark:text-gray-400">{index + 1}</div>
            <div className="flex-grow bg-gray-100 dark:bg-dark-primary rounded">
              <div
                className="bg-blue-500 text-white text-sm py-1 px-2 rounded"
                style={{
                  width: `${Math.max((count / Math.max(...stats.guessDistribution)) * 100, 8)}%`
                }}
              >
                {count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;