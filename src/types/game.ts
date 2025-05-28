export interface Puzzle {
  word: string;
  hint: string;
  category: string;
  date?: string;
  creator?: string;
}

export type GuessResult = {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}[];

export interface GameState {
  currentGuess: string;
  guesses: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  showHint: boolean;
}

export interface CustomPuzzleForm {
  word: string;
  hint: string;
  category: string;
  creator: string;
}