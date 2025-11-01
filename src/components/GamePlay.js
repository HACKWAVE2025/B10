import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { gameScenarios, islands } from '../data/gameData';
import ScenarioCard from './ScenarioCard';
import GameProgress from './GameProgress';
import DogCompanion from './DogCompanion';

function GamePlay({ dogName, onShowLeaderboard, onResetGame }) {
  const { currentLevel, currentIsland, score, lives, dispatch, currentDog } = useGame();
  const [currentScenario, setCurrentScenario] = useState(null);
  const [showIslandTransition, setShowIslandTransition] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showFinalAttack, setShowFinalAttack] = useState(false);

  useEffect(() => {
    // Load current scenario based on level
    const scenario = gameScenarios.find(s => s.level === currentLevel);
    setCurrentScenario(scenario);

    // Check if game is complete
    if (currentLevel > 10) {
      setGameComplete(true);
      setTimeout(() => setShowFinalAttack(true), 1000);
    }
  }, [currentLevel]);

  const handleLevelComplete = (levelResult) => {
    const { correct, timeBonus, perfect } = levelResult;
    
    dispatch({
      type: 'COMPLETE_LEVEL',
      payload: {
        levelId: currentLevel,
        score: correct ? 10 : -5,
        timeBonus,
        perfect
      }
    });

    // Show island transition if moving to new island
    if (currentLevel % 2 === 0 && currentLevel < 10) {
      setShowIslandTransition(true);
      setTimeout(() => setShowIslandTransition(false), 3000);
    }
  };

  const handleWrongAnswer = () => {
    dispatch({ type: 'WRONG_ANSWER' });
  };

  if (gameComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
          {showFinalAttack ? (
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                🎉 Training Complete! 🎉
              </h2>
              
              <div className="text-6xl mb-4 animate-bounce">
                {currentDog.emoji}
              </div>
              
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mb-6">
                <div className="text-2xl mb-2">🚨 Sudden Attack!</div>
                <p className="text-lg">
                  A random scammer appears: "Hi {dogName}, I'm from your bank. Share your ATM PIN for verification."
                </p>
              </div>
              
              <div className="text-4xl mb-4 animate-pulse-fast">
                🐕 WOOF WOOF WOOF! 🔊
              </div>
              
              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded mb-6">
                <p className="text-lg font-semibold text-green-800">
                  🛡️ {dogName} immediately detected the fraud and barked until the scammer ran away! 
                  Your companion is now a certified Fraud Detection Expert!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-xl font-bold text-blue-800">{score}</div>
                  <div className="text-sm text-blue-600">Total Score</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🏝️</div>
                  <div className="text-xl font-bold text-purple-800">5/5</div>
                  <div className="text-sm text-purple-600">Islands Completed</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-xl font-bold text-green-800">10/10</div>
                  <div className="text-sm text-green-600">Scenarios Mastered</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={onShowLeaderboard}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 mr-4"
                >
                  🏆 View Leaderboard
                </button>
                <button
                  onClick={onResetGame}
                  className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
                >
                  🔄 Train New Companion
                </button>
              </div>
            </div>
          ) : (
            <div className="text-4xl font-bold text-green-600">
              Congratulations! All scenarios completed! 🎊
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showIslandTransition) {
    const nextIsland = islands.find(i => i.id === currentIsland + 1);
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            🌊 Island Transition! 🌊
          </h2>
          <div className="text-6xl mb-4 animate-bounce">
            {currentDog.emoji}
          </div>
          <p className="text-xl text-gray-700 mb-4">
            {dogName} has mastered the current island!
          </p>
          <p className="text-lg text-gray-600">
            Moving to: <span className="font-bold text-purple-600">{nextIsland?.name}</span>
          </p>
          <p className="text-md text-gray-500 mt-2">
            {nextIsland?.theme}
          </p>
        </div>
      </div>
    );
  }

  if (lives <= 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            💔 Game Over 💔
          </h2>
          <div className="text-6xl mb-4">😢</div>
          <p className="text-xl text-gray-700 mb-6">
            {dogName} needs more training! Don't worry, every expert started as a beginner.
          </p>
          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-800">Final Score: {score}</div>
          </div>
          <div className="space-y-4">
            <button
              onClick={onResetGame}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 mr-4"
            >
              🔄 Try Again
            </button>
            <button
              onClick={onShowLeaderboard}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Game Progress Sidebar */}
        <div className="lg:col-span-1">
          <GameProgress dogName={dogName} />
          <DogCompanion dogName={dogName} />
        </div>

        {/* Main Game Area */}
        <div className="lg:col-span-3">
          {currentScenario ? (
            <ScenarioCard
              scenario={currentScenario}
              onComplete={handleLevelComplete}
              onWrongAnswer={handleWrongAnswer}
              dogName={dogName}
            />
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
              <div className="text-4xl mb-4">🔄</div>
              <p className="text-xl">Loading next scenario...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePlay;