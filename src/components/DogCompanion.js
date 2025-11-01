import React from 'react';
import { useGame } from '../contexts/GameContext';

function DogCompanion({ dogName }) {
  const { currentLevel, currentDog } = useGame();

  const getDogSize = () => {
    // Dog grows bigger as level increases
    if (currentLevel >= 8) return 'text-8xl';
    if (currentLevel >= 5) return 'text-7xl';
    if (currentLevel >= 3) return 'text-6xl';
    return 'text-5xl';
  };

  const getDogMood = () => {
    if (currentLevel >= 8) return 'Confident & Alert';
    if (currentLevel >= 5) return 'Focused & Learning';
    if (currentLevel >= 3) return 'Curious & Growing';
    return 'Eager & Playful';
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Your Companion
      </h3>
      
      <div className="text-center">
        {/* Dog Avatar */}
        <div className={`${getDogSize()} dog-animation mb-4 cursor-pointer`}>
          {currentDog.emoji}
        </div>
        
        {/* Dog Info */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-gray-800">{dogName}</h4>
          <p className="text-sm font-semibold text-purple-600">{currentDog.name}</p>
          <p className="text-xs text-gray-600">{getDogMood()}</p>
        </div>
        
        {/* Dog Stats */}
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Training Progress</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="font-semibold text-gray-800">Experience</div>
              <div className="text-blue-600">Level {currentLevel}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Specialization</div>
              <div className="text-purple-600">
                {currentLevel >= 8 ? 'Expert' : 
                 currentLevel >= 5 ? 'Advanced' : 
                 currentLevel >= 3 ? 'Intermediate' : 'Beginner'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Dog Skills */}
        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Fraud Detection Skills</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className={`p-1 rounded ${currentLevel >= 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 2 ? '✅' : '⏳'} UPI Scams
            </div>
            <div className={`p-1 rounded ${currentLevel >= 4 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 4 ? '✅' : '⏳'} SMS Phishing
            </div>
            <div className={`p-1 rounded ${currentLevel >= 6 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 6 ? '✅' : '⏳'} Fake Offers
            </div>
            <div className={`p-1 rounded ${currentLevel >= 8 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 8 ? '✅' : '⏳'} Investment Traps
            </div>
            <div className={`p-1 rounded ${currentLevel >= 10 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 10 ? '✅' : '⏳'} OTP Security
            </div>
            <div className={`p-1 rounded ${currentLevel >= 10 ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 text-gray-500'}`}>
              {currentLevel >= 10 ? '🏆' : '⏳'} Master
            </div>
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="mt-4 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 italic">
            {currentLevel >= 8 ? 
              `"${dogName} is now an expert fraud detector!"` :
              currentLevel >= 5 ? 
              `"${dogName} is getting really good at this!"` :
              currentLevel >= 3 ? 
              `"${dogName} is learning fast!"` :
              `"${dogName} is excited to learn!"`
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default DogCompanion;