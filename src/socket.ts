import { io } from 'socket.io-client';
import { useGameStore } from './store';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

socket.on('room:joined', ({ roomCode, isHost, players }) => {
  useGameStore.setState({ roomCode, isHost, players });
});

socket.on('game:started', ({ playerCards, cardsPerPlayer }) => {
  useGameStore.setState({ 
    gameStarted: true, 
    playerCards, 
    cardsPerPlayer,
    gameOver: false,
    gameWon: false,
    playedCards: [],
    lowestPossibleCard: null,
    lastIncorrectCard: null
  });
});

socket.on('card:played', ({ playedCards, lowestPossibleCard, gameOver, gameWon, lastIncorrectCard }) => {
  useGameStore.setState({ 
    playedCards, 
    lowestPossibleCard, 
    gameOver, 
    gameWon,
    lastIncorrectCard
  });
});

socket.on('players:updated', ({ players }) => {
  useGameStore.setState({ players });
});

export const createRoom = () => {
  socket.emit('room:create');
};

export const joinRoom = (roomCode: string) => {
  socket.emit('room:join', { roomCode });
};

export const startGame = (cardsPerPlayer: number) => {
  const { roomCode } = useGameStore.getState();
  socket.emit('game:start', { roomCode, cardsPerPlayer });
};

export const playCard = (card: number) => {
  const { roomCode } = useGameStore.getState();
  socket.emit('card:play', { roomCode, card });
};