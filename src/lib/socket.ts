import { io, Socket } from 'socket.io-client';

export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ROOM_JOIN: 'joinRoom',
  ROOM_LEAVE: 'leaveRoom',
  ROOM_STATE: 'roomState',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  GAME_START: 'startGame',
  GAME_STARTED: 'gameStarted',
  GAME_OVER: 'gameOver',
  DEAL_CARDS: 'dealCards',
  PLAY_CARD: 'playCard'
} as const;

class SocketManager {
  private _socket: Socket;
  private _connected: boolean = false;
  private _connectionAttempts: number = 0;
  private readonly MAX_RECONNECTION_ATTEMPTS = 5;
  private readonly RECONNECTION_DELAY = 2000;
  private readonly RESPONSE_TIMEOUT = 10000; // Increased timeout
  private _reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    const serverUrl = import.meta.env.PROD 
      ? window.location.origin 
      : `http://${window.location.hostname}:5173`;
    
    console.log('Initializing socket connection to:', serverUrl);
    
    this._socket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.MAX_RECONNECTION_ATTEMPTS,
      reconnectionDelay: this.RECONNECTION_DELAY,
      transports: ['websocket', 'polling'],
      path: '/socket.io',
      withCredentials: true,
      forceNew: true,
      timeout: 20000,
      extraHeaders: {
        'my-custom-header': 'value'
      }
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this._socket.on('connect', () => {
      console.log('Socket connected successfully:', this._socket.id);
      this._connected = true;
      this._connectionAttempts = 0;
      if (this._reconnectTimer) {
        clearTimeout(this._reconnectTimer);
        this._reconnectTimer = null;
      }
    });

    this._socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this._connected = false;

      if (this._connectionAttempts < this.MAX_RECONNECTION_ATTEMPTS) {
        this._reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect...');
          this._connectionAttempts++;
          this._socket.connect();
        }, this.RECONNECTION_DELAY);
      }
    });

    this._socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this._connected = false;

      if (reason === 'io server disconnect' || reason === 'transport close') {
        this._connectionAttempts = 0;
        this._reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect after disconnect...');
          this._socket.connect();
        }, this.RECONNECTION_DELAY);
      }
    });

    this._socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  async joinRoom(roomCode: string, displayName: string): Promise<void> {
    try {
      if (!this._socket.connected) {
        console.log('Socket not connected, attempting to connect...');
        this._socket.connect();
        
        await new Promise<void>((resolve, reject) => {
          const connectTimeout = setTimeout(() => {
            reject(new Error('Connection timeout - please try again'));
          }, 5000);

          this._socket.once('connect', () => {
            clearTimeout(connectTimeout);
            resolve();
          });
        });
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Server not responding - please try again'));
        }, this.RESPONSE_TIMEOUT);

        this._socket.emit(socketEvents.ROOM_JOIN, { roomCode, displayName }, (response: any) => {
          clearTimeout(timeoutId);
          
          if (!response) {
            reject(new Error('No response from server - please try again'));
            return;
          }

          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          if (!response.success) {
            reject(new Error('Failed to join room - please try again'));
            return;
          }

          console.log('Successfully joined room:', response);
          resolve();
        });
      });
    } catch (error: any) {
      console.error('Join room failed:', error.message);
      throw error;
    }
  }

  async startGame(roomCode: string, cardsPerPlayer: number): Promise<void> {
    try {
      if (!this._socket.connected) {
        throw new Error('Not connected to server');
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Server not responding. Please try again.'));
        }, this.RESPONSE_TIMEOUT);

        this._socket.emit(socketEvents.GAME_START, { roomCode, cardsPerPlayer }, (response: any) => {
          clearTimeout(timeoutId);

          if (!response || response.error) {
            reject(new Error(response?.error || 'Failed to start game'));
            return;
          }

          resolve();
        });
      });
    } catch (error: any) {
      console.error('Start game failed:', error.message);
      throw error;
    }
  }

  async playCard(roomCode: string, card: number): Promise<void> {
    try {
      if (!this._socket.connected) {
        throw new Error('Not connected to server');
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Server not responding. Please try again.'));
        }, this.RESPONSE_TIMEOUT);

        this._socket.emit(socketEvents.PLAY_CARD, { roomCode, card }, (response: any) => {
          clearTimeout(timeoutId);

          if (!response || response.error) {
            reject(new Error(response?.error || 'Failed to play card'));
            return;
          }

          resolve();
        });
      });
    } catch (error: any) {
      console.error('Play card failed:', error.message);
      throw error;
    }
  }

  get socket(): Socket {
    return this._socket;
  }

  get isConnected(): boolean {
    return this._connected && this._socket.connected;
  }

  on(event: string, callback: Function) {
    this._socket.on(event, callback as any);
  }

  off(event: string, callback: Function) {
    this._socket.off(event, callback as any);
  }

  removeAllListeners() {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
    }
    this._socket.removeAllListeners();
  }
}

export const socketManager = new SocketManager();