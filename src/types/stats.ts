export interface GameStats {
  gamesPlayed: number;
  winStreak: number;
  maxWinStreak: number;
  averageGuesses: number;
  winPercentage: number;
  guessDistribution: number[];
  lastPlayedDate: string | null;
}