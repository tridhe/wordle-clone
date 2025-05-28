import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BarChart as ChartBar, Share2, BookOpen } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import StatsDisplay from '../components/StatsDisplay';
import { getStats } from '../utils/stats';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Word Puzzle</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Challenge yourself daily with our word puzzles. Each day brings a new word to discover!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => navigate('/play')}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-6 h-6" />
            <span className="text-lg font-semibold">Play Today's Puzzle</span>
          </button>
          
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center justify-center gap-3 bg-gray-600 text-white py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChartBar className="w-6 h-6" />
            <span className="text-lg font-semibold">Practice Mode</span>
          </button>
          
          <button
            onClick={() => navigate('/custom')}
            className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-lg font-semibold">Custom Puzzles</span>
          </button>
          
        </div>

        <StatsDisplay stats={stats} />
      </div>
    </div>
  );
};

export default Home;