import { SavedPuzzle, PuzzleStats } from '../types/puzzle';

const PUZZLES_KEY = 'myPuzzles';

export function savePuzzle(puzzle: Omit<SavedPuzzle, 'stats' | 'createdAt'>): void {
  const puzzles = getPuzzles();
  const newPuzzle: SavedPuzzle = {
    ...puzzle,
    createdAt: new Date().toISOString(),
    stats: {
      participants: 0,
      completionRate: 0,
      averageAttempts: 0,
    },
  };
  
  puzzles.push(newPuzzle);
  localStorage.setItem(PUZZLES_KEY, JSON.stringify(puzzles));
}

export function getPuzzles(): SavedPuzzle[] {
  const puzzles = localStorage.getItem(PUZZLES_KEY);
  return puzzles ? JSON.parse(puzzles) : [];
}

export function removePuzzle(shareableLink: string): void {
  const puzzles = getPuzzles();
  const filteredPuzzles = puzzles.filter(p => p.shareableLink !== shareableLink);
  localStorage.setItem(PUZZLES_KEY, JSON.stringify(filteredPuzzles));
}

export function updatePuzzleStats(shareableLink: string, won: boolean, attempts: number): void {
  const puzzles = getPuzzles();
  const puzzleIndex = puzzles.findIndex(p => p.shareableLink === shareableLink);
  
  if (puzzleIndex !== -1) {
    const puzzle = puzzles[puzzleIndex];
    const stats = puzzle.stats;
    
    stats.participants++;
    stats.completionRate = ((stats.completionRate * (stats.participants - 1) + (won ? 100 : 0)) / stats.participants);
    stats.averageAttempts = ((stats.averageAttempts * (stats.participants - 1) + attempts) / stats.participants);
    
    puzzles[puzzleIndex] = { ...puzzle, stats };
    localStorage.setItem(PUZZLES_KEY, JSON.stringify(puzzles));
  }
}