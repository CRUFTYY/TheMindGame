import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import { webcrypto } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://cozy-youtiao-f2ac11.netlify.app', 'https://the-mind-game.netlify.app']
      : 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  connectTimeout: 30000,
  maxHttpBufferSize: 1e6,
  path: '/socket.io'
});

function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generateSecureRandomNumber(min: number, max: number): Promise<number> {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = 256 ** bytesNeeded;
  const array = new Uint8Array(bytesNeeded);
  
  let value;
  do {
    webcrypto.getRandomValues(array);
    value = array.reduce((acc, byte, i) => acc + byte * (256 ** i), 0);
  } while (value >= maxValue - (maxValue % range));
  
  return min + (value % range);
}

class GameStateManager {
  private rooms: Map<string, any>;
  private playerRooms: Map<string, string>;

  constructor() {
    this.rooms = new Map();
    this.playerRooms = new Map();
  }

  createRoom(roomCode: string, creatorId: string) {
    console.log(`Creating room ${roomCode} with creator ${creatorId}`);
    const room = {
      code: roomCode,
      players: new Map(),
      gameState: 'setup',
      playedCards: [],
      cardsPerPlayer: 1,
      creator: creatorId,
      lastSync: Date.now(),
      version: 1
    };
    this.rooms.set(roomCode, room);
    return room;
  }

  joinRoom(roomCode: string, playerId: string, playerData: any) {
    console.log(`Player ${playerId} joining room ${roomCode}`);
    let room = this.rooms.get(roomCode);
    if (!room) {
      room = this.createRoom(roomCode, playerId);
    }

    if (room.players.size >= 10) {
      throw new Error('Room is full');
    }

    room.players.set(playerId, {
      ...playerData,
      connected: true,
      lastSeen: Date.now(),
      cards: []
    });

    this.playerRooms.set(playerId, roomCode);
    room.version++;
    return room;
  }

  leaveRoom(playerId: string) {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return null;

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    room.players.delete(playerId);
    this.playerRooms.delete(playerId);

    if (room.players.size === 0) {
      this.rooms.delete(roomCode);
      return null;
    }

    if (room.creator === playerId) {
      const [newCreator] = room.players.keys();
      room.creator = newCreator;
    }

    room.version++;
    return room;
  }

  getRoomState(roomCode: string) {
    const room = this.rooms.get(roomCode);
    if (!room) return null;

    return {
      code: room.code,
      players: Array.from(room.players.entries()).map(([id, data]) => ({
        id,
        ...data
      })),
      gameState: room.gameState,
      playedCards: room.playedCards,
      cardsPerPlayer: room.cardsPerPlayer,
      creator: room.creator,
      version: room.version
    };
  }

  handlePlayerDisconnect(playerId: string) {
    const room = this.leaveRoom(playerId);
    return room;
  }

  validateGameAction(roomCode: string, playerId: string, action: string) {
    const room = this.rooms.get(roomCode);
    if (!room) return { valid: false, error: 'Room not found' };
    if (!room.players.has(playerId)) return { valid: false, error: 'Player not in room' };
    if (room.gameState !== 'playing') return { valid: false, error: 'Game not in progress' };
    return { valid: true, room };
  }

  async dealCards(room: any) {
    console.log(`Dealing cards for room ${room.code} with ${room.players.size} players and ${room.cardsPerPlayer} cards per player`);
    
    if (!room || room.players.size === 0) {
      console.error('No players in room to deal cards to');
      return [];
    }

    const numPlayers = room.players.size;
    const totalCards = numPlayers * room.cardsPerPlayer;
    const cards = [];
    
    while (cards.length < totalCards) {
      const card = await generateSecureRandomNumber(1, 100);
      if (!cards.includes(card)) {
        cards.push(card);
      }
    }
    
    shuffleArray(cards);
    
    const playerCards = [];
    let currentCard = 0;
    
    for (const [playerId, player] of room.players) {
      const playerHand = [];
      for (let i = 0; i < room.cardsPerPlayer; i++) {
        if (currentCard < cards.length) {
          playerHand.push(cards[currentCard]);
          currentCard++;
        }
      }
      
      player.cards = [...playerHand].sort((a, b) => a - b);
      playerCards.push({
        playerId,
        cards: playerHand
      });
      
      console.log(`Dealt cards to player ${playerId}:`, playerHand);
    }
    
    return playerCards;
  }

