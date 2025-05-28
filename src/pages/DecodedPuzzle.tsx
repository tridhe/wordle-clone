import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Home, Lock } from 'lucide-react';
import { decryptPuzzle } from '../utils/crypto';

const DecodedPuzzle: React.FC = () => {
  const [searchParams] = useSearchParams();
  const encryptedPassword = searchParams.get('custom_puzzle');
  
  let decodedPassword = '';
  let error = null;

  try {
    if (encryptedPassword) {
      const decrypted = decryptPuzzle(encryptedPassword);
      const puzzleData = JSON.parse(decrypted);
      decodedPassword = puzzleData.word;
    } else {
      error = 'No encrypted password provided';
    }
  } catch (e) {
    error = 'Invalid encrypted data';
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Decoded Puzzle</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {error ? (
            <div className="text-red-600">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Decoded Password</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-mono">{decodedPassword}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DecodedPuzzle;