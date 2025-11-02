import React from 'react';
import { badges, badgeAnimations } from '../data/badges';

const BadgeCollection = ({ earnedBadges = [], onClose }) => {
  const allBadges = Object.keys(badges).map(key => ({
    island: parseInt(key.replace('island', '')),
    ...badges[key]
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🏆 Badge Collection</h1>
            <p className="text-gray-300">
              {earnedBadges.length} of {allBadges.length} badges earned
            </p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allBadges.map((badge) => {
              const isEarned = earnedBadges.includes(`island${badge.island}`);
              
              return (
                <div 
                  key={badge.id}
                  className={`rounded-xl p-6 border-2 transition-all duration-300 ${
                    isEarned 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-yellow-400 shadow-lg' 
                      : 'bg-gray-800 border-gray-600 opacity-50'
                  }`}
                  style={isEarned ? { boxShadow: `0 0 20px ${badge.glowColor}40` } : {}}
                >
                  {/* Badge Icon */}
                  <div className="text-center mb-4">
                    <div 
                      className={`text-5xl inline-block ${
                        isEarned ? badgeAnimations[badge.animation] : 'grayscale'
                      }`}
                      style={isEarned ? { 
                        filter: `drop-shadow(0 0 10px ${badge.glowColor})` 
                      } : {}}
                    >
                      {isEarned ? badge.icon : '🔒'}
                    </div>
                  </div>

                  {/* Badge Info */}
                  <div className="text-center">
                    <h3 
                      className={`font-bold mb-2 ${isEarned ? 'text-white' : 'text-gray-500'}`}
                      style={isEarned ? { color: badge.color } : {}}
                    >
                      {isEarned ? badge.title : `Island ${badge.island} Badge`}
                    </h3>
                    <p className={`text-sm ${isEarned ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isEarned ? badge.description : 'Complete the island to unlock this badge'}
                    </p>
                    
                    {/* Island Number */}
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isEarned ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-gray-400'
                      }`}>
                        Island {badge.island}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Continue Training
            </button>
          </div>

          {/* Achievement Stats */}
          {earnedBadges.length > 0 && (
            <div className="mt-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
                  <div className="text-blue-100 text-sm">Badges Earned</div>
                </div>
                <div className="bg-green-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">
                    {Math.round((earnedBadges.length / allBadges.length) * 100)}%
                  </div>
                  <div className="text-green-100 text-sm">Completion Rate</div>
                </div>
                <div className="bg-purple-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">
                    {allBadges.length - earnedBadges.length}
                  </div>
                  <div className="text-purple-100 text-sm">Remaining</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;