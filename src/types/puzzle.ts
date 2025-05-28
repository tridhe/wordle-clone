export interface PuzzleStats {
  participants: number;
  completionRate: number;
  averageAttempts: number;
}

export interface SavedPuzzle {
  word: string;
  hint: string;
  category: string;
  creator: string;
  createdAt: string;
  shareableLink: string;
  stats: PuzzleStats;
}