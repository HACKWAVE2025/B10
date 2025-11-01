import React, { useState, useEffect, useRef, useMemo } from 'react';

const WhatsAppDashGame = ({ onGameComplete, dogName, island, theme }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameIntervalRef = useRef(null);
  const packetCounterRef = useRef(0);
  const spawnRateRef = useRef(2000);
  const packetSpeedRef = useRef(10);

  // Threat types configuration
  const threatTypes = useMemo(() => [
    { type: 'virus', class: 'bg-red-600', icon: '🦠', patch: 'virus' },
    { type: 'spyware', class: 'bg-blue-600', icon: '👁️', patch: 'spyware' },
    { type: 'ransomware', class: 'bg-orange-600', icon: '💀', patch: 'ransomware' }
  ], []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    spawnRateRef.current = 2000;
    packetSpeedRef.current = 10;
    setGameState('playing');
    
    // Clear any existing packets
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.querySelectorAll('.packet').forEach(p => p.remove());
    }
  };

  const endGame = () => {
    setGameState('gameOver');
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    
    // Clear packets
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.querySelectorAll('.packet').forEach(p => p.remove());
    }
  };

  const handleDragStart = (e, patchType) => {
    e.dataTransfer.setData('text/plain', patchType);
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (gameState === 'start') {
          startGame();
        } else if (gameState === 'gameOver') {
          startGame();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState]);

  // Separate useEffect for managing the game interval
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        packetCounterRef.current++;
        const packetId = `packet-${packetCounterRef.current}`;
        
        const packetEl = document.createElement('div');
        packetEl.id = packetId;
        packetEl.className = `packet absolute w-12 h-12 rounded-full text-white flex justify-center items-center text-2xl shadow-lg animate-pulse ${threat.class}`;
        packetEl.style.top = '50%';
        packetEl.style.left = '-100px';
        packetEl.style.transform = 'translateY(-50%)';
        packetEl.style.animation = `move-packet ${packetSpeedRef.current}s linear forwards`;
        packetEl.dataset.packetType = threat.patch;
        
        packetEl.innerHTML = threat.icon;
        
        // Drag and drop event listeners
        packetEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          packetEl.style.transform = 'translateY(-50%) scale(1.1)';
        });
        
        packetEl.addEventListener('dragleave', () => {
          packetEl.style.transform = 'translateY(-50%) scale(1)';
        });
        
        packetEl.addEventListener('drop', (e) => {
          e.preventDefault();
          const draggedPatchType = e.dataTransfer.getData('text/plain');
          const packetType = packetEl.dataset.packetType;
          
          if (draggedPatchType === packetType) {
            // Success - remove packet and increase score
            packetEl.remove();
            setScore(prev => prev + 100);
          } else {
            // Fail - reset transform
            packetEl.style.transform = 'translateY(-50%) scale(1)';
          }
        });
        
        // Handle packet reaching the end
        packetEl.addEventListener('animationend', (e) => {
          if (!e.target.parentElement) return;
          
          e.target.remove();
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(() => {
                setGameState('gameOver');
                clearInterval(interval);
              }, 100);
            }
            return newLives;
          });
          
          // Shake effect on data core
          const core = document.getElementById('data-core');
          if (core) {
            core.style.animation = 'shake 0.5s';
            setTimeout(() => core.style.animation = '', 500);
          }
        });

        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
          gameBoard.appendChild(packetEl);
        }
      }, spawnRateRef.current);
      
      gameIntervalRef.current = interval;
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [gameState, threatTypes]);

  return (
    <div className="min-h-screen bg-gray-800 text-white overflow-hidden">
      <style>{`
        @keyframes move-packet {
          from { left: -100px; }
          to { left: calc(100% - 60px); }
        }
        
        @keyframes shake {
          0% { transform: translateY(-50%) translateX(0); }
          25% { transform: translateY(-50%) translateX(-5px); }
          50% { transform: translateY(-50%) translateX(5px); }
          75% { transform: translateY(-50%) translateX(-5px); }
          100% { transform: translateY(-50%) translateX(0); }
        }
      `}</style>

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-95 flex flex-col justify-center items-center text-center p-4 z-50">
          <h1 className="text-6xl font-bold text-white mb-6">Data Breach Defender</h1>
          
          <div className="max-w-2xl w-full bg-gray-900 p-6 rounded-lg shadow-2xl mb-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">How to Play</h2>
            <p className="text-gray-300 text-lg mb-6">Drag the correct Security Patch onto the matching threat to destroy it!</p>
            <ul className="space-y-4 text-left text-lg">
              <li className="flex items-center">
                <div className="bg-green-600 w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center mr-4 border-2 border-green-400">🛡️</div>
                <span className="text-gray-300">Drag <strong className="text-green-400">Antivirus</strong> onto <strong className="text-red-500">Virus</strong> packets.</span>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-600 w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center mr-4 border-2 border-blue-400">🔥</div>
                <span className="text-gray-300">Drag <strong className="text-blue-400">Firewall</strong> onto <strong className="text-blue-500">Spyware</strong> packets.</span>
              </li>
              <li className="flex items-center">
                <div className="bg-orange-600 w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center mr-4 border-2 border-orange-400">🔒</div>
                <span className="text-gray-300">Drag <strong className="text-orange-400">Quarantine</strong> onto <strong className="text-orange-500">Ransomware</strong> packets.</span>
              </li>
            </ul>
            <p className="text-gray-400 text-md mt-6">Don't let 3 threats reach your Data Core!</p>
          </div>
          
          <button 
            onClick={startGame}
            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-blue-700 transition duration-300"
          >
            Start Defense (Press Enter)
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-95 flex flex-col justify-center items-center z-50">
          <h1 className="text-4xl font-bold text-white mb-4">Breach Detected!</h1>
          <p className="text-gray-300 text-xl mb-6">Your final score:</p>
          <div className="text-8xl font-bold text-blue-400 mb-10">{score}</div>
          <div className="space-x-4">
            <button 
              onClick={startGame}
              className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-blue-700 transition duration-300"
            >
              Restart System (Press Enter)
            </button>
            <button 
              onClick={() => onGameComplete({ passed: score >= 300, score: score, gameType: 'data-breach-defender' })}
              className="bg-gray-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-gray-700 transition duration-300"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}

      {/* Main Game UI */}
      {gameState === 'playing' && (
        <div className="w-full h-full flex flex-col relative">
          {/* Stats Bar */}
          <div className="w-full flex justify-between items-center bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-xl mb-4 z-40">
            <div>
              <span className="text-gray-400 text-lg">Score:</span>
              <span className="font-bold text-3xl text-blue-400 ml-2">{score}</span>
            </div>
            <div>
              <span className="text-gray-400 text-lg">Lives:</span>
              <span className="font-bold text-3xl text-red-500 ml-2">{lives}</span>
            </div>
          </div>

          {/* Game Board */}
          <div 
            id="game-board" 
            className="relative w-full h-96 bg-gray-900 border-4 border-gray-600 overflow-hidden mb-4"
          >
            {/* Network Path */}
            <div className="absolute top-1/2 left-0 w-full h-5 bg-gray-800 shadow-inner transform -translate-y-1/2"></div>
            
            {/* Data Core */}
            <div 
              id="data-core"
              className="absolute top-1/2 right-0 w-20 h-28 bg-blue-500 border-4 border-blue-300 rounded-lg shadow-lg transform -translate-y-1/2 flex justify-center items-center z-10"
            >
              <span className="text-5xl text-blue-200">💾</span>
            </div>
          </div>

          {/* Patch Toolbar */}
          <div className="w-full flex justify-center space-x-6 z-40">
            <div 
              className="w-24 h-24 bg-green-600 border-4 border-green-400 rounded-lg flex flex-col justify-center items-center font-semibold cursor-grab hover:scale-105 transition-transform"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'virus')}
              onDragEnd={handleDragEnd}
            >
              <span className="text-4xl">🛡️</span>
              <span className="text-xs">Antivirus</span>
            </div>
            <div 
              className="w-24 h-24 bg-blue-600 border-4 border-blue-400 rounded-lg flex flex-col justify-center items-center font-semibold cursor-grab hover:scale-105 transition-transform"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'spyware')}
              onDragEnd={handleDragEnd}
            >
              <span className="text-4xl">🔥</span>
              <span className="text-xs">Firewall</span>
            </div>
            <div 
              className="w-24 h-24 bg-orange-600 border-4 border-orange-400 rounded-lg flex flex-col justify-center items-center font-semibold cursor-grab hover:scale-105 transition-transform"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'ransomware')}
              onDragEnd={handleDragEnd}
            >
              <span className="text-4xl">🔒</span>
              <span className="text-xs">Quarantine</span>
            </div>
          </div>

          {/* Exit Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => onGameComplete({ passed: score >= 300, score: score, gameType: 'data-breach-defender' })}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppDashGame;