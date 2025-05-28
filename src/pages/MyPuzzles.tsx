import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Copy, CheckCircle, Users, Target, Hash, Trash2 } from 'lucide-react';
import { getPuzzles, removePuzzle } from '../utils/puzzleStorage';
import { SavedPuzzle } from '../types/puzzle';

const MyPuzzles: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [puzzles, setPuzzles] = useState(getPuzzles());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const copyToClipboard = async (link: string, index: number) => {
    await navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (shareableLink: string) => {
    removePuzzle(shareableLink);
    setPuzzles(getPuzzles());
    setShowDeleteConfirm(null);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">My Puzzles</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {puzzles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any puzzles yet.</p>
            <Link
              to="/share"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Puzzle
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {puzzles.map((puzzle, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {puzzle.word}
                    </h2>
                    <p className="text-gray-600">{puzzle.hint}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Category: {puzzle.category}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(puzzle.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Participants</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {puzzle.stats.participants}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="font-medium">Completion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {puzzle.stats.completionRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Hash className="w-4 h-4" />
                      <span className="font-medium">Avg. Attempts</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {puzzle.stats.averageAttempts.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => copyToClipboard(puzzle.shareableLink, index)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy Shareable Link</span>
                      </>
                    )}
                  </button>
                  
                  {showDeleteConfirm === index ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(puzzle.shareableLink)}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(index)}
                      className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 py-3 px-6 rounded-lg transition-colors"
                      title="Delete puzzle"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPuzzles;