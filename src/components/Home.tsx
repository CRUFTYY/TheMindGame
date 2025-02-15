import React, { useState } from 'react';
import { createRoom, joinRoom } from '../socket';
import { Brain } from 'lucide-react';

export const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      setError('');
      joinRoom(roomCode);
    } else {
      setError('Room code must be 6 characters');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Brain className="mx-auto h-16 w-16 text-indigo-500" />
          <h1 className="mt-6 text-4xl font-bold">The Mind</h1>
          <p className="mt-2 text-gray-400">A game of mental synchronization</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={createRoom}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Room
          </button>

          <div className="relative">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter Room Code"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={6}
            />
            <button
              onClick={handleJoinRoom}
              className="mt-2 w-full flex justify-center py-3 px-4 border border-indigo-600 rounded-md shadow-sm text-lg font-medium text-indigo-600 bg-transparent hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Join Room
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};