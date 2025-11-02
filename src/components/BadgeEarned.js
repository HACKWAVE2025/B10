import React, { useState, useEffect } from 'react';
import { badges, badgeAnimations } from '../data/badges';

const BadgeEarned = ({ island, onClose, dogName }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  const badge = badges[`island${island}`];
  
  useEffect(() => {
    // Start animation sequence
    setTimeout(() => setShowAnimation(true), 300);
    setTimeout(() => setShowBadge(true), 800);
    setTimeout(() => setShowContinueButton(true), 2000);
  }, []);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4">
        {/* Celebration Effects */}
        <div className="text-center mb-8">
          <div className="text-6xl animate-bounce mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">
            MISSION COMPLETE!
          </h1>
          <p className="text-xl text-gray-300">
            {dogName} has earned a new badge!
          </p>
        </div>

        {/* Badge Display */}
        <div 
          className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-4 transition-all duration-1000 transform ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ 
            borderColor: badge.glowColor,
            boxShadow: showBadge ? `0 0 30px ${badge.glowColor}` : 'none'
          }}
        >
          {/* Badge Icon */}
          <div className="text-center mb-6">
            <div 
              className={`text-8xl mb-4 inline-block ${showBadge ? badgeAnimations[badge.animation] : ''}`}
              style={{ 
                filter: showBadge ? `drop-shadow(0 0 20px ${badge.glowColor})` : 'none',
                transition: 'all 0.5s ease'
              }}
            >
              {badge.icon}
            </div>
          </div>

          {/* Badge Details */}
          <div className="text-center">
            <h2 
              className="text-2xl font-bold mb-3"
              style={{ color: badge.color }}
            >
              {badge.title}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {badge.description}
            </p>
            
            {/* Island Info */}
            <div className="bg-gray-700 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-400">Island {island} Complete</div>
              <div className="text-lg font-semibold text-white">Badge Earned!</div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
              showContinueButton ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              background: `linear-gradient(45deg, ${badge.color}, ${badge.glowColor})`,
              boxShadow: showContinueButton ? `0 4px 20px ${badge.color}40` : 'none'
            }}
            disabled={!showContinueButton}
          >
            🚀 Continue to Next Adventure
          </button>
        </div>

        {/* Sparkle Effects */}
        {showBadge && (
          <>
            <div className="absolute top-10 left-10 text-yellow-400 text-2xl animate-ping">✨</div>
            <div className="absolute top-20 right-20 text-yellow-400 text-xl animate-pulse">⭐</div>
            <div className="absolute bottom-20 left-20 text-yellow-400 text-3xl animate-bounce">🌟</div>
            <div className="absolute bottom-10 right-10 text-yellow-400 text-xl animate-ping">💫</div>
          </>
        )}
      </div>
    </div>
  );
};

export default BadgeEarned;