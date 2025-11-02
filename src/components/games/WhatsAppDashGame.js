import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const WhatsAppDashGame = ({ onGameComplete, dogName, island, theme }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameIntervalRef = useRef(null);
  const packetCounterRef = useRef(0);
  const spawnRateRef = useRef(2000);
  const packetSpeedRef = useRef(12); // Slower for easier gameplay
  
  // Audio system
  const audioContext = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Audio system for game 3 - different from games 1 & 2
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'patch-success':
        // Successful patch applied - digital success
        oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      
      case 'patch-fail':
        // Wrong patch applied - error buzz
        oscillator.frequency.setValueAtTime(180, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      
      case 'threat-spawn':
        // New threat appears - warning blip
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;
      
      case 'life-lost':
        // Lost a life - danger alarm
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(400, ctx.currentTime + i * 0.15);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.1);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.1);
        }
        break;
      
      case 'drag-start':
        // Patch picked up - soft click
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      
      case 'hover':
        // Hovering over valid target - soft tone
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }
  }, [audioEnabled]);

  // Threat types configuration
  const threatTypes = useMemo(() => [
    { type: 'virus', class: 'bg-blue-600', icon: '📦', patch: 'virus' },
    { type: 'spyware', class: 'bg-blue-600', icon: '👁️', patch: 'spyware' },
    { type: 'ransomware', class: 'bg-orange-600', icon: '💀', patch: 'ransomware' }
  ], []);

  const startGame = useCallback(() => {
    // Initialize audio context on user interaction
    initAudio();
    
    setScore(0);
    setLives(3);
    spawnRateRef.current = 2500; // Slightly slower spawn for easier gameplay
    packetSpeedRef.current = 12; // Slower movement for easier targeting
    setGameState('playing');
    
    // Clear any existing packets
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.querySelectorAll('.packet').forEach(p => p.remove());
    }
  }, [initAudio]);

  const handleDragStart = (e, patchType) => {
    playSound('drag-start');
    e.dataTransfer.setData('text/plain', patchType);
    setTimeout(() => {
      e.target.style.opacity = '0.8';
      e.target.style.transform = 'scale(1.1)';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    e.target.style.transform = 'scale(1)';
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
  }, [gameState, startGame]);

  // Separate useEffect for managing the game interval
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        packetCounterRef.current++;
        const packetId = `packet-${packetCounterRef.current}`;
        
        // Play threat spawn sound
        playSound('threat-spawn');
        
        const packetEl = document.createElement('div');
        packetEl.id = packetId;
        packetEl.className = `packet absolute w-16 h-20 rounded-lg text-white flex flex-col justify-center items-center text-2xl shadow-lg border-4 ${threat.class}`;
        packetEl.style.top = '50%';
        packetEl.style.left = '-100px';
        packetEl.style.transform = 'translateY(-50%)';
        packetEl.style.animation = `move-packet ${packetSpeedRef.current}s linear forwards`;
        packetEl.style.cursor = 'pointer';
        packetEl.style.transition = 'all 0.2s ease';
        packetEl.dataset.packetType = threat.patch;
        
        // Create icon and label structure
        packetEl.innerHTML = `
          <div class="text-2xl mb-1">${threat.icon}</div>
          <div class="text-xs font-bold uppercase tracking-wide">${threat.type}</div>
        `;
        
        // Enhanced drag and drop event listeners with better visual feedback
        packetEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          playSound('hover');
          packetEl.style.transform = 'translateY(-50%) scale(1.1)';
          packetEl.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
          packetEl.style.borderColor = '#ffffff';
        });
        
        packetEl.addEventListener('dragleave', () => {
          packetEl.style.transform = 'translateY(-50%) scale(1)';
          packetEl.style.boxShadow = '';
          packetEl.style.borderColor = '';
        });
        
        packetEl.addEventListener('drop', (e) => {
          e.preventDefault();
          const draggedPatchType = e.dataTransfer.getData('text/plain');
          const packetType = packetEl.dataset.packetType;
          
          if (draggedPatchType === packetType) {
            // Success - remove packet and increase score
            playSound('patch-success');
            packetEl.style.transform = 'translateY(-50%) scale(0)';
            packetEl.style.opacity = '0';
            setTimeout(() => packetEl.remove(), 200);
            setScore(prev => prev + 100);
            
            // Visual success effect
            const successEffect = document.createElement('div');
            successEffect.innerHTML = '+100';
            successEffect.style.position = 'absolute';
            successEffect.style.left = packetEl.style.left;
            successEffect.style.top = '30%';
            successEffect.style.color = '#00ff00';
            successEffect.style.fontSize = '24px';
            successEffect.style.fontWeight = 'bold';
            successEffect.style.pointerEvents = 'none';
            successEffect.style.animation = 'fade-up 1s ease-out forwards';
            
            const gameBoard = document.getElementById('game-board');
            if (gameBoard) {
              gameBoard.appendChild(successEffect);
              setTimeout(() => successEffect.remove(), 1000);
            }
          } else {
            // Fail - shake and reset transform
            playSound('patch-fail');
            packetEl.style.transform = 'translateY(-50%) scale(1)';
            packetEl.style.animation = 'shake-packet 0.5s ease-in-out';
            setTimeout(() => {
              packetEl.style.animation = `move-packet ${packetSpeedRef.current}s linear forwards`;
            }, 500);
          }
        });
        
        // Handle packet reaching the end with improved feedback
        packetEl.addEventListener('animationend', (e) => {
          if (!e.target.parentElement) return;
          
          playSound('life-lost');
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
          
          // Enhanced shake effect on data core
          const core = document.getElementById('data-core');
          if (core) {
            core.style.animation = 'shake-core 0.8s ease-in-out';
            core.style.borderColor = '#ff0000';
            setTimeout(() => {
              core.style.animation = '';
              core.style.borderColor = '';
            }, 800);
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
  }, [gameState, threatTypes, playSound]);

  return (
    <div className="min-h-screen bg-gray-800 text-white overflow-hidden">
      <style>{`
        @keyframes move-packet {
          from { left: -100px; }
          to { left: calc(100% - 80px); }
        }
        
        @keyframes shake-core {
          0% { transform: translateY(-50%) translateX(0); }
          10% { transform: translateY(-50%) translateX(-10px); }
          20% { transform: translateY(-50%) translateX(10px); }
          30% { transform: translateY(-50%) translateX(-10px); }
          40% { transform: translateY(-50%) translateX(10px); }
          50% { transform: translateY(-50%) translateX(-5px); }
          60% { transform: translateY(-50%) translateX(5px); }
          70% { transform: translateY(-50%) translateX(-5px); }
          80% { transform: translateY(-50%) translateX(5px); }
          90% { transform: translateY(-50%) translateX(-2px); }
          100% { transform: translateY(-50%) translateX(0); }
        }
        
        @keyframes shake-packet {
          0% { transform: translateY(-50%) rotate(0deg); }
          25% { transform: translateY(-50%) rotate(-5deg); }
          50% { transform: translateY(-50%) rotate(5deg); }
          75% { transform: translateY(-50%) rotate(-5deg); }
          100% { transform: translateY(-50%) rotate(0deg); }
        }
        
        @keyframes fade-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
        
        .patch-tool {
          transition: all 0.2s ease;
        }
        
        .patch-tool:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .patch-tool:active {
          transform: scale(0.95);
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
                <div className="bg-blue-600 w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center mr-4 border-2 border-blue-400">🛡️</div>
                <span className="text-gray-300">Drag <strong className="text-blue-400">Antivirus</strong> onto <strong className="text-blue-300">Suspicious</strong> packets.</span>
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

          {/* Enhanced Game Board with Better Visual Feedback */}
          <div 
            id="game-board" 
            className="relative w-full h-[400px] bg-gradient-to-r from-gray-900 to-gray-800 border-4 border-gray-600 overflow-hidden mb-4 rounded-lg shadow-inner"
          >
            {/* Network Path with Grid Pattern */}
            <div className="absolute top-1/2 left-0 w-full h-8 bg-gray-800 shadow-inner transform -translate-y-1/2 border-t-2 border-b-2 border-gray-700"></div>
            <div className="absolute top-1/2 left-0 w-full h-2 bg-blue-500 opacity-30 transform -translate-y-1/2 animate-pulse"></div>
            
            {/* Grid Pattern for Visual Appeal */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
            
            {/* Data Core with Enhanced Visual */}
            <div 
              id="data-core"
              className="absolute top-1/2 right-4 w-24 h-32 bg-gradient-to-b from-blue-500 to-blue-700 border-4 border-blue-300 rounded-lg shadow-lg transform -translate-y-1/2 flex flex-col justify-center items-center z-10"
            >
              <span className="text-4xl text-blue-200 mb-1">💾</span>
              <span className="text-xs text-blue-200 font-bold">CORE</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            
            {/* Drop Zone Indicators */}
            <div className="absolute top-4 left-4 text-gray-400 text-sm">
              <p>🎯 Drop patches on matching threats</p>
            </div>
          </div>

          {/* Enhanced Patch Toolbar */}
          <div className="w-full flex justify-center space-x-8 z-40 px-4">
            <div 
              className="patch-tool w-28 h-28 bg-blue-600 border-4 border-blue-400 rounded-xl flex flex-col justify-center items-center font-semibold cursor-grab shadow-lg"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'virus')}
              onDragEnd={handleDragEnd}
              title="Drag to Blue Virus Packets"
            >
              <span className="text-5xl mb-1">🛡️</span>
              <span className="text-sm text-center">Antivirus</span>
            </div>
            <div 
              className="patch-tool w-28 h-28 bg-blue-600 border-4 border-blue-400 rounded-xl flex flex-col justify-center items-center font-semibold cursor-grab shadow-lg"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'spyware')}
              onDragEnd={handleDragEnd}
              title="Drag to Blue Spyware Packets"
            >
              <span className="text-5xl mb-1">🔥</span>
              <span className="text-sm text-center">Firewall</span>
            </div>
            <div 
              className="patch-tool w-28 h-28 bg-orange-600 border-4 border-orange-400 rounded-xl flex flex-col justify-center items-center font-semibold cursor-grab shadow-lg"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, 'ransomware')}
              onDragEnd={handleDragEnd}
              title="Drag to Orange Ransomware Packets"
            >
              <span className="text-5xl mb-1">🔒</span>
              <span className="text-sm text-center">Quarantine</span>
            </div>
          </div>

          {/* Audio Toggle and Info */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button
              onClick={() => setAudioEnabled(prev => !prev)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                audioEnabled 
                  ? 'bg-blue-600 border-blue-400 text-white hover:bg-blue-700' 
                  : 'bg-gray-600 border-gray-400 text-gray-300 hover:bg-gray-700'
              }`}
              title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              <span className="text-lg">{audioEnabled ? '🔊' : '🔇'}</span>
            </button>
            
            <div className="text-center text-gray-400 text-sm">
              <p>💡 Tip: Drag patches onto matching colored threats!</p>
            </div>
            
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