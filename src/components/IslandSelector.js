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
            Fraud Detection Island Chain
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Welcome, Agent {dogName}! Choose your training island
          </p>
          <p className="text-lg text-purple-300">
            🔓 Story Mode: All 10 islands are unlocked for your training adventure!
          </p>
          <div className="mt-4 px-6 py-3 bg-green-500/20 backdrop-blur-sm rounded-lg inline-block">
            <span className="text-green-300 font-bold">✅ Complete Training Mode</span>
            <p className="text-green-200 text-sm">All islands accessible for comprehensive learning</p>
          </div>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {availableIslands.map((island) => {
            // Get unique icon and theme for each island
            const getIslandIcon = (id) => {
              const icons = {
                1: '🕵️‍♂️', 2: '🔒', 3: '📱', 4: '🏃‍♂️', 5: '🔍',
                6: '🏗️', 7: '🛒', 8: '🕵️', 9: '🃏', 10: '🧠'
              };
              return icons[id] || '🏝️';
            };

            const getIslandEmoji = (id) => {
              const emojis = {
                1: '⚠️', 2: '🛡️', 3: '💬', 4: '💨', 5: '🚩',
                6: '💰', 7: '🌐', 8: '⚖️', 9: '🧩', 10: '🎓'
              };
              return emojis[id] || '⭐';
            };

            const getSecondaryEmoji = (id) => {
              const emojis = {
                1: '🔍', 2: '💻', 3: '🏃‍♂️', 4: '📨', 5: '💰',
                6: '📊', 7: '🔐', 8: '🧠', 9: '⚡', 10: '🏆'
              };
              return emojis[id] || '🌟';
            };

            return (
              <div
                key={island.id}
                className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleIslandSelect(island)}
              >
                {/* Island Card */}
                <div
                  className="p-6 rounded-2xl shadow-2xl border-4 transition-all duration-300 group-hover:shadow-3xl relative overflow-hidden"
                  style={{
                    backgroundColor: island.theme.background,
                    borderColor: island.theme.secondary,
                    background: `linear-gradient(135deg, ${island.theme.background}, ${island.theme.primary}20)`
                  }}
                >
                  {/* Island Number Badge */}
                  <div
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-3 z-10"
                    style={{
                      backgroundColor: island.theme.primary,
                      borderColor: island.theme.accent,
                      color: island.theme.text
                    }}
                  >
                    {island.id}
                  </div>

                  {/* Accessibility Status - All Unlocked */}
                  <div
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                    style={{
                      backgroundColor: '#00FF00',
                      borderColor: '#ffffff',
                      color: '#000000'
                    }}
                  >
                    ✓
                  </div>

                  {/* Island Content */}
                  <div className="text-center relative z-5">
                    {/* Island Icon */}
                    <div className="text-5xl mb-3">
                      {getIslandIcon(island.id)}
                    </div>

                    {/* Island Title */}
                    <h3
                      className="text-lg font-bold mb-2 leading-tight"
                      style={{ color: island.theme.accent }}
                    >
                      {island.config.title}
                    </h3>

                    {/* Island Description */}
                    <p
                      className="text-xs mb-4 leading-relaxed"
                      style={{ color: island.theme.text }}
                    >
                      {island.config.description}
                    </p>

                    {/* Play Button */}
                    <button
                      className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 transform group-hover:scale-110 shadow-lg"
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
                <div className="absolute -top-2 -left-2 text-lg animate-bounce delay-100">
                  {getIslandEmoji(island.id)}
                </div>
                <div className="absolute -bottom-2 -right-2 text-lg animate-pulse delay-200">
                  {getSecondaryEmoji(island.id)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">🎯 Story Mode: All Islands Unlocked</h3>
          <p className="text-purple-200 text-lg mb-6">
            Complete your fraud detection training across 10 unique islands!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🕵️‍♂️</div>
              <h4 className="font-bold text-red-300 mb-1">Island 1: Scam Scanner</h4>
              <p className="text-red-200">Sort cyber threats</p>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🔒</div>
              <h4 className="font-bold text-blue-300 mb-1">Island 2: IT Security</h4>
              <p className="text-blue-200">Network defense</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">📱</div>
              <h4 className="font-bold text-green-300 mb-1">Island 3: WhatsApp Dash</h4>
              <p className="text-green-200">Navigate messages</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🏃‍♂️</div>
              <h4 className="font-bold text-yellow-300 mb-1">Island 4: Message Sprint</h4>
              <p className="text-yellow-200">Avoid spam obstacles</p>
            </div>
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">�</div>
              <h4 className="font-bold text-purple-300 mb-1">Island 5: Scam Sleuth</h4>
              <p className="text-purple-200">Detective work</p>
            </div>
            <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🏗️</div>
              <h4 className="font-bold text-cyan-300 mb-1">Island 6: Credit Stacker</h4>
              <p className="text-cyan-200">Build credit score</p>
            </div>
            <div className="bg-lime-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🛒</div>
              <h4 className="font-bold text-lime-300 mb-1">Island 7: Shop Safe</h4>
              <p className="text-lime-200">Secure shopping</p>
            </div>
            <div className="bg-teal-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🕵️</div>
              <h4 className="font-bold text-teal-300 mb-1">Island 8: Fraud Detective</h4>
              <p className="text-teal-200">Investigate cases</p>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🃏</div>
              <h4 className="font-bold text-emerald-300 mb-1">Island 9: Memory Cards</h4>
              <p className="text-emerald-200">Pattern matching</p>
            </div>
            <div className="bg-violet-500/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl mb-1">🧠</div>
              <h4 className="font-bold text-violet-300 mb-1">Island 10: Final Quiz</h4>
              <p className="text-violet-200">Ultimate test</p>
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