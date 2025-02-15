import { create } from 'zustand';
import { GameState, ChatMessage } from './types';

const initialState: GameState = {
  roomCode: null,
  isHost: false,
  players: [],
  cardsPerPlayer: 1,
  gameStarted: false,
  playerCards: [],
  playedCards: [],
  gameOver: false,
  gameWon: false,
  lowestPossibleCard: null,
  lastIncorrectCard: null,
  messages: [],
};

export const useGameStore = create<GameState>(() => initialState);

export const addMessage = (message: ChatMessage) => {
  useGameStore.setState((state) => ({
    messages: [...state.messages, message],
  }));
};

export const resetGame = () => {
  useGameStore.setState(initialState);
};