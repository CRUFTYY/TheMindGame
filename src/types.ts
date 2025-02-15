export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface GameState {
  roomCode: string | null;
  isHost: boolean;
  players: Player[];
  cardsPerPlayer: number;
  gameStarted: boolean;
  playerCards: number[];
  playedCards: PlayedCard[];
  gameOver: boolean;
  gameWon: boolean;
  lowestPossibleCard: number | null;
  lastIncorrectCard: number | null;
  messages: ChatMessage[];
}

export interface Player {
  id: string;
  displayName: string;
  isHost: boolean;
  isOnline: boolean;
  lastSeen?: number;
}

export interface PlayedCard {
  value: number;
  isCorrect: boolean;
}