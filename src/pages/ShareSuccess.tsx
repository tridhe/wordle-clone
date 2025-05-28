import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Copy, CheckCircle } from 'lucide-react';

const ShareSuccess: React.FC = () => {
  const location = useLocation();
  const shareableLink = location.state?.link;

  if (!shareableLink) {
    return <Navigate to="/share" replace />;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
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
            <h1 className="text-2xl font-bold text-gray-800">Share Your Puzzle</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Puzzle Link Created!
            </h2>
            <p className="text-gray-600">
              Your puzzle link has been copied to your clipboard
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 break-all">{shareableLink}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span>Copy Link Again</span>
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShareSuccess;