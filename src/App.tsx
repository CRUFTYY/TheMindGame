import React, { useState, useEffect } from 'react';
import { Brain, Copy, Users, PlayCircle, CreditCard, Timer, XCircle } from 'lucide-react';
import { socketManager, socketEvents } from './lib/socket';
import { useTranslation } from './hooks/useTranslation';
import { LanguageSelector } from './components/LanguageSelector';

type GameState = 'username' | 'lobby' | 'setup' | 'playing' | 'countdown' | 'gameover';
type Player = { 
  displayName: string; 
  isCreator?: boolean; 
  cards?: number[]; 
  ready?: boolean;
};
type PlayedCard = { 
  card: number; 
  playedBy: string; 
  correct: boolean;
  timestamp: number;
};

function App() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>('username');
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinCode, setJoinCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cardsPerPlayer, setCardsPerPlayer] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playedCards, setPlayedCards] = useState<PlayedCard[]>([]);
  const [myCards, setMyCards] = useState<number[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string>('');
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showGameOverAnimation, setShowGameOverAnimation] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [autoRestartTimer, setAutoRestartTimer] = useState<NodeJS.Timeout | null>(null);

  const resetGame = async () => {
    setGameState('setup');
    setPlayedCards([]);
    setMyCards([]);
    setGameOverMessage('');
    setIsVictory(false);
    setShowGameOverAnimation(false);
    setIsResetting(false);
    setError('');

    if (isHost) {
      try {
        await socketManager.startGame(roomCode, cardsPerPlayer);
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  useEffect(() => {
    socketManager.socket.removeAllListeners();

    function handleRoomState(state: { 
      players: Player[]; 
      gameState: string;
      playedCards: PlayedCard[];
      cardsPerPlayer: number;
      creator: string;
    }) {
      console.log('Room state update received:', state);
      setPlayers(state.players || []);
      setGameState(state.gameState as GameState || 'setup');
      setPlayedCards(state.playedCards || []);
      setCardsPerPlayer(state.cardsPerPlayer || 1);
      setIsHost(socketManager.socket.id === state.creator);
    }

    function handleDealCards(cards: number[]) {
      console.log('Cards received:', cards);
      if (Array.isArray(cards) && cards.length > 0) {
        const sortedCards = [...cards].sort((a, b) => a - b);
        console.log('Setting sorted cards:', sortedCards);
        setMyCards(sortedCards);
      } else {
        console.error('Invalid cards received:', cards);
      }
    }

    function handleGameStarted() {
      console.log('Game started event received');
      setGameState('countdown');
      setCountdown(3);
      setPlayedCards([]);
      setGameOverMessage('');
      setIsVictory(false);
      setShowGameOverAnimation(false);
      setIsResetting(false);
    }

    function handleGameOver({ victory, message }: { victory: boolean; message: string }) {
      console.log('Game over:', { victory, message });
      setGameOverMessage(message || t('gameOver'));
      setIsVictory(victory);
      setGameState('gameover');
      setShowGameOverAnimation(true);
      setIsResetting(true);
      
      if (autoRestartTimer) {
        clearTimeout(autoRestartTimer);
      }

      const timer = setTimeout(() => {
        resetGame();
      }, 3000);

      setAutoRestartTimer(timer);
    }

    socketManager.on(socketEvents.ROOM_STATE, handleRoomState);
    socketManager.on(socketEvents.DEAL_CARDS, handleDealCards);
    socketManager.on(socketEvents.GAME_STARTED, handleGameStarted);
    socketManager.on(socketEvents.GAME_OVER, handleGameOver);

    return () => {
      if (autoRestartTimer) {
        clearTimeout(autoRestartTimer);
      }
      socketManager.socket.removeAllListeners();
    };
  }, [isHost, roomCode, cardsPerPlayer, autoRestartTimer, t]);

  useEffect(() => {
    if (countdown === null) return;
    
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        if (gameState === 'countdown') {
          setGameState('playing');
        }
        setCountdown(null);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, gameState]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!displayName) {
      setError(t('pleaseEnterName'));
      return;
    }

    const code = generateRoomCode();
    setRoomCode(code);
    try {
      await socketManager.joinRoom(code, displayName);
      setGameState('setup');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const joinRoom = async () => {
    if (!displayName) {
      setError(t('pleaseEnterName'));
      return;
    }

    const code = joinCode.trim().toUpperCase();
    if (!code || code.length !== 6) {
      setError(t('roomCodeRequired'));
      return;
    }
    
    try {
      await socketManager.joinRoom(code, displayName.trim());
      setRoomCode(code);
      setGameState('setup');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStartGame = async () => {
    if (!roomCode || !isHost) return;
    
    try {
      await socketManager.startGame(roomCode, cardsPerPlayer);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const playCard = async (card: number) => {
    if (!roomCode) return;
    
    try {
      await socketManager.playCard(roomCode, card);
      setMyCards(myCards.filter(c => c !== card));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      setError(t('pleaseEnterName'));
      return;
    }
    setGameState('lobby');
    setError('');
  };

  if (gameState === 'username') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LanguageSelector />
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-3xl font-bold">{t('gameName')}</h1>
          </div>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t('enterName')}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t('enterNamePlaceholder')}
                maxLength={20}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('continue')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LanguageSelector />
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-3xl font-bold">{t('gameName')}</h1>
          </div>
          <div className="space-y-6">
            <button
              onClick={createRoom}
              className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition"
            >
              <Users className="w-5 h-5 mr-2" />
              {t('createRoom')}
            </button>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder={t('enterRoomCode')}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={6}
                  pattern="[A-Z0-9]{6}"
                />
                <button
                  onClick={joinRoom}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded transition"
                >
                  {t('joinRoom')}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LanguageSelector />
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-3xl font-bold">{t('gameName')}</h1>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-purple-400">
              {t('playersInRoom')}: {players.length}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t('roomCode')}:</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono">{roomCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    setError(t('copied'));
                    setTimeout(() => setError(''), 2000);
                  }}
                  className="p-2 hover:bg-gray-700 rounded transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">{t('players')}:</h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 px-4 py-2 rounded flex items-center justify-between"
                  >
                    <span>{player.displayName}</span>
                    <div className="flex items-center gap-2">
                      {player.displayName === displayName && (
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">{t('you')}</span>
                      )}
                      {player.isCreator && (
                        <span className="text-xs bg-yellow-600 px-2 py-1 rounded">{t('host')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isHost && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {t('cardsPerPlayer')}
                  </label>
                  <select
                    value={cardsPerPlayer}
                    onChange={(e) => setCardsPerPlayer(Number(e.target.value))}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleStartGame}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition transform hover:scale-105"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {t('startGame')}
                </button>
              </div>
            )}

            {!isHost && (
              <p className="text-yellow-400 text-sm text-center">
                {t('waitingForHost')}
              </p>
            )}

            {error && (
              <p className="text-center text-sm" style={{ color: error.includes('copied') ? '#4ade80' : '#f87171' }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown' || gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LanguageSelector />
        <div className={`text-center transition-all duration-300 ${isResetting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="flex items-center justify-center mb-8">
            {gameState === 'countdown' ? (
              <Timer className="w-16 h-16 text-purple-400 animate-pulse" />
            ) : (
              <XCircle className={`w-16 h-16 ${isVictory ? 'text-green-400' : 'text-red-400'} animate-shake`} />
            )}
          </div>
          
          {gameOverMessage && !isResetting && (
            <div className={`mb-8 text-2xl font-bold transition-colors duration-300 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
              {gameOverMessage}
            </div>
          )}
          
          <h1 className={`text-6xl font-bold mb-4 transition-colors duration-300 ${
            gameState === 'countdown' ? 'text-purple-400' : 
            isVictory ? 'text-green-400' : 'text-red-400'
          }`} style={{ fontSize: '32px' }}>
            {countdown}
          </h1>
          
          <p className="text-xl text-gray-400">
            {gameState === 'countdown' ? t('preparingGame') : t('startingNewRound')}
          </p>
          
          {showGameOverAnimation && !isResetting && (
            <div className="fixed inset-0 pointer-events-none">
              <div className={`absolute inset-0 ${isVictory ? 'bg-green-500' : 'bg-red-500'} opacity-20 animate-pulse`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-6xl font-bold ${isVictory ? 'text-green-400' : 'text-red-400'} animate-shake`}>
                  {t('gameOver')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <LanguageSelector />
        <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-3xl font-bold">{t('gameName')}</h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                {t('players')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 px-4 py-2 rounded flex items-center justify-between"
                  >
                    <span>{player.displayName}</span>
                    <div className="flex items-center gap-2">
                      {player.displayName === displayName && (
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">{t('you')}</span>
                      )}
                      {player.isCreator && (
                        <span className="text-xs bg-yellow-600 px-2 py-1 rounded">{t('host')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-purple-400" />
                {t('yourCards')} ({myCards.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {myCards.map((card) => (
                  <button
                    key={card}
                    onClick={() => playCard(card)}
                    className="group relative w-full aspect-[3/4] perspective transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-800 rounded-xl shadow-xl flex flex-col items-center justify-center">
                      <span className="absolute top-4 left-4 text-2xl font-bold text-white/90">{card}</span>
                      <span className="text-5xl font-bold text-white">{card}</span>
                      <span className="absolute bottom-4 right-4 text-2xl font-bold text-white/90 rotate-180">{card}</span>
                      <div className="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                ))}
                {myCards.length === 0 && (
                  <p className="text-gray-400 italic col-span-full text-center py-8 text-lg">
                    {t('noCardsInHand')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                {t('playedCards')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playedCards.map((playedCard, index) => (
                  <div
                    key={index}
                    className={`relative aspect-[3/4] rounded-xl shadow-lg flex flex-col items-center justify-center
                               ${playedCard.correct ? 'bg-gradient-to-br from-green-600 to-green-800' 
                                                  : 'bg-gradient-to-br from-red-600 to-red-800'}
                               transform transition-all duration-300`}
                  >
                    <span className="text-3xl font-bold text-white drop-shadow-md">
                      {playedCard.card}
                    </span>
                    <span className="absolute bottom-2 text-xs text-white/80">
                      {playedCard.playedBy}
                    </span>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                  </div>
                ))}
                {playedCards.length === 0 && (
                  <p className="text-gray-400 italic col-span-full text-center py-8">
                    {t('noCardsPlayed')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;