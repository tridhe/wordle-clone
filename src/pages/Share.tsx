import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Share2, Copy, CheckCircle } from 'lucide-react';
import { CustomPuzzleForm } from '../types/game';
import { encryptPuzzle } from '../utils/crypto';
import { savePuzzle } from '../utils/puzzleStorage';

const Share: React.FC = () => {
  const [formData, setFormData] = useState<CustomPuzzleForm>({
    word: '',
    hint: '',
    category: '',
    creator: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    if (shareableLink) {
      await navigator.clipboard.writeText(shareableLink);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    const shareableLink = `${window.location.origin}/custom/${encrypted}`;

    savePuzzle({
      ...puzzleData,
      shareableLink,
    });

    setShareableLink(shareableLink);
    copyToClipboard();
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
            <h1 className="text-2xl font-bold text-gray-800">Share a Puzzle</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {shareableLink ? (
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Puzzle Link Created!
              </h2>
              <p className="text-gray-600 mb-6">
                Your puzzle link has been copied to your clipboard
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 break-all">{shareableLink}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                  <span>{showCopySuccess ? 'Copied!' : 'Copy Link Again'}</span>
                </button>
                <button
                  onClick={() => setShareableLink(null)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Create Another</span>
                </button>
              </div>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700">
                Word
              </label>
              <input
                type="text"
                id="word"
                value={formData.word}
                onChange={(e) => setFormData(prev => ({ ...prev, word: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a word (exactly 5 letters)"
                maxLength={5}
              />
            </div>

            <div>
              <label htmlFor="hint" className="block text-sm font-medium text-gray-700">
                Hint
              </label>
              <input
                type="text"
                id="hint"
                value={formData.hint}
                onChange={(e) => setFormData(prev => ({ ...prev, hint: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Give a helpful hint"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Animals, Food, Sports"
              />
            </div>

            <div>
              <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="creator"
                value={formData.creator}
                onChange={(e) => setFormData(prev => ({ ...prev, creator: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <Share2 className="w-5 h-5" />
              <span>Generate Shareable Link</span>
            </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Share;