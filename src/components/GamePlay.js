import React from 'react';
import { gameConfigs } from '../games/gameConfigs';

function GamePlay({ dogName, onShowLeaderboard, onResetGame, onGameSelect }) {
  const gameKeys = Object.keys(gameConfigs);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🎮 Select a Game to Play with {dogName}! 🐕
        </h2>
        <p className="text-xl text-white/90">
          Choose any of the 10 fraud detection training games
        </p>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gameKeys.map((gameKey, index) => {
          const game = gameConfigs[gameKey];
          return (
            <div
              key={gameKey}
              onClick={() => onGameSelect(gameKey)}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {game.title.split(' ')[0]} {/* Get the emoji from title */}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Game {index + 1}
                </h3>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {game.title.replace(/^[^\s]+\s/, '')} {/* Remove emoji from title */}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {game.description}
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  Play Now!
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onShowLeaderboard}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200"
        >
          🏆 View Leaderboard
        </button>
        
        <button
          onClick={onResetGame}
          className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-gray-600 hover:to-gray-800 transform hover:scale-105 transition-all duration-200"
        >
          🔄 Start Over
        </button>
      </div>

      {/* Dog Companion Display */}
      <div className="text-center mt-8">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
          <div className="text-6xl mb-2">🐕</div>
          <h3 className="text-2xl font-bold text-white">{dogName}</h3>
          <p className="text-white/80">Ready for action!</p>
        </div>
      </div>
    </div>
  );
}

export default GamePlay;