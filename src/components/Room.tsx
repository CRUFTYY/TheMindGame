import React from 'react';
import { useGameStore } from '../store';
import { startGame } from '../socket';
import { Users, Copy } from 'lucide-react';

export const Room: React.FC = () => {
  const { roomCode, isHost, players, cardsPerPlayer } = useGameStore();

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || '');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Room Setup</h2>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
            <span className="text-xl font-mono">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
              title="Copy room code"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2">
            <Users className="h-6 w-6 text-indigo-400" />
            <span className="text-xl">
              {players.length} Player{players.length !== 1 ? 's' : ''} Connected
            </span>
          </div>
        </div>

        {isHost && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <label className="text-lg">Cards per Player</label>
              <select
                value={cardsPerPlayer}
                onChange={(e) => useGameStore.setState({ cardsPerPlayer: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => startGame(cardsPerPlayer)}
              disabled={players.length < 2}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Game
            </button>
          </div>
        )}

        {!isHost && (
          <div className="mt-8 text-center text-lg text-gray-400">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
};