import React, { useState, useEffect, useCallback } from 'react';
import gameConfigs from '../games/gameConfigs';

// Beautiful game data with proper themes and animations
const gameData = {
  "1": { 
    name: "Scam Scanner Village", 
    description: "Welcome to your first challenge! Learn to spot scam messages and protect yourself.", 
    levelName: "Novice Scout", 
    x: 15, 
    y: 85,
    gameKey: 'island1',
    icon: '🔍',
    bgGradient: 'from-emerald-300 via-emerald-400 to-emerald-500',
    glowColor: 'shadow-emerald-500/50',
    unlocked: true,
    completed: false
  },
  "2": { 
    name: "IT Security Forest", 
    description: "Navigate through the dangerous forest of IT security threats!", 
    levelName: "Security Recruit", 
    x: 25, 
    y: 65,
    gameKey: 'island2',
    icon: '🛡️',
    bgGradient: 'from-green-300 via-green-400 to-green-500',
    glowColor: 'shadow-green-500/50',
    unlocked: false,
    completed: false
  },
  "3": { 
    name: "WhatsApp Rapids", 
    description: "Dash through dangerous WhatsApp scams at lightning speed!", 
    levelName: "Speed Analyst", 
    x: 45, 
    y: 45,
    gameKey: 'island3',
    icon: '💨',
    bgGradient: 'from-blue-300 via-blue-400 to-blue-500',
    glowColor: 'shadow-blue-500/50',
    unlocked: false,
    completed: false
  },
  "4": { 
    name: "Message Runner Valley", 
    description: "Run and collect only the safe messages while avoiding scams!", 
    levelName: "Message Specialist", 
    x: 65, 
    y: 30,
    gameKey: 'island4',
    icon: '🏃‍♂️',
    bgGradient: 'from-purple-300 via-purple-400 to-purple-500',
    glowColor: 'shadow-purple-500/50',
    unlocked: false,
    completed: false
  },
  "5": { 
    name: "Scam Sleuth Mountains", 
    description: "Use your detective skills to solve complex scam mysteries!", 
    levelName: "Cyber Defender", 
    x: 80, 
    y: 20,
    gameKey: 'island5',
    icon: '🕵️',
    bgGradient: 'from-indigo-300 via-indigo-400 to-indigo-500',
    glowColor: 'shadow-indigo-500/50',
    unlocked: false,
    completed: false
  },
  "6": { 
    name: "Credit Stacker Peaks", 
    description: "Stack your way to financial safety by building good credit habits!", 
    levelName: "Finance Investigator", 
    x: 85, 
    y: 50,
    gameKey: 'island6',
    icon: '💳',
    bgGradient: 'from-yellow-300 via-yellow-400 to-yellow-500',
    glowColor: 'shadow-yellow-500/50',
    unlocked: false,
    completed: false
  },
  "7": { 
    name: "Shop Safe Harbor", 
    description: "Navigate safely through online shopping waters!", 
    levelName: "Shopping Sleuth", 
    x: 70, 
    y: 75,
    gameKey: 'island7',
    icon: '🛒',
    bgGradient: 'from-orange-300 via-orange-400 to-orange-500',
    glowColor: 'shadow-orange-500/50',
    unlocked: false,
    completed: false
  },
  "8": { 
    name: "Fraud Detective Station", 
    description: "Become a master detective and solve the most complex fraud cases!", 
    levelName: "Fraud Expert", 
    x: 45, 
    y: 85,
    gameKey: 'island8',
    icon: '🔎',
    bgGradient: 'from-cyan-300 via-cyan-400 to-cyan-500',
    glowColor: 'shadow-cyan-500/50',
    unlocked: false,
    completed: false
  },
  "9": { 
    name: "Memory Temple", 
    description: "Test your memory skills with security card matching challenges!", 
    levelName: "Memory Interceptor", 
    x: 25, 
    y: 85,
    gameKey: 'island9',
    icon: '🧠',
    bgGradient: 'from-pink-300 via-pink-400 to-pink-500',
    glowColor: 'shadow-pink-500/50',
    unlocked: false,
    completed: false
  },
  "10": { 
    name: "Final Quiz Sanctuary", 
    description: "The ultimate test! Prove your mastery of fraud detection!", 
    levelName: "Master Detective", 
    x: 15, 
    y: 15,
    gameKey: 'island10',
    icon: '🏆',
    bgGradient: 'from-violet-300 via-violet-400 to-violet-500',
    glowColor: 'shadow-violet-500/50',
    unlocked: false,
    completed: false
  }
};

const AdventureMap = ({ onStartGame, dogName = "Cyber" }) => {
  const [playerLevel, setPlayerLevel] = useState(1);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [storyStep, setStoryStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [playerPosition, setPlayerPosition] = useState({ x: -10, y: 85 });
  const [dogPosition, setDogPosition] = useState({ x: 15, y: 45 });
  const [dogState, setDogState] = useState('sad');
  const [islands, setIslands] = useState(gameData);
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [isWalking, setIsWalking] = useState(false);

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const showStoryModal = useCallback((icon, title, description, buttonText) => {
    setModalContent({ icon, title, description, buttonText });
    setShowModal(true);
  }, []);

  const hideStoryModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const moveCharacters = useCallback(async (islandId) => {
    const island = islands[islandId];
    setIsWalking(true);
    setPlayerPosition({ x: island.x - 5, y: island.y });
    setDogPosition({ x: island.x + 8, y: island.y });
    await wait(1500);
    setIsWalking(false);
  }, [islands]);

  const unlockIsland = useCallback((islandId) => {
    setIslands(prev => ({
      ...prev,
      [islandId]: { ...prev[islandId], unlocked: true }
    }));
  }, []);

  const completeIsland = useCallback((islandId) => {
    setIslands(prev => ({
      ...prev,
      [islandId]: { ...prev[islandId], completed: true }
    }));
    setGamesCompleted(prev => prev + 1);
    setPlayerLevel(prev => prev + 1);
  }, []);

  const handleIslandClick = useCallback((islandId) => {
    const island = islands[islandId];
    
    if (!island.unlocked) return;
    
    if (island.completed) {
      // Allow replaying completed games
      setSelectedIsland(islandId);
      showStoryModal(
        island.icon,
        `${island.name} (Completed)`,
        `${island.description}\n\nYou've already mastered this challenge! Want to play again?`,
        "Play Again"
      );
      return;
    }

    // New game
    setSelectedIsland(islandId);
    showStoryModal(
      island.icon,
      island.name,
      island.description,
      "Start Challenge"
    );
  }, [islands, showStoryModal]);

  const runIntroSequence = useCallback(async () => {
    await wait(1000);
    
    // 1. Show sad dog
    setDogState('sad');
    
    await wait(1000);
    
    // 2. Player walks to dog
    setIsWalking(true);
    setPlayerPosition({ x: 10, y: 45 });
    
    await wait(1500);
    setIsWalking(false);
    
    // 3. Start dialogue
    setStoryStep(1);
    showStoryModal(
      '🤔', 
      'A Lonely Cyber-Dog...', 
      "You find a sad cyber-dog sitting alone. His collar glows with a faint blue light - he seems to have special tech abilities but looks lost.", 
      "Approach Him"
    );
  }, [showStoryModal]);

  const handleModalButtonClick = useCallback(async () => {
    if (storyStep === 1) {
      setStoryStep(2);
      showStoryModal(
        '🧑‍💻', 
        "What's wrong, buddy?", 
        "The cyber-dog's eyes light up! 'WOOF! Fraud detected everywhere! Need human partner to stop cyber criminals!' A holographic badge appears: 'Fraud Detection Training Required'", 
        "Let's Team Up!"
      );
    } else if (storyStep === 2) {
      setStoryStep(0);
      hideStoryModal();
      
      // Transform dog to happy state
      setDogState('happy');
      
      // Unlock first island
      unlockIsland('1');
      
      // Move to first island
      await moveCharacters('1');
      
    } else if (selectedIsland && storyStep === 0) {
      // Launch the actual game
      hideStoryModal();
      const island = islands[selectedIsland];
      const gameConfig = gameConfigs[island.gameKey];
      
      if (gameConfig) {
        onStartGame(island.gameKey, {
          onComplete: (result) => {
            completeIsland(selectedIsland);
            
            // Unlock next island
            const nextIslandId = (parseInt(selectedIsland) + 1).toString();
            if (islands[nextIslandId]) {
              unlockIsland(nextIslandId);
              moveCharacters(nextIslandId);
            }
            
            // Show completion message
            setTimeout(() => {
              showStoryModal(
                '🎉',
                'Island Conquered!',
                `Fantastic work! You and ${dogName} have successfully completed ${island.name}. Your rank has been upgraded to ${island.levelName}!`,
                nextIslandId && islands[nextIslandId] ? 'Continue Adventure' : 'Finish Adventure'
              );
            }, 1000);
          }
        });
      }
    }
  }, [storyStep, selectedIsland, islands, dogName, hideStoryModal, showStoryModal, unlockIsland, completeIsland, moveCharacters, onStartGame]);

  useEffect(() => {
    runIntroSequence();
  }, [runIntroSequence]);

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-sky-300 via-sky-400 to-emerald-200 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Ocean waves */}
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 opacity-60">
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-80 animate-pulse"></div>
        </div>
        
        {/* Floating clouds */}
        <div className="absolute top-10 left-1/4 w-20 h-12 bg-white rounded-full opacity-70 animate-float"></div>
        <div className="absolute top-20 right-1/4 w-16 h-10 bg-white rounded-full opacity-60 animate-float-delayed"></div>
        <div className="absolute top-5 left-1/2 w-24 h-14 bg-white rounded-full opacity-50 animate-float-slow"></div>
      </div>

      {/* HUD */}
      <div className="absolute top-6 left-6 bg-gray-900/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-blue-400 shadow-2xl z-30">
        <div className="flex items-center gap-4">
          {/* Player Avatar */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-2xl">🧑‍💻</span>
            </div>
            {isWalking && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            )}
          </div>
          
          <div className="text-white">
            <div className="font-bold text-lg">Level {playerLevel}</div>
            <div className="text-sm text-blue-300">
              {gamesCompleted > 0 ? islands[gamesCompleted.toString()]?.levelName || "Novice Scout" : "Novice Scout"}
            </div>
          </div>
          
          {/* Dog Avatar */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-500 ${
            dogState === 'sad' 
              ? 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300 animate-bounce' 
              : 'bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300 animate-pulse'
          }`}>
            <span className="text-2xl">{dogState === 'sad' ? '😢' : '🤖'}</span>
          </div>
          
          <div className="text-white">
            <div className="font-bold text-lg">{dogName}</div>
            <div className="text-sm text-cyan-300">
              {dogState === 'sad' ? 'Lost & Sad' : 'Cyber Guardian'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-purple-400 shadow-2xl z-30">
        <div className="text-white mb-2 font-bold">Adventure Progress</div>
        <div className="w-48 bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(gamesCompleted / 10) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-300 mt-1">{gamesCompleted}/10 Islands Conquered</div>
      </div>

      {/* Characters */}
      <div 
        className={`absolute transition-all duration-1500 ease-in-out z-20 ${isWalking ? 'animate-bounce' : ''}`}
        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
      >
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
            <span className="text-xl">🧑‍💻</span>
          </div>
          {isWalking && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap">
              Walking...
            </div>
          )}
        </div>
      </div>

      <div 
        className={`absolute transition-all duration-1500 ease-in-out z-20 ${dogState === 'sad' ? 'animate-pulse' : ''}`}
        style={{ left: `${dogPosition.x}%`, top: `${dogPosition.y}%` }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 border-white shadow-lg transition-all duration-500 ${
          dogState === 'sad' 
            ? 'bg-gradient-to-br from-gray-400 to-gray-600' 
            : 'bg-gradient-to-br from-cyan-400 to-cyan-600 animate-pulse'
        }`}>
          <span className="text-xl">{dogState === 'sad' ? '🐕' : '🤖'}</span>
        </div>
      </div>

      {/* Islands */}
      {Object.entries(islands).map(([id, island]) => {
        const isUnlocked = island.unlocked;
        const isCompleted = island.completed;
        
        return (
          <div key={id} className="absolute z-10">
            {/* Island Base */}
            <div 
              className={`absolute w-24 h-24 rounded-full ${
                isUnlocked ? island.bgGradient : 'from-gray-400 to-gray-600'
              } bg-gradient-to-br opacity-80 shadow-lg`}
              style={{ left: `${island.x}%`, top: `${island.y}%` }}
            ></div>
            
            {/* Island Hotspot */}
            <div 
              className={`absolute w-20 h-20 rounded-full cursor-pointer transition-all duration-300 ${
                isUnlocked 
                  ? `bg-gradient-to-br ${island.bgGradient} hover:scale-110 ${island.glowColor} shadow-2xl ${!isCompleted ? 'animate-pulse' : ''}` 
                  : 'bg-gradient-to-br from-gray-500 to-gray-700 cursor-not-allowed opacity-50'
              } ${isCompleted ? 'ring-4 ring-yellow-400 ring-opacity-60' : ''}`}
              style={{ left: `${island.x + 2}%`, top: `${island.y + 2}%` }}
              onClick={() => handleIslandClick(id)}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center relative">
                <span className="text-3xl filter drop-shadow-lg">{island.icon}</span>
                
                {/* Completion Crown */}
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin-slow">
                    <span className="text-sm">👑</span>
                  </div>
                )}
                
                {/* Unlock Glow Effect */}
                {isUnlocked && !isCompleted && (
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
                )}
              </div>
            </div>
            
            {/* Island Label */}
            <div 
              className="absolute text-center pointer-events-none"
              style={{ left: `${island.x - 8}%`, top: `${island.y + 18}%` }}
            >
              <div className={`bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border-2 ${
                isUnlocked ? 'border-white' : 'border-gray-500'
              }`}>
                {island.name}
              </div>
              {isCompleted && (
                <div className="text-xs text-yellow-400 font-bold mt-1">✓ COMPLETED</div>
              )}
            </div>
            
            {/* Connection Paths */}
            {id < "10" && islands[(parseInt(id) + 1).toString()]?.unlocked && (
              <div 
                className="absolute w-1 bg-white/40 origin-top transform"
                style={{
                  left: `${island.x + 10}%`,
                  top: `${island.y + 12}%`,
                  height: `${Math.abs(islands[(parseInt(id) + 1).toString()].y - island.y) * 2}px`,
                  transform: `rotate(${Math.atan2(
                    islands[(parseInt(id) + 1).toString()].y - island.y,
                    islands[(parseInt(id) + 1).toString()].x - island.x
                  ) * 180 / Math.PI}deg)`
                }}
              ></div>
            )}
          </div>
        );
      })}

      {/* Story Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-4 border-blue-400 transform animate-scaleIn">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">{modalContent.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{modalContent.title}</h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed whitespace-pre-line">{modalContent.description}</p>
              <button 
                onClick={handleModalButtonClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {modalContent.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdventureMap;

  const runIntroSequence = useCallback(async () => {
    await wait(1000);
    setDogState('sad');
    await wait(1000);
    
    // Player walks to dog
    await moveCharacters(5, 45);
    
    setStoryStep(1);
    showStoryModal(
      '🤔', 
      'A Sad Puppy...', 
      "You find a lonely puppy in the forest. He looks lost and sad.", 
      "Check on him"
    );
  }, [moveCharacters, showStoryModal]);

  const onModalButtonClick = useCallback(async () => {
    if (storyStep === 1) {
      setStoryStep(2);
      showStoryModal(
        '🧑',
        "What's wrong, little guy?", 
        "The boy kneels. 'You seem smart... but lost. I'm on a big adventure to stop cyber fraudsters. Want to join me?'", 
        "..."
      );
    } else if (storyStep === 2) {
      setStoryStep(3);
      showStoryModal(
        '🐶✨', 
        'A Spark of Tech!', 
        "The dog's eyes light up! A small microchip is visible on his collar. He barks and a 'Fraud Detected!' icon flashes above his head. He has tech power!", 
        "Whoa! You're a Cyber-Dog!"
      );
    } else if (storyStep === 3) {
      setStoryStep(0);
      hideStoryModal();
      
      // Transform dog
      setDogState('cyber');
      
      // Move to first island and start adventure
      await moveCharacters(gameData[1].x, gameData[1].y);
      
    } else if (storyStep === 'launch-game') {
      setStoryStep(0);
      hideStoryModal();
      
      // Launch the actual game
      if (selectedGame && onGameComplete) {
        onGameComplete(selectedGame, gameData[activeGameId]);
      }
      
    } else if (storyStep === 'game-complete') {
      setStoryStep(0);
      hideStoryModal();
      
      // Update progress
      const newGamesCompleted = gamesCompleted + 1;
      setGamesCompleted(newGamesCompleted);
      setPlayerLevel(playerLevel + 1);
      
      // Move to next island if available
      const nextIslandId = newGamesCompleted + 1;
      if (gameData[nextIslandId]) {
        const nextGame = gameData[nextIslandId];
        await moveCharacters(nextGame.x, nextGame.y);
      } else {
        // All games finished!
        await wait(1000);
        showStoryModal('🏆', 'Adventure Complete!', 'You and your Cyber-Dog have stopped all the fraudsters and become true masters!', 'Amazing!');
        setStoryStep('complete');
      }
    } else if (storyStep === 'complete') {
      // Adventure completed
      hideStoryModal();
    }
  }, [storyStep, gamesCompleted, playerLevel, activeGameId, selectedGame, onGameComplete, showStoryModal, hideStoryModal, moveCharacters]);

  const onIslandClick = useCallback((islandId) => {
    // Only allow clicking the next island in sequence
    if (parseInt(islandId) !== gamesCompleted + 1) {
      return;
    }

    setActiveGameId(islandId);
    const game = gameData[islandId];
    const gameConfig = gameConfigs[game.island];
    setSelectedGame(gameConfig);
    
    setStoryStep('launch-game');
    showStoryModal(
      '🎮',
      game.name,
      `${game.description}<br/><br/>Ready to start this challenge?`,
      "Start Game!"
    );
  }, [gamesCompleted, showStoryModal]);

  // Handle game completion from parent
  const handleGameComplete = useCallback((result) => {
    setStoryStep('game-complete');
    showStoryModal(
      '🎉', 
      'Level Complete!', 
      `You and your Cyber-Dog finished the ${gameData[activeGameId].name} challenge! Your skills have grown.`, 
      "Awesome!"
    );
  }, [activeGameId, showStoryModal]);

  // Expose the game completion handler to parent
  React.useEffect(() => {
    if (onGameComplete && typeof onGameComplete === 'function') {
      // Store reference for when games complete
      window.adventureMapRef = { handleGameComplete };
    }
  }, [handleGameComplete, onGameComplete]);

  useEffect(() => {
    runIntroSequence();
  }, [runIntroSequence]);

  const renderIsland = (id, style, children, isUnlocked) => {
    const canClick = isUnlocked && parseInt(id) === gamesCompleted + 1;
    return (
      <div
        key={id}
        className={`island-hotspot absolute cursor-pointer transition-all duration-300 w-24 h-24 flex items-center justify-center ${
          canClick ? 'island-unlocked' : 'island-locked'
        }`}
        style={style}
        onClick={() => canClick && onIslandClick(id)}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f3e8' }}>
      <div 
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{ 
          width: '1400px', 
          height: '800px', 
          backgroundColor: '#e0cda7',
          border: '10px solid #8c6d4e'
        }}
      >
        {/* Ocean Background */}
        <div 
          className="absolute bottom-0 left-0 w-full"
          style={{ 
            height: '65%',
            background: 'linear-gradient(to top, #4A90E2, #89CFF0)'
          }}
        />
        
        {/* Grass Mainland */}
        <div 
          className="absolute left-0 w-full"
          style={{ 
            bottom: '60%',
            height: '40%',
            backgroundColor: '#78a368',
            borderBottom: '10px solid #5a8a49',
            clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 60% 80%, 40% 100%, 20% 80%, 0 100%)'
          }}
        />

        {/* Player Character */}
        <div
          className="absolute transition-all duration-1500 ease-in-out z-20"
          style={{ 
            top: `${playerPosition.y}%`, 
            left: `${playerPosition.x}%`,
            width: '32px',
            height: '48px'
          }}
        >
          <div className="pixel-boy" />
        </div>

        {/* Dog Character */}
        <div
          className={`absolute transition-all duration-1500 ease-in-out z-20 w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white border-4 border-white shadow-lg ${
            dogState === 'sad' ? 'bg-yellow-700 sad-bob' : 'bg-blue-600'
          }`}
          style={{ 
            top: `${dogPosition.y}%`, 
            left: `${dogPosition.x}%`
          }}
        >
          {dogState === 'sad' ? '🐕' : '🛡️'}
        </div>

        {/* Islands */}
        
        {/* Island 1: Start Town */}
        {renderIsland('1', { top: '85%', left: '3%' }, 
          <div className="house bg-amber-200 border-4 border-amber-800 rounded w-12 h-10 relative">
            <div className="absolute -top-6 -left-1 w-14 h-6 bg-amber-900 border-2 border-amber-800" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>, 
          true
        )}

        {/* Island 2: Forest */}
        <div className="island-base absolute rounded-full z-5 bg-green-400 border-4 border-green-600" 
             style={{ top: '68%', left: '20%', width: '120px', height: '120px' }} />
        {renderIsland('2', { top: '68%', left: '20%' }, 
          <div className="forest relative w-20 h-20">
            <div className="tree absolute bg-green-700 w-5 h-8 rounded-t-full border-2 border-green-800" style={{ top: '10px', left: '30px' }} />
            <div className="tree absolute bg-green-700 w-4 h-6 rounded-t-full border-2 border-green-800" style={{ top: '40px', left: '10px' }} />
            <div className="tree absolute bg-green-700 w-4 h-6 rounded-t-full border-2 border-green-800" style={{ top: '40px', left: '50px' }} />
          </div>, 
          gamesCompleted >= 1
        )}

        {/* Island 3: Volcano */}
        <div className="island-base absolute rounded-full z-5 bg-gray-600 border-4 border-gray-800" 
             style={{ top: '45%', left: '30%', width: '150px', height: '150px' }} />
        {renderIsland('3', { top: '45%', left: '31%' }, 
          <div className="volcano relative w-28 h-24 bg-gray-600" 
               style={{ clipPath: 'polygon(0 100%, 20% 40%, 40% 50%, 50% 30%, 60% 50%, 80% 40%, 100% 100%)' }}>
            <div className="absolute top-6 left-10 w-8 h-5 bg-red-500 rounded-full" />
          </div>, 
          gamesCompleted >= 2
        )}

        {/* Island 4: Waterfall */}
        <div className="island-base absolute rounded-full z-5 bg-green-400 border-4 border-green-600" 
             style={{ top: '35%', left: '45%', width: '120px', height: '120px' }} />
        {renderIsland('4', { top: '35%', left: '46%' }, 
          <div className="waterfall relative w-20 h-24">
            <div className="w-full h-full bg-gray-500 rounded-lg" />
            <div className="absolute top-2 left-3 w-3/4 h-5/6 bg-blue-300 rounded" />
          </div>, 
          gamesCompleted >= 3
        )}

        {/* Island 5: Mountain */}
        <div className="island-base absolute rounded-full z-5 bg-green-400 border-4 border-green-600" 
             style={{ top: '15%', left: '58%', width: '140px', height: '140px' }} />
        {renderIsland('5', { top: '15%', left: '59%' }, 
          <div className="mountain-range relative w-24 h-20">
            <div className="mountain absolute bg-gray-400 border-4 border-gray-600 w-16 h-20 z-12" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="mountain absolute bg-gray-500 border-4 border-gray-700 w-12 h-12 z-11" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', left: '40px', top: '20px' }} />
          </div>, 
          gamesCompleted >= 4
        )}

        {/* Island 6: Shipwreck */}
        <div className="island-base absolute rounded-full z-5 bg-yellow-300 border-4 border-yellow-600" 
             style={{ top: '35%', left: '75%', width: '100px', height: '100px' }} />
        {renderIsland('6', { top: '35%', left: '76%' }, 
          <div className="ship w-16 h-12 bg-amber-800 border-4 border-amber-900 rounded-b-3xl transform -rotate-12" />, 
          gamesCompleted >= 5
        )}

        {/* Island 7: Dense Forest */}
        <div className="island-base absolute rounded-full z-5 bg-green-400 border-4 border-green-600" 
             style={{ top: '60%', left: '78%', width: '120px', height: '120px' }} />
        {renderIsland('7', { top: '60%', left: '78%' }, 
          <div className="forest relative w-20 h-20">
            <div className="tree absolute bg-green-700 w-6 h-10 rounded-t-full border-2 border-green-800" style={{ top: '10px', left: '30px' }} />
            <div className="tree absolute bg-green-700 w-5 h-8 rounded-t-full border-2 border-green-800" style={{ top: '40px', left: '10px' }} />
            <div className="tree absolute bg-green-700 w-5 h-8 rounded-t-full border-2 border-green-800" style={{ top: '40px', left: '50px' }} />
          </div>, 
          gamesCompleted >= 6
        )}

        {/* Island 8: Rocky Pass */}
        <div className="island-base absolute rounded-full z-5 bg-green-400 border-4 border-green-600" 
             style={{ top: '80%', left: '55%', width: '140px', height: '140px' }} />
        {renderIsland('8', { top: '80%', left: '56%' }, 
          <div className="mountain-range relative w-24 h-20">
            <div className="mountain absolute bg-gray-300 border-4 border-gray-500 w-16 h-20 z-12" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="mountain absolute bg-gray-400 border-4 border-gray-600 w-12 h-12 z-11" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', left: '40px', top: '20px' }} />
          </div>, 
          gamesCompleted >= 7
        )}

        {/* Island 9: Pirate Ship */}
        {renderIsland('9', { top: '78%', left: '36%' }, 
          <div className="ship w-16 h-12 bg-amber-800 border-4 border-amber-900 rounded-b-3xl" />, 
          gamesCompleted >= 8
        )}

        {/* Island 10: Treasure */}
        {renderIsland('10', { top: '15%', left: '8%' }, 
          <div className="treasure-chest relative w-20 h-12 bg-amber-800 border-4 border-amber-900 rounded-lg">
            <div className="absolute -top-5 -left-1 w-20 h-8 bg-amber-800 border-4 border-amber-900 rounded-t-2xl" />
          </div>, 
          gamesCompleted >= 9
        )}

        {/* Path Arrows */}
        {gamesCompleted >= 0 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '82%', left: '10%' }}>↘️</div>
        )}
        {gamesCompleted >= 1 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '70%', left: '15%' }}>➡️</div>
        )}
        {gamesCompleted >= 2 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '62%', left: '28%' }}>↗️</div>
        )}
        {gamesCompleted >= 3 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '40%', left: '40%' }}>➡️</div>
        )}
        {gamesCompleted >= 4 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '30%', left: '55%' }}>↗️</div>
        )}
        {gamesCompleted >= 5 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '25%', left: '70%' }}>↘️</div>
        )}
        {gamesCompleted >= 6 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '50%', left: '80%' }}>⬇️</div>
        )}
        {gamesCompleted >= 7 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '75%', left: '70%' }}>↙️</div>
        )}
        {gamesCompleted >= 8 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '75%', left: '48%' }}>⬅️</div>
        )}
        {gamesCompleted >= 9 && (
          <div className="path-arrow absolute text-5xl text-white opacity-60 animate-pulse" style={{ top: '50%', left: '10%' }}>⬆️</div>
        )}
      </div>

      {/* Player HUD */}
      <div className="absolute top-5 left-5 bg-gray-900 text-white p-4 rounded-xl flex items-center gap-4 border-2 border-gray-600 z-30">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-4 border-white">
          <div className="pixel-boy transform scale-75" />
        </div>
        <div>
          <p className="font-bold">Level {playerLevel}: {gameData[gamesCompleted + 1]?.levelName || 'Master'}</p>
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-2xl ${
          dogState === 'cyber' ? 'bg-blue-600' : 'bg-gray-500 opacity-30'
        }`}>
          {dogState === 'cyber' ? '🛡️' : '🐕'}
        </div>
        <div>
          <p className="font-bold">Cyber-Dog</p>
        </div>
      </div>

      {/* Story Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white text-gray-900 p-8 rounded-xl max-w-lg text-center shadow-2xl">
            <div className="text-6xl mb-4">{modalContent.icon}</div>
            <h2 className="text-3xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: modalContent.description }} />
            <button 
              onClick={onModalButtonClick}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-700 transition-colors"
            >
              {modalContent.buttonText}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .pixel-boy {
          width: 32px;
          height: 48px;
          background-image: 
            linear-gradient(to right, #6D4C41 10px, transparent 10px),
            linear-gradient(to right, #FFCCBC 10px, transparent 10px),
            linear-gradient(to right, #2196F3 10px, transparent 10px),
            linear-gradient(to right, #1976D2 10px, transparent 10px),
            linear-gradient(to right, #6D4C41 5px, transparent 5px),
            linear-gradient(to right, #6D4C41 5px, transparent 5px);
          background-position: 11px 0, 11px 8px, 11px 18px, 11px 30px, 13px 38px, 18px 38px;
          background-size: 10px 8px, 10px 10px, 10px 12px, 10px 8px, 5px 10px, 5px 10px;
          background-repeat: no-repeat;
          border-top: 8px solid transparent;
          border-left: 14px solid transparent;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
        }
        .pixel-boy::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: black;
          top: 13px;
          left: 17px;
          box-shadow: 4px 0 0 black;
        }
        .island-unlocked {
          outline: 6px dashed white;
          outline-offset: 10px;
          border-radius: 50%;
          animation: glow 1.5s ease-in-out infinite;
        }
        .island-unlocked:hover {
          transform: scale(1.1);
        }
        .island-locked {
          cursor: not-allowed;
          filter: grayscale(80%) opacity(0.5);
        }
        .sad-bob {
          animation: sad-bob 2s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px 8px rgba(255, 255, 255, 0.7); }
          50% { box-shadow: 0 0 30px 15px rgba(255, 255, 255, 0.3); }
        }
        @keyframes sad-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
};

export default AdventureMap;