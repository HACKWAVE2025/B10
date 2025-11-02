import React, { useState } from 'react';
import { themes } from '../games/gameConfigs';

function MiniGameComponent({ gameId, gameConfig, onGameComplete, dogName }) {
  const [showInstructions, setShowInstructions] = useState(true);
  
  const theme = themes[gameConfig?.theme] || themes['among-us-red'];

  if (!gameConfig) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">🚧 {gameId}</h2>
          <p>Game configuration not found!</p>
        </div>
      </div>
    );
  }

  const handleSkipGame = () => {
    // Skip functionality removed for simpler experience
    onGameComplete({
      passed: false,
      score: 0,
      accuracy: 0,
      gameType: `${gameId}-skipped`
    });
  };

  const handleStartGame = () => {
    setShowInstructions(false);
  };

  const handleGameComplete = (result) => {
    // Pass the result directly to the parent (App.js) which will handle badge display
    onGameComplete(result);
  };

  // Show instructions screen or game
  if (showInstructions) {
    return (
      <div 
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.background})` 
        }}
      >
        <div className="max-w-2xl w-full">
          {/* Game Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏝️</div>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: theme.text }}
            >
              {gameConfig.title}
            </h1>
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ color: theme.accent }}
            >
              {gameConfig.title}
            </h2>
            <p 
              className="text-lg opacity-90"
              style={{ color: theme.text }}
            >
              {gameConfig.description}
            </p>
          </div>

          {/* Among Us Character */}
          <div className="text-center mb-8">
            <div 
              className="inline-block p-6 rounded-full text-6xl relative"
              style={{ backgroundColor: theme.secondary + '20' }}
            >
              {/* Game-themed character */}
              🕵️‍♂️
              
              {/* Add some fraud-related icons around the character */}
              <>
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⚠️</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🔒</div>
                <div className="absolute -top-2 -left-2 text-2xl animate-spin-slow">🛡️</div>
              </>
            </div>
            <div 
              className="mt-2 text-lg font-semibold"
              style={{ color: theme.text }}
            >
              🛡️ Agent {dogName} is ready for cyber defense operations!
            </div>
          </div>

          {/* Instructions */}
          <div 
            className="p-6 rounded-xl mb-8"
            style={{ 
              backgroundColor: theme.background + 'CC',
              border: `2px solid ${theme.secondary}`
            }}
          >
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: theme.accent }}
            >
              🎯 Mission Instructions:
            </h3>
            <ul className="space-y-2">
              {gameConfig.instructions.map((instruction, index) => (
                <li 
                  key={index}
                  className="text-base"
                  style={{ color: theme.text }}
                >
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartGame}
              className="px-8 py-3 rounded-lg text-lg font-bold transition-all hover:scale-105 transform"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
                border: `2px solid ${theme.accent}`
              }}
            >
              🚀 Start Mission
            </button>
            
            <button
              onClick={handleSkipGame}
              className="px-6 py-3 rounded-lg text-base font-semibold transition-all hover:scale-105 transform opacity-70 hover:opacity-100"
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                border: `2px solid ${theme.secondary}`
              }}
            >
              ⏭️ Skip Game
            </button>
          </div>

          {/* Tips */}
          <div className="text-center mt-6">
            <p 
              className="text-sm opacity-75"
              style={{ color: theme.text }}
            >
              💡 Tip: Complete missions to earn higher scores and help {dogName} become a fraud detection expert!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the actual game
  const GameComponent = gameConfig.component;
  
  console.log('MiniGameComponent - GameId:', gameId, 'GameComponent:', GameComponent?.name || 'undefined', 'Config:', gameConfig);
  
  return (
    <GameComponent 
      onGameComplete={handleGameComplete}
      dogName={dogName}
      gameId={gameId}
      theme={theme}
    />
  );
}

export default MiniGameComponent;