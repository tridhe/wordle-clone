import { GameStats } from '../types/stats';

const STATS_KEY = 'wordPuzzleStats';

function generateRandomStats(): GameStats {
  // Generate random number of games between 10-50
  const gamesPlayed = Math.floor(Math.random() * 41) + 10;
  
  // Generate random distribution that sums to about 60-80% of games played (win rate)
  const distribution = Array(6).fill(0).map(() => Math.floor(Math.random() * 10));
  const totalWins = distribution.reduce((a, b) => a + b, 0);
  
  // Calculate stats
  const winPercentage = (totalWins / gamesPlayed) * 100;
  const winStreak = Math.floor(Math.random() * 6) + 1;
  const maxWinStreak = Math.max(winStreak, Math.floor(Math.random() * 8) + 4);
  
  // Calculate average guesses weighted towards earlier guesses
  const totalGuesses = distribution.reduce((sum, count, index) => 
    sum + (count * (index + 1)), 0);
  const averageGuesses = totalWins > 0 ? totalGuesses / totalWins : 0;
  
  return {
    gamesPlayed,
    winStreak,
    maxWinStreak,
    averageGuesses,
    winPercentage,
    guessDistribution: distribution,
    lastPlayedDate: null
  };
}


export function getStats(): GameStats {
  const stats = localStorage.getItem(STATS_KEY);
  return stats ? JSON.parse(stats) : generateRandomStats();
}

export function updateStats(won: boolean, numGuesses: number): void {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Only update if not played today
  if (stats.lastPlayedDate !== today) {
    stats.gamesPlayed++;
    
    if (won) {
      stats.winStreak++;
      stats.maxWinStreak = Math.max(stats.maxWinStreak, stats.winStreak);
      stats.guessDistribution[numGuesses - 1]++;
    } else {
      stats.winStreak = 0;
    }
    
    const totalWins = stats.guessDistribution.reduce((a, b) => a + b, 0);
    stats.winPercentage = (totalWins / stats.gamesPlayed) * 100;
    
    const totalGuesses = stats.guessDistribution.reduce((sum, count, index) => 
      sum + (count * (index + 1)), 0);
    stats.averageGuesses = totalWins > 0 ? totalGuesses / totalWins : 0;
    
    stats.lastPlayedDate = today;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
}