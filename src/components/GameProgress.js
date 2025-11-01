import React from 'react';
import { useGame } from '../contexts/GameContext';
import { islands } from '../data/gameData';

function GameProgress({ dogName }) {
  const { currentLevel, currentIsland, score, lives } = useGame();

  const currentIslandData = islands.find(i => i.id === currentIsland);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Game Progress</h3>
      
      {/* Player Stats */}
      <div className="space-y-4">
        {/* Score */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Score:</span>
          <span className="text-xl font-bold text-blue-600">{score}</span>
        </div>
        
        {/* Lives */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Lives:</span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-xl">
                {i < lives ? '❤️' : '🤍'}
              </span>
            ))}
          </div>
        </div>
        
        {/* Current Level */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Level:</span>
          <span className="text-lg font-bold text-purple-600">{currentLevel}/10</span>
        </div>
        
        {/* Current Island */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Island:</div>
          <div className="font-semibold text-gray-800">{currentIslandData?.name}</div>
          <div className="text-xs text-gray-500">{currentIslandData?.theme}</div>
        </div>
        
        {/* Level Progress */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Level Progress:</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentLevel / 10) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{currentLevel}/10 scenarios completed</div>
        </div>
      </div>

      {/* Islands Overview */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Islands Map</h4>
        <div className="space-y-2">
          {islands.map((island) => (
            <div 
              key={island.id}
              className={`p-2 rounded-lg text-sm ${
                island.id === currentIsland 
                  ? 'bg-blue-100 border-2 border-blue-400' 
                  : island.id < currentIsland 
                    ? 'bg-green-100 border-2 border-green-400' 
                    : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {island.id === currentIsland ? '📍' : island.id < currentIsland ? '✅' : '🔒'} 
                  {island.name}
                </span>
                <span className="text-xs">
                  Lvl {island.levels.join('-')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameProgress;