
export interface Island {
  id: string;
  name: string;
  landmark: string;
  imageUrl: string;
  description: string;
}

export interface QuizQuestion {
  correctIsland: Island;
  options: Island[];
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}
