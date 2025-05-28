import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Share2, Plus, BookOpen, ArrowRight, Play, Trash2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { CustomPuzzleForm } from '../types/game';
import { encryptPuzzle } from '../utils/crypto';
import { savePuzzle, getPuzzles, removePuzzle } from '../utils/puzzleStorage';

const CustomPuzzles: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'play'>('create');
  const [formData, setFormData] = useState<CustomPuzzleForm>({
    word: '',
    hint: '',
    category: '',
    creator: '',
  });
  const [inputCode, setInputCode] = useState('');
  const [puzzleCode, setPuzzleCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState(getPuzzles());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (shareableLink: string) => {
    removePuzzle(shareableLink);
    setShowDeleteConfirm(null);
    setPuzzles(getPuzzles());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.word || !formData.hint || !formData.category || !formData.creator) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[A-Za-z]{5}$/.test(formData.word)) {
      setError('Word must be exactly 5 letters');
      return;
    }

    const puzzleData = {
      ...formData,
      word: formData.word.toUpperCase(),
    };

    const encrypted = encryptPuzzle(JSON.stringify(puzzleData));
    setGeneratedCode(encrypted);
    const fullShareableLink = `${window.location.origin}/custom/${encrypted}`;

    savePuzzle({
      ...puzzleData,
      shareableLink: fullShareableLink,
    });

    setFormData({
      word: '',
      hint: '',
      category: '',
      creator: '',
    });
  };

  const handlePlayPuzzle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzleCode.trim()) {
      setError('Please enter a puzzle code');
      return;
    }
    // Clean up the puzzle code by removing any URL parts
    const cleanCode = puzzleCode.trim().split('/').pop() || '';
    navigate(`/custom/${cleanCode}`);
  };

  const handlePlayCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setError('Please enter a puzzle code');
      return;
    }
    navigate('/custom/play', { state: { code: inputCode } });
  };

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Custom Puzzles</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-4 py-3 text-center font-medium ${
                activeTab === 'create'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Create Puzzle</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('play')}
              className={`flex-1 px-4 py-3 text-center font-medium ${
                activeTab === 'play'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Play Puzzle</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 px-4 py-3 text-center font-medium ${
                activeTab === 'list'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Your Puzzles</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'create' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {generatedCode ? (
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      Puzzle Created Successfully! 🎉
                    </h2>
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-dark-primary rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Your Puzzle Code:</h3>
                      <p className="font-mono text-xl break-all select-all">{generatedCode}</p>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode);
                        }}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGeneratedCode(null)}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create Another Puzzle
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="word" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Word
                      </label>
                      <input
                        type="text"
                        id="word"
                        value={formData.word}
                        onChange={(e) => setFormData(prev => ({ ...prev, word: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-primary px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter a word (exactly 5 letters)"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <label htmlFor="hint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hint
                      </label>
                      <input
                        type="text"
                        id="hint"
                        value={formData.hint}
                        onChange={(e) => setFormData(prev => ({ ...prev, hint: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-primary px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Give a helpful hint"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-primary px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Animals, Food, Sports"
                      />
                    </div>

                    <div>
                      <label htmlFor="creator" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="creator"
                        value={formData.creator}
                        onChange={(e) => setFormData(prev => ({ ...prev, creator: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-primary px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Puzzle</span>
                    </button>
                  </>
                )}
              </form>
            )}

            {activeTab === 'play' && (
              <form onSubmit={handlePlayCode} className="space-y-6">
                <div>
                  <label htmlFor="inputCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Puzzle Code
                  </label>
                  <input
                    type="text"
                    id="inputCode"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-primary px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter the puzzle code"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Start Game</span>
                </button>
              </form>
            )}

            {activeTab === 'list' && (
              <div className="space-y-6">
                {puzzles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any puzzles yet.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First Puzzle
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {puzzles.map((puzzle, index) => {
                      const shareableCode = puzzle.shareableLink.split('/').pop();
                      return (
                        <div key={puzzle.shareableLink} className="bg-gray-50 dark:bg-dark-primary rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {puzzle.word}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">{puzzle.hint}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Category: {puzzle.category}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-sm">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Players</p>
                              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {puzzle.stats.participants}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-sm">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {puzzle.stats.completionRate.toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-sm">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Attempts</p>
                              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {puzzle.stats.averageAttempts.toFixed(1)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                if (shareableCode) {
                                  navigator.clipboard.writeText(shareableCode);
                                }
                              }}
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <Share2 className="w-5 h-5" />
                              <span>Copy Code</span>
                            </button>
                            <button
                              onClick={() => navigate('/custom/play', { state: { code: shareableCode } })}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Play className="w-5 h-5" />
                              <span>Play Now</span>
                            </button>
                            {showDeleteConfirm === puzzle.shareableLink ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDelete(puzzle.shareableLink)}
                                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <span>Confirm</span>
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  <span>Cancel</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowDeleteConfirm(puzzle.shareableLink)}
                                className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg transition-colors"
                                title="Delete puzzle"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomPuzzles;