import React, { useState } from 'react';
import UPIFraudGame from './games/UPIFraudGame';
import WhatsAppJobScamGame from './games/WhatsAppJobScamGame';

function MiniGameComponent({ island, onGameComplete, onSkipGame, dogName }) {
  const [showInstructions, setShowInstructions] = useState(true);

  const gameConfigs = {
    1: {
      title: "UPI Fraud Detection Challenge",
      description: "Identify fraudulent UPI payment requests and learn to verify before sending money!",
      component: UPIFraudGame,
      icon: "🔒",
      instructions: [
        "🚨 A friend requests urgent money via UPI",
        "⏰ Time pressure creates urgency", 
        "🔍 Verify contact identity before paying",
        "📞 Call to confirm before large payments",
        "🚫 Never pay unknown numbers urgently"
      ]
    },
    2: {
      title: "WhatsApp Job Scam Challenge",
      description: "Spot fake job offers and avoid employment scams on messaging platforms!",
      component: WhatsAppJobScamGame,
      icon: "💼",
      instructions: [
        "📱 Receive unsolicited job offers",
        "💰 Beware of upfront payment demands",
        "🔍 Verify company details properly", 
        "❓ Ask detailed questions about the role",
        "🚫 Block suspicious job offers"
      ]
    }
  };

  const gameConfig = gameConfigs[island] || gameConfigs[1];
  const GameComponent = gameConfig.component;

  const handleStartGame = () => {
    setShowInstructions(false);
  };

  const handleGameComplete = (result) => {
    onGameComplete({
      ...result,
      island: island,
      gameType: 'mini-game'
    });
  };

  const handleSkip = () => {
    onSkipGame({
      passed: true,
      score: 25,
      gameType: 'mini-game-skipped',
      island: island
    });
  };

  if (!showInstructions) {
    return (
      <GameComponent 
        onGameComplete={handleGameComplete}
        dogName={dogName}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{gameConfig.icon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {gameConfig.title}
          </h2>
          <p className="text-lg text-gray-600">
            Island {island} • Modern Fraud Detection Training
          </p>
        </div>

        {/* Dog Companion */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="text-4xl mb-2 text-center">🐕</div>
            <p className="text-center font-semibold text-gray-800">
              {dogName} is ready for action!
            </p>
          </div>
        </div>

        {/* Game Description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mission Briefing:</h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {gameConfig.description}
          </p>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">🎯 Learning Objectives:</h4>
            <ul className="space-y-3">
              {gameConfig.instructions.map((instruction, index) => (
                <li key={index} className="text-blue-700 flex items-center">
                  <span className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🚀 Start Interactive Training
          </button>
          
          <button
            onClick={handleSkip}
            className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-gray-500 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            ⏭️ Skip to Quiz
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400">
            <p className="text-yellow-800 text-lg">
              💡 <strong>New Experience:</strong> Interactive, modern UI-based fraud detection training - no more boring games!
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              Complete the training for bonus points, or skip to go directly to the scenario quiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniGameComponent;