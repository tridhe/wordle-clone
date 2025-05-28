import React from 'react';
import { Facebook, Twitter, Share2, X } from 'lucide-react';

interface ShareResultsProps {
  word: string;
  guesses: string[];
  isCustomPuzzle?: boolean;
  shareableLink?: string;
  onClose: () => void;
}

const ShareResults: React.FC<ShareResultsProps> = ({ word, guesses, isCustomPuzzle, shareableLink, onClose }) => {
  const generateShareText = () => {
    const puzzleType = isCustomPuzzle ? 'Custom' : 'Daily';
    const attempts = guesses.length;
    const shareText = `I solved the ${puzzleType} Word Puzzle in ${attempts} ${attempts === 1 ? 'try' : 'tries'}! 🎯\n\n`;
    
    const pattern = guesses.map(guess => {
      return guess.split('').map((letter, i) => {
        if (letter === word[i]) return '🟩';
        if (word.includes(letter)) return '🟨';
        return '⬜';
      }).join('');
    }).join('\n');
    
    return shareText + pattern + (shareableLink ? `\n\nTry it: ${shareableLink}` : '');
  };

  const shareToFacebook = () => {
    const url = shareableLink || window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(generateShareText())}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-gray-600">
            You solved it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {guesses.map((guess, index) => (
            <div key={index} className="flex justify-center gap-1 mb-1">
              {guess.split('').map((letter, i) => {
                let bgColor = 'bg-gray-300';
                if (letter === word[i]) bgColor = 'bg-green-500';
                else if (word.includes(letter)) bgColor = 'bg-yellow-500';
                
                return (
                  <div
                    key={i}
                    className={`w-8 h-8 ${bgColor} text-white font-bold flex items-center justify-center rounded`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <button
            onClick={shareToFacebook}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>Share on Facebook</span>
          </button>
          
          <button
            onClick={shareToTwitter}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Share on Twitter</span>
          </button>
          
          <button
            onClick={shareToClipboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareResults