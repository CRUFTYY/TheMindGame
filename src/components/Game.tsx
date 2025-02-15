import React, { useEffect } from 'react';
import { useGameStore } from '../store';
import { playCard } from '../socket';
import { Copy } from 'lucide-react';

export const Game: React.FC = () => {
  const { 
    roomCode, 
    playerCards, 
    playedCards, 
    gameOver,
    gameWon,
    lowestPossibleCard,
    lastIncorrectCard
  } = useGameStore();

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || '');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">The Mind</h2>
          <div className="flex items-center space-x-2">
            <span className="font-mono">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center p-8 rounded-lg bg-gray-800">
              <h3 className="text-3xl font-bold mb-4">
                {gameWon ? 'You Won!' : 'Game Over'}
              </h3>
              {!gameWon && lastIncorrectCard !== null && lowestPossibleCard !== null && (
                <p className="text-xl">
                  Card {lastIncorrectCard} was played, but {lowestPossibleCard} should have been played first
                </p>
              )}
              <p className="mt-4 text-gray-400">Restarting in 3 seconds...</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl mb-4">Played Cards</h3>
          <div className="flex flex-wrap gap-2">
            {playedCards.map((card, index) => (
              <div
                key={index}
                className={`w-16 h-24 flex items-center justify-center rounded-lg text-2xl font-bold ${
                  card.isCorrect ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {card.value}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-4">Your Cards</h3>
          <div className="flex flex-wrap gap-2">
            {playerCards.map((card, index) => (
              <button
                key={index}
                onClick={() => playCard(card)}
                className="w-16 h-24 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center text-2xl font-bold transition-colors"
              >
                {card}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};