  checkVictoryCondition(room: any) {
    const totalExpectedCards = room.players.size * room.cardsPerPlayer;
    
    if (room.playedCards.length === totalExpectedCards) {
      for (let i = 1; i < room.playedCards.length; i++) {
        if (room.playedCards[i].card <= room.playedCards[i - 1].card) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

const gameState = new GameStateManager();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', async ({ roomCode, displayName }, callback) => {
    try {
      if (!roomCode || !displayName) {
        throw new Error('Room code and display name are required');
      }

      console.log(`Player ${socket.id} (${displayName}) joining room ${roomCode}`);
      
      const room = gameState.joinRoom(roomCode, socket.id, {
        displayName,
        cards: [],
        ready: false
      });

      await socket.join(roomCode);
      
      io.to(roomCode).emit('roomState', gameState.getRoomState(roomCode));
      io.to(roomCode).emit('playerJoined', {
        playerId: socket.id,
        displayName
      });

      callback({ success: true });
    } catch (error: any) {
      console.error('Join room error:', error);
      callback({ 
        success: false, 
        error: error.message || 'Failed to join room' 
      });
    }
  });

  socket.on('startGame', async ({ roomCode, cardsPerPlayer }, callback) => {
    try {
      console.log(`Starting game in room ${roomCode} with ${cardsPerPlayer} cards per player`);
      const room = gameState.rooms.get(roomCode);
      if (!room) throw new Error('Room not found');
      if (room.creator !== socket.id) throw new Error('Only creator can start game');

      room.gameState = 'playing';
      room.cardsPerPlayer = cardsPerPlayer;
      room.playedCards = [];

      const playerCards = await gameState.dealCards(room);
      
      playerCards.forEach(({ playerId, cards }) => {
        io.to(playerId).emit('dealCards', cards);
      });

      room.version++;
      io.to(roomCode).emit('gameStarted');
      io.to(roomCode).emit('roomState', gameState.getRoomState(roomCode));

      if (callback) callback({ success: true });
    } catch (error) {
      console.error('Start game error:', error);
      if (callback) callback({ error: error.message });
    }
  });

  socket.on('playCard', ({ roomCode, card }, callback) => {
    try {
      const validation = gameState.validateGameAction(roomCode, socket.id, 'playCard');
      if (!validation.valid) throw new Error(validation.error);

      const { room } = validation;
      const player = room.players.get(socket.id);

      const allCards = Array.from(room.players.values())
        .flatMap(p => p.cards)
        .filter(c => c !== undefined);
      const lowestCard = Math.min(...allCards);

      const isCorrect = card === lowestCard;
      room.playedCards.push({
        card,
        playedBy: player.displayName,
        correct: isCorrect,
        timestamp: Date.now()
      });

      player.cards = player.cards.filter(c => c !== card);
      
      if (!isCorrect) {
        io.to(roomCode).emit('gameOver', {
          victory: false,
          message: `¡Perdimos! Se jugó ${card} cuando el menor era ${lowestCard}`
        });
        return;
      }

      const isVictory = gameState.checkVictoryCondition(room);
      if (isVictory) {
        io.to(roomCode).emit('gameOver', {
          victory: true,
          message: '¡Victoria! Todas las cartas jugadas correctamente'
        });
        return;
      }

      room.version++;
      io.to(roomCode).emit('roomState', gameState.getRoomState(roomCode));

      if (callback) callback({ success: true });
    } catch (error) {
      console.error('Play card error:', error);
      if (callback) callback({ error: error.message });
    }
  });

  socket.on('disconnect', () => {
    const room = gameState.handlePlayerDisconnect(socket.id);
    if (room) {
      io.to(room.code).emit('roomState', gameState.getRoomState(room.code));
      io.to(room.code).emit('playerLeft', { playerId: socket.id });
    }
  });
});

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;
    
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });

      app.use(vite.middlewares);
    } else {
      app.use(express.static('dist'));
    }

    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch(console.error);