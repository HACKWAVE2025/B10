import React, { useState } from 'react';

function GameIntro({ onStartGame }) {
  const [dogName, setDogName] = useState('');
  const [showStory, setShowStory] = useState(false);

  const handleStartGame = () => {
    if (dogName.trim()) {
      onStartGame(dogName.trim());
    }
  };

  if (showStory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🐕</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              The Story Begins...
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              🌅 One sunny morning, while walking through the digital district, you discover a lost puppy. 
              The poor little one seems confused by all the online scams and fraudulent messages floating around!
            </p>
            <p>
              💡 You realize this puppy has a special talent - it can sense digital fraud! 
              With your guidance, this furry friend could become the ultimate cyber security companion.
            </p>
            <p>
              🎯 Your mission: Train your new companion to detect 10 different types of 
              digital payment frauds. Each game will teach both you and your dog new skills!
            </p>
            <p>
              ⭐ As you progress, your dog will evolve and grow stronger. Complete all games to earn badges
              and become a Master Detective team!
            </p>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                🏆 Scoring System
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>✅ Correct Choice: <span className="font-bold text-green-600">+10 points</span></div>
                <div>❌ Wrong Choice: <span className="font-bold text-red-600">-5 points</span></div>
                <div>🎯 Level Completion: <span className="font-bold text-blue-600">+5 points</span></div>
                <div>⚡ Quick Answer (&lt;10s): <span className="font-bold text-purple-600">+2 points</span></div>
                <div>💎 Perfect Level: <span className="font-bold text-yellow-600">+15 points</span></div>
                <div>🆘 3 Lives per game</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Give your cyber-detective companion a name:
              </label>
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="Enter your dog's name..."
                className="w-full max-w-md mx-auto px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                maxLength="20"
              />
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartGame}
                disabled={!dogName.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                 Start Fraud Detection Training {dogName && `with ${dogName}!`}
              </button>
              
              <div className="text-center text-sm text-gray-600 mt-2">
                <p>🎯 Complete all 10 games and earn badges to become a Master Detective!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <div className="text-9xl mb-6 animate-bounce-slow">🐕</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Fraud Detection Academy!
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Train your digital companion to detect cyber frauds! Complete all 10 games to earn badges and become a Master Detective.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowStory(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
          >
            🌟 Begin Training
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">�</div>
              <h3 className="font-semibold text-blue-800">10 Games</h3>
              <p className="text-sm text-blue-600">Interactive fraud detection challenges</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">�</div>
              <h3 className="font-semibold text-green-800">Earn Badges</h3>
              <p className="text-sm text-green-600">Collect unique badges for each game</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-purple-800">Mobile Friendly</h3>
              <p className="text-sm text-purple-600">Play anywhere, anytime</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-yellow-800">Real Scenarios</h3>
              <p className="text-sm text-yellow-600">Learn from actual fraud cases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameIntro;