import React, { useState } from 'react';
import './App.css';
import GameIntro from './components/GameIntro';
import GamePlay from './components/GamePlay';
import IslandSelector from './components/IslandSelector';
import Leaderboard from './components/Leaderboard';
import { GameProvider } from './contexts/GameContext';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro'); // intro, game, islands, leaderboard
  const [dogName, setDogName] = useState('');

  const startGame = (name) => {
    setDogName(name);
    setCurrentScreen('game');
  };

  const startIslandMode = (name) => {
    setDogName(name);
    setCurrentScreen('islands');
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
  };

  const handleIslandGameComplete = (result) => {
    // For now, just stay in island mode
    console.log('Island game completed:', result);
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
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
            <GameIntro onStartGame={startGame} onStartIslandMode={startIslandMode} />
          )}

          {currentScreen === 'game' && (
            <GamePlay 
              dogName={dogName} 
              onShowLeaderboard={showLeaderboard}
              onResetGame={resetGame}
            />
          )}

          {currentScreen === 'islands' && (
            <IslandSelector
              dogName={dogName}
              onGameComplete={handleIslandGameComplete}
              onReturnToMap={resetGame}
            />
          )}

          {currentScreen === 'leaderboard' && (
            <Leaderboard 
              onBackToGame={backToGame}
              onResetGame={resetGame}
            />
          )}
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
