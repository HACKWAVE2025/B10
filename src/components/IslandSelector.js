import React, { useState } from 'react';
import { gameConfigs, themes } from '../games/gameConfigs';
import MiniGameComponent from './MiniGameComponent';

function IslandSelector({ dogName, onGameComplete, onReturnToMap }) {
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [showGame, setShowGame] = useState(false);

  // Get all available islands from gameConfigs
  const availableIslands = Object.keys(gameConfigs).map(key => {
    const islandNumber = parseInt(key.replace('island', ''));
    console.log(`Island ${islandNumber}: Component =`, gameConfigs[key].component?.name || 'undefined');
    return {
      id: islandNumber,
      key: key,
      config: gameConfigs[key],
      theme: themes[gameConfigs[key].theme]
    };
  }).sort((a, b) => a.id - b.id);

  const handleIslandSelect = (island) => {
    console.log('Island selected:', island);
    setSelectedIsland(island);
    setShowGame(true);
  };

  const handleGameComplete = (result) => {
    setShowGame(false);
    setSelectedIsland(null);
    if (onGameComplete) {
      onGameComplete(result);
    }
  };

  // If a game is being played, show the game component
  if (showGame && selectedIsland) {
    return (
      <MiniGameComponent
        island={selectedIsland.id}
        onGameComplete={handleGameComplete}
        onSkipGame={handleGameComplete}
        dogName={dogName}
      />
    );
  }

  // Show island selection map
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏝️</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Among Us: Fraud Detection Islands
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Choose your mission, Agent {dogName}!
          </p>
          <p className="text-lg text-purple-300">
            All islands are unlocked for training purposes
          </p>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {availableIslands.map((island) => (
            <div
              key={island.id}
              className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleIslandSelect(island)}
            >
              {/* Island Card */}
              <div
                className="p-8 rounded-2xl shadow-2xl border-4 transition-all duration-300 group-hover:shadow-3xl"
                style={{
                  backgroundColor: island.theme.background,
                  borderColor: island.theme.secondary,
                  background: `linear-gradient(135deg, ${island.theme.background}, ${island.theme.primary}20)`
                }}
              >
                {/* Island Number Badge */}
                <div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                  style={{
                    backgroundColor: island.theme.primary,
                    borderColor: island.theme.accent,
                    color: island.theme.text
                  }}
                >
                  {island.id}
                </div>

                {/* Island Content */}
                <div className="text-center">
                  {/* Island Icon */}
                  <div className="text-6xl mb-4">
                    {island.id === 1 ? '🕵️‍♂️' : island.id === 2 ? '🔒' : '📱'}
                  </div>

                  {/* Island Title */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: island.theme.accent }}
                  >
                    {island.config.title}
                  </h3>

                  {/* Island Description */}
                  <p
                    className="text-sm mb-6 leading-relaxed"
                    style={{ color: island.theme.text }}
                  >
                    {island.config.description}
                  </p>

                  {/* Play Button */}
                  <button
                    className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform group-hover:scale-110 shadow-lg"
                    style={{
                      backgroundColor: island.theme.secondary,
                      color: island.theme.background,
                      border: `2px solid ${island.theme.accent}`
                    }}
                  >
                    🚀 Start Mission
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-300"
                  style={{ backgroundColor: island.theme.accent }}
                />
              </div>

              {/* Floating Icons for Visual Appeal */}
              <div className="absolute -top-2 -left-2 text-2xl animate-bounce delay-100">
                {island.id === 1 ? '⚠️' : island.id === 2 ? '🛡️' : '💬'}
              </div>
              <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse delay-200">
                {island.id === 1 ? '🔍' : island.id === 2 ? '💻' : '🏃‍♂️'}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">🎯 Training Mode Active</h3>
          <p className="text-purple-200 text-lg mb-4">
            All islands are unlocked for development and testing purposes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🕵️‍♂️</div>
              <h4 className="font-bold text-red-300 mb-2">Island 1: Cyber Defense</h4>
              <p className="text-red-200">Master scam detection and sorting</p>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-blue-300 mb-2">Island 2: Network Security</h4>
              <p className="text-blue-200">Clear alerts and patch vulnerabilities</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-bold text-green-300 mb-2">Island 3: Data Breach</h4>
              <p className="text-green-200">Navigate digital messaging dangers</p>
            </div>
          </div>
        </div>

        {/* Return Button */}
        {onReturnToMap && (
          <div className="text-center mt-8">
            <button
              onClick={onReturnToMap}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105"
            >
              ← Return to Main Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IslandSelector;