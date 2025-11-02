import React, { useState } from 'react';
import './App.css';
import GameIntro from './components/GameIntro';
import GamePlay from './components/GamePlay';
import MiniGameComponent from './components/MiniGameComponent';
import BadgeEarned from './components/BadgeEarned';
import Leaderboard from './components/Leaderboard';
import { GameProvider } from './contexts/GameContext';
import { gameConfigs } from './games/gameConfigs';
import { badges } from './data/badges';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro'); // intro, game, mini-game, badge, leaderboard
  const [dogName, setDogName] = useState('');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [completedGames, setCompletedGames] = useState([]);

  // Get ordered list of game keys
  const gameKeys = Object.keys(gameConfigs);

  const startGame = (name) => {
    setDogName(name);
    setCurrentScreen('game'); // Go to game selection, not directly to mini-game
  };

  const showLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const backToGame = () => {
    setCurrentScreen('game');
  };

  const resetGame = () => {
    setCurrentScreen('intro');
    setDogName('');
    setCurrentGameIndex(0);
    setEarnedBadge(null);
    setCompletedGames([]);
  };

  const handleGameSelect = (gameId) => {
    // Find the index of the selected game
    const gameIndex = gameKeys.findIndex(key => key === gameId);
    setCurrentGameIndex(gameIndex);
    setCurrentScreen('mini-game');
  };

  const handleGameComplete = (result) => {
    console.log('Game completed:', result);
    
    const currentGameKey = gameKeys[currentGameIndex];
    
    // Add to completed games
    if (!completedGames.includes(currentGameKey)) {
      setCompletedGames(prev => [...prev, currentGameKey]);
    }
    
    // Show badge for completed game
    const gameConfig = gameConfigs[currentGameKey];
    if (gameConfig && badges[currentGameKey]) {
      setEarnedBadge({
        badge: badges[currentGameKey],
        theme: gameConfig.theme,
        gameIndex: currentGameIndex,
        totalGames: gameKeys.length
      });
      setCurrentScreen('badge');
    } else {
      // No badge, move to next game or finish
      moveToNextGame();
    }
  };

  const moveToNextGame = () => {
    const nextIndex = currentGameIndex + 1;
    if (nextIndex < gameKeys.length) {
      setCurrentGameIndex(nextIndex);
      setCurrentScreen('mini-game');
    } else {
      // All games completed
      setCurrentScreen('game'); // Go back to game selection or show completion
    }
  };

  const handleContinueFromBadge = () => {
    setEarnedBadge(null);
    moveToNextGame();
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        {currentScreen !== 'mini-game' && currentScreen !== 'badge' && (
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                🐕 Fraud Detection Academy 🔍
              </h1>
              <p className="text-xl text-white/90">
                Train your digital companion to detect payment frauds!
              </p>
            </header>

            {currentScreen === 'intro' && (
              <GameIntro onStartGame={startGame} />
            )}

            {currentScreen === 'game' && (
              <GamePlay 
                dogName={dogName} 
                onShowLeaderboard={showLeaderboard}
                onResetGame={resetGame}
                onGameSelect={handleGameSelect}
              />
            )}

            {currentScreen === 'leaderboard' && (
              <Leaderboard 
                onBackToGame={backToGame}
                onResetGame={resetGame}
              />
            )}
          </div>
        )}

        {currentScreen === 'mini-game' && gameKeys[currentGameIndex] && (
          <MiniGameComponent
            gameId={gameKeys[currentGameIndex]}
            gameConfig={gameConfigs[gameKeys[currentGameIndex]]}
            dogName={dogName}
            onGameComplete={handleGameComplete}
          />
        )}

        {currentScreen === 'badge' && earnedBadge && (
          <BadgeEarned
            island={currentGameIndex + 1}
            onClose={handleContinueFromBadge}
            dogName={dogName}
          />
        )}
      </div>
    </GameProvider>
  );
}

export default App;